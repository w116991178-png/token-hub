package common

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestStartupConfigValuesExposeStructuredAndCompatibilitySettings(t *testing.T) {
	port := 3100
	mode := "release"
	memoryCache := true
	sessionSecret := "configuration-secret"
	systemName := "token-hub"
	serverAddress := "https://token-hub.io"
	config := StartupConfig{
		Site: SiteStartupConfig{
			SystemName:    &systemName,
			ServerAddress: &serverAddress,
		},
		Server: ServerStartupConfig{
			Port: &port,
			Mode: &mode,
		},
		Redis: RedisStartupConfig{
			MemoryCacheEnabled: &memoryCache,
		},
		Security: SecurityStartupConfig{
			SessionSecret:         &sessionSecret,
			SessionTrustedOrigins: []string{"https://token-hub.io", "https://ab.token-hub.io"},
			TrustedProxies:        []string{"127.0.0.1", "10.0.0.0/8"},
		},
		Parameters: map[string]any{
			"PORT":                     9999,
			"CountToken":               false,
			"GLOBAL_API_RATE_LIMIT":    500,
			"TRUSTED_REDIRECT_DOMAINS": []any{"token-hub.io", "example.net"},
		},
	}

	parameters, options, err := config.values()
	require.NoError(t, err)
	assert.Equal(t, "3100", parameters["PORT"])
	assert.Equal(t, "release", parameters["GIN_MODE"])
	assert.Equal(t, "true", parameters["MEMORY_CACHE_ENABLED"])
	assert.Equal(t, "configuration-secret", parameters["SESSION_SECRET"])
	assert.Equal(t, "https://token-hub.io,https://ab.token-hub.io", parameters["SESSION_COOKIE_TRUSTED_URL"])
	assert.Equal(t, "127.0.0.1,10.0.0.0/8", parameters["TRUSTED_PROXIES"])
	assert.Equal(t, "false", parameters["CountToken"])
	assert.Equal(t, "500", parameters["GLOBAL_API_RATE_LIMIT"])
	assert.Equal(t, "token-hub.io,example.net", parameters["TRUSTED_REDIRECT_DOMAINS"])
	assert.Equal(t, "token-hub", options["SystemName"])
	assert.Equal(t, "https://token-hub.io", options["ServerAddress"])
}

func TestLookupConfigOrEnvPrefersConfigurationAndFallsBackToEnvironment(t *testing.T) {
	const configuredName = "TOKEN_HUB_CONFIG_LOOKUP_TEST"
	const supplementalName = "TOKEN_HUB_ENV_LOOKUP_TEST"
	t.Setenv(configuredName, "environment-value")
	t.Setenv(supplementalName, "supplemental-value")

	startupConfigMu.Lock()
	previousParameters := startupParameters
	startupParameters = map[string]string{configuredName: "configuration-value"}
	startupConfigMu.Unlock()
	t.Cleanup(func() {
		startupConfigMu.Lock()
		startupParameters = previousParameters
		startupConfigMu.Unlock()
	})

	assert.Equal(t, "configuration-value", GetConfigOrEnv(configuredName))
	assert.Equal(t, "supplemental-value", GetConfigOrEnv(supplementalName))
}

func TestLoadStartupConfigFileAppliesYAMLAsPrimarySource(t *testing.T) {
	const parameterName = "TOKEN_HUB_FILE_LOAD_TEST"
	t.Setenv(parameterName, "environment-value")

	startupConfigMu.Lock()
	previousParameters := startupParameters
	previousOptions := startupOptions
	startupConfigMu.Unlock()
	t.Cleanup(func() {
		startupConfigMu.Lock()
		startupParameters = previousParameters
		startupOptions = previousOptions
		startupConfigMu.Unlock()
	})

	path := filepath.Join(t.TempDir(), "config.yaml")
	content := "site:\n  system_name: token-hub\nparameters:\n  " + parameterName + ": configuration-value\n"
	err := os.WriteFile(path, []byte(content), 0o600)
	require.NoError(t, err)
	require.NoError(t, LoadStartupConfigFile(path))

	assert.Equal(t, "configuration-value", GetConfigOrEnv(parameterName))
	assert.Equal(t, "token-hub", StartupOptionOverrides()["SystemName"])
}

func TestLoadStartupConfigFileRejectsUnknownAndInvalidValues(t *testing.T) {
	t.Run("unknown structured field", func(t *testing.T) {
		path := filepath.Join(t.TempDir(), "config.yaml")
		err := os.WriteFile(path, []byte("server:\n  unsupported: true\n"), 0o600)
		require.NoError(t, err)

		err = LoadStartupConfigFile(path)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "field unsupported not found")
	})

	t.Run("invalid port", func(t *testing.T) {
		path := filepath.Join(t.TempDir(), "config.yaml")
		err := os.WriteFile(path, []byte("server:\n  port: 70000\n"), 0o600)
		require.NoError(t, err)

		err = LoadStartupConfigFile(path)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "server.port must be between 1 and 65535")
	})

	t.Run("nested compatibility value", func(t *testing.T) {
		path := filepath.Join(t.TempDir(), "config.yaml")
		err := os.WriteFile(path, []byte("parameters:\n  INVALID:\n    nested: value\n"), 0o600)
		require.NoError(t, err)

		err = LoadStartupConfigFile(path)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "value must be a scalar or list")
	})
}
