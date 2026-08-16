package model

import (
	"errors"
	"regexp"
	"strings"

	"gorm.io/gorm"
)

var (
	ErrAffiliateSubdomainRequired = errors.New("referral subdomain is required")
	ErrAffiliateSubdomainInvalid  = errors.New("referral subdomain is invalid")
	ErrAffiliateSubdomainReserved = errors.New("referral subdomain is reserved")
	ErrAffiliateSubdomainInUse    = errors.New("referral subdomain is already in use")
)

var affiliateSubdomainPattern = regexp.MustCompile(`^[a-z][a-z0-9-]{1,62}$`)

var reservedAffiliateSubdomains = map[string]struct{}{
	"admin": {}, "administrator": {}, "api": {}, "app": {}, "assets": {},
	"auth": {}, "billing": {}, "blog": {}, "cdn": {}, "console": {},
	"dashboard": {}, "demo": {}, "dev": {}, "docs": {}, "download": {},
	"email": {}, "files": {}, "ftp": {}, "git": {}, "help": {},
	"img": {}, "internal": {}, "intranet": {}, "login": {}, "mail": {},
	"master": {}, "media": {}, "news": {}, "oauth": {}, "payment": {},
	"payments": {}, "pop": {}, "pop3": {}, "register": {}, "root": {},
	"secure": {}, "security": {}, "server": {}, "sftp": {}, "shop": {},
	"signup": {}, "smtp": {}, "ssh": {}, "stage": {}, "staging": {},
	"static": {}, "status": {}, "store": {}, "support": {}, "test": {},
	"testing": {}, "token-hub": {}, "tokenhub": {}, "upload": {}, "uploads": {},
	"user": {}, "users": {}, "wallet": {}, "web": {}, "www": {},
}

func NormalizeAffiliateSubdomain(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func ValidateAffiliateSubdomain(value string) error {
	value = NormalizeAffiliateSubdomain(value)
	if value == "" {
		return ErrAffiliateSubdomainRequired
	}
	if !affiliateSubdomainPattern.MatchString(value) || strings.HasSuffix(value, "-") || strings.Contains(value, "--") {
		return ErrAffiliateSubdomainInvalid
	}
	letterCount := 0
	for _, char := range value {
		if char >= 'a' && char <= 'z' {
			letterCount++
		}
	}
	if letterCount < 2 || strings.HasPrefix(value, "xn--") {
		return ErrAffiliateSubdomainInvalid
	}
	if _, reserved := reservedAffiliateSubdomains[value]; reserved {
		return ErrAffiliateSubdomainReserved
	}
	return nil
}

func ValidateAffiliateSubdomainAvailable(tx *gorm.DB, value string, excludeUserID int) (string, error) {
	value = NormalizeAffiliateSubdomain(value)
	if err := ValidateAffiliateSubdomain(value); err != nil {
		return "", err
	}
	query := tx.Unscoped().Model(&User{}).Where("aff_subdomain = ?", value)
	if excludeUserID > 0 {
		query = query.Where("id <> ?", excludeUserID)
	}
	var count int64
	if err := query.Count(&count).Error; err != nil {
		return "", err
	}
	if count > 0 {
		return "", ErrAffiliateSubdomainInUse
	}
	return value, nil
}

func UpdateUserAffiliateSettingsWithTx(tx *gorm.DB, userID int, enabled bool, subdomain string) error {
	if !enabled {
		return tx.Model(&User{}).Where("id = ?", userID).Update("aff_enabled", false).Error
	}
	normalized, err := ValidateAffiliateSubdomainAvailable(tx, subdomain, userID)
	if err != nil {
		return err
	}
	return tx.Model(&User{}).Where("id = ?", userID).Updates(map[string]interface{}{
		"aff_enabled":   true,
		"aff_subdomain": normalized,
	}).Error
}
