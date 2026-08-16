package model

import (
	"errors"
	"fmt"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"

	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func setupAffiliateTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	previousDB := DB
	previousRedisEnabled := common.RedisEnabled
	previousMainDatabaseType, previousLogDatabaseType := common.MainDatabaseType(), common.LogDatabaseType()
	common.RedisEnabled = false
	common.SetDatabaseTypes(common.DatabaseTypeSQLite, common.DatabaseTypeSQLite)

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	require.NoError(t, err)
	DB = db
	require.NoError(t, db.AutoMigrate(&User{}))

	t.Cleanup(func() {
		DB = previousDB
		common.RedisEnabled = previousRedisEnabled
		common.SetDatabaseTypes(previousMainDatabaseType, previousLogDatabaseType)
		sqlDB, err := db.DB()
		if err == nil {
			_ = sqlDB.Close()
		}
	})
	return db
}

func TestValidateAffiliateSubdomainProtectsDomainNamespace(t *testing.T) {
	for _, value := range []string{"partner", "ab", "a1b", "partner-01"} {
		assert.NoError(t, ValidateAffiliateSubdomain(value), value)
	}

	for _, value := range []string{"", "a", "a1", "-partner", "partner-", "partner--one", "1partner"} {
		assert.ErrorIs(t, ValidateAffiliateSubdomain(value), map[bool]error{
			true:  ErrAffiliateSubdomainRequired,
			false: ErrAffiliateSubdomainInvalid,
		}[value == ""], value)
	}

	for _, value := range []string{"admin", "master", "mail", "api", "server", "www", "root", "auth"} {
		assert.ErrorIs(t, ValidateAffiliateSubdomain(value), ErrAffiliateSubdomainReserved, value)
	}
}

func TestAffiliateResolverOnlyUsesEnabledUniqueSubdomains(t *testing.T) {
	db := setupAffiliateTestDB(t)
	prefix := "partner"
	user := User{
		Username: "affiliate-owner", Password: "password", Role: common.RoleCommonUser,
		Status: common.UserStatusEnabled, Group: "default", AffCode: "legacy-code",
		AffEnabled: false, AffSubdomain: &prefix,
	}
	require.NoError(t, db.Create(&user).Error)

	_, err := GetUserIdByAffCode(prefix)
	assert.Error(t, err)

	require.NoError(t, UpdateUserAffiliateSettingsWithTx(db, user.Id, true, " Partner "))
	inviterID, err := GetUserIdByAffCode("PARTNER")
	require.NoError(t, err)
	assert.Equal(t, user.Id, inviterID)

	_, err = ValidateAffiliateSubdomainAvailable(db, prefix, 0)
	assert.ErrorIs(t, err, ErrAffiliateSubdomainInUse)

	require.NoError(t, UpdateUserAffiliateSettingsWithTx(db, user.Id, false, ""))
	_, err = GetUserIdByAffCode(prefix)
	assert.Error(t, err)

	var updated User
	require.NoError(t, db.First(&updated, user.Id).Error)
	assert.False(t, updated.AffEnabled)
	require.NotNil(t, updated.AffSubdomain)
	assert.Equal(t, prefix, *updated.AffSubdomain)
}

func TestAffiliateSubdomainAvailabilityRejectsExistingAssignment(t *testing.T) {
	db := setupAffiliateTestDB(t)
	prefix := "agency"
	require.NoError(t, db.Create(&User{
		Username: "first-agent", Password: "password", AffCode: "first-code", AffSubdomain: &prefix,
	}).Error)

	_, err := ValidateAffiliateSubdomainAvailable(db, prefix, 0)
	require.Error(t, err)
	assert.True(t, errors.Is(err, ErrAffiliateSubdomainInUse))
}
