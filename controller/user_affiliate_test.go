package controller

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func performUpdateUserAffiliateRequest(t *testing.T, body string) *httptest.ResponseRecorder {
	t.Helper()
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodPut, "/api/user/", strings.NewReader(body))
	c.Request.Header.Set("Content-Type", "application/json")
	c.Set("id", 9999)
	c.Set("role", common.RoleAdminUser)
	c.Set("username", "admin-operator")
	UpdateUser(c)
	return recorder
}

func TestUpdateUserControlsReferralAgentAndValidatesPrefix(t *testing.T) {
	db := setupManageUserTestDB(t)
	user := model.User{
		Username: "managed-agent", Password: "password", DisplayName: "Managed Agent",
		Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Group: "default",
		AuthVersion: 1, AffCode: "managed-aff",
	}
	require.NoError(t, db.Create(&user).Error)

	recorder := performUpdateUserAffiliateRequest(t, fmt.Sprintf(
		`{"id":%d,"username":"managed-agent","display_name":"Managed Agent","group":"default","aff_enabled":true,"aff_subdomain":"Partner-01"}`,
		user.Id,
	))
	assert.Contains(t, recorder.Body.String(), `"success":true`)

	var updated model.User
	require.NoError(t, db.First(&updated, user.Id).Error)
	assert.True(t, updated.AffEnabled)
	require.NotNil(t, updated.AffSubdomain)
	assert.Equal(t, "partner-01", *updated.AffSubdomain)

	recorder = performUpdateUserAffiliateRequest(t, fmt.Sprintf(
		`{"id":%d,"username":"managed-agent","display_name":"Managed Agent","group":"default","aff_enabled":true,"aff_subdomain":"admin"}`,
		user.Id,
	))
	assert.Contains(t, recorder.Body.String(), `"success":false`)
	assert.Contains(t, recorder.Body.String(), "affiliate_subdomain_reserved")

	require.NoError(t, db.First(&updated, user.Id).Error)
	assert.True(t, updated.AffEnabled)
	assert.Equal(t, "partner-01", *updated.AffSubdomain)

	recorder = performUpdateUserAffiliateRequest(t, fmt.Sprintf(
		`{"id":%d,"username":"managed-agent","display_name":"Managed Agent","group":"default","aff_enabled":false,"aff_subdomain":""}`,
		user.Id,
	))
	assert.Contains(t, recorder.Body.String(), `"success":true`)
	require.NoError(t, db.First(&updated, user.Id).Error)
	assert.False(t, updated.AffEnabled)
}
