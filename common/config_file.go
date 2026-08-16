package common

import (
	"bytes"
	"errors"
	"flag"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync"

	"gopkg.in/yaml.v3"
)

type StartupConfig struct {
	Site       SiteStartupConfig      `yaml:"site"`
	Server     ServerStartupConfig    `yaml:"server"`
	Database   DatabaseStartupConfig  `yaml:"database"`
	Redis      RedisStartupConfig     `yaml:"redis"`
	Security   SecurityStartupConfig  `yaml:"security"`
	Runtime    RuntimeStartupConfig   `yaml:"runtime"`
	Analytics  AnalyticsStartupConfig `yaml:"analytics"`
	Parameters map[string]any         `yaml:"parameters"`
	Options    map[string]any         `yaml:"options"`
}

type SiteStartupConfig struct {
	SystemName    *string `yaml:"system_name"`
	ServerAddress *string `yaml:"server_address"`
}

type ServerStartupConfig struct {
	Port                   *int    `yaml:"port"`
	Mode                   *string `yaml:"mode"`
	LogDir                 *string `yaml:"log_dir"`
	Timezone               *string `yaml:"timezone"`
	NodeName               *string `yaml:"node_name"`
	NodeType               *string `yaml:"node_type"`
	FrontendBaseURL        *string `yaml:"frontend_base_url"`
	ShutdownTimeoutSeconds *int    `yaml:"shutdown_timeout_seconds"`
}

type DatabaseStartupConfig struct {
	DSN                  *string `yaml:"dsn"`
	LogDSN               *string `yaml:"log_dsn"`
	SQLitePath           *string `yaml:"sqlite_path"`
	MaxIdleConnections   *int    `yaml:"max_idle_connections"`
	MaxOpenConnections   *int    `yaml:"max_open_connections"`
	MaxLifetimeSeconds   *int    `yaml:"max_lifetime_seconds"`
	SlowQueryThresholdMS *int    `yaml:"slow_query_threshold_ms"`
}

type RedisStartupConfig struct {
	ConnectionString   *string `yaml:"connection_string"`
	PoolSize           *int    `yaml:"pool_size"`
	SyncFrequency      *int    `yaml:"sync_frequency"`
	MemoryCacheEnabled *bool   `yaml:"memory_cache_enabled"`
}

type SecurityStartupConfig struct {
	SessionSecret         *string  `yaml:"session_secret"`
	CryptoSecret          *string  `yaml:"crypto_secret"`
	SessionCookieSecure   *bool    `yaml:"session_cookie_secure"`
	SessionTrustedOrigins []string `yaml:"session_trusted_origins"`
	TrustedProxies        []string `yaml:"trusted_proxies"`
	TLSInsecureSkipVerify *bool    `yaml:"tls_insecure_skip_verify"`
}

type RuntimeStartupConfig struct {
	DebugEnabled           *bool `yaml:"debug_enabled"`
	BatchUpdateEnabled     *bool `yaml:"batch_update_enabled"`
	BatchUpdateInterval    *int  `yaml:"batch_update_interval"`
	ChannelUpdateFrequency *int  `yaml:"channel_update_frequency"`
	RelayTimeout           *int  `yaml:"relay_timeout"`
	RelayIdleConnTimeout   *int  `yaml:"relay_idle_connection_timeout"`
	StreamingTimeout       *int  `yaml:"streaming_timeout"`
	UpdateTask             *bool `yaml:"update_task"`
	ErrorLogEnabled        *bool `yaml:"error_log_enabled"`
	EnablePProf            *bool `yaml:"enable_pprof"`
}

type AnalyticsStartupConfig struct {
	UmamiWebsiteID  *string `yaml:"umami_website_id"`
	UmamiScriptURL  *string `yaml:"umami_script_url"`
	GoogleAnalytics *string `yaml:"google_analytics_id"`
}

var (
	configParameterName = regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_]*$`)
	startupConfigMu     sync.RWMutex
	startupParameters   = map[string]string{}
	startupOptions      = map[string]string{}
)

func LoadStartupConfig() error {
	ParseFlags()

	path := strings.TrimSpace(*ConfigFile)
	required := false
	flag.Visit(func(current *flag.Flag) {
		if current.Name == "config" {
			required = true
		}
	})
	if !required {
		if configuredPath := strings.TrimSpace(os.Getenv("CONFIG_FILE")); configuredPath != "" {
			path = configuredPath
			required = true
		}
	}
	if path == "" {
		return nil
	}

	err := LoadStartupConfigFile(path)
	if errors.Is(err, os.ErrNotExist) && !required {
		return nil
	}
	return err
}

func LoadStartupConfigFile(path string) error {
	content, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("read configuration file %q: %w", path, err)
	}

	var config StartupConfig
	decoder := yaml.NewDecoder(bytes.NewReader(content))
	decoder.KnownFields(true)
	if err := decoder.Decode(&config); err != nil {
		return fmt.Errorf("parse configuration file %q: %w", path, err)
	}

	parameters, options, err := config.values()
	if err != nil {
		return fmt.Errorf("validate configuration file %q: %w", path, err)
	}
	startupConfigMu.Lock()
	startupParameters = parameters
	startupOptions = options
	startupConfigMu.Unlock()
	return nil
}

func GetConfigOrEnv(name string) string {
	value, _ := LookupConfigOrEnv(name)
	return value
}

func LookupConfigOrEnv(name string) (string, bool) {
	startupConfigMu.RLock()
	value, configured := startupParameters[name]
	startupConfigMu.RUnlock()
	if configured {
		return value, true
	}
	return os.LookupEnv(name)
}

func StartupOptionOverrides() map[string]string {
	startupConfigMu.RLock()
	defer startupConfigMu.RUnlock()

	result := make(map[string]string, len(startupOptions))
	for key, value := range startupOptions {
		result[key] = value
	}
	return result
}

func (config StartupConfig) values() (map[string]string, map[string]string, error) {
	parameters := make(map[string]string, len(config.Parameters)+32)
	for name, rawValue := range config.Parameters {
		if !configParameterName.MatchString(name) {
			return nil, nil, fmt.Errorf("parameters.%s is not a valid parameter name", name)
		}
		value, err := startupConfigValue(rawValue)
		if err != nil {
			return nil, nil, fmt.Errorf("parameters.%s: %w", name, err)
		}
		parameters[name] = value
	}

	setStringParameter(parameters, "PORT", config.Server.Port)
	setStringParameter(parameters, "GIN_MODE", config.Server.Mode)
	setStringParameter(parameters, "LOG_DIR", config.Server.LogDir)
	setStringParameter(parameters, "TZ", config.Server.Timezone)
	setStringParameter(parameters, "NODE_NAME", config.Server.NodeName)
	setStringParameter(parameters, "NODE_TYPE", config.Server.NodeType)
	setStringParameter(parameters, "FRONTEND_BASE_URL", config.Server.FrontendBaseURL)
	setStringParameter(parameters, "SHUTDOWN_TIMEOUT_SECONDS", config.Server.ShutdownTimeoutSeconds)

	setStringParameter(parameters, "SQL_DSN", config.Database.DSN)
	setStringParameter(parameters, "LOG_SQL_DSN", config.Database.LogDSN)
	setStringParameter(parameters, "SQLITE_PATH", config.Database.SQLitePath)
	setStringParameter(parameters, "SQL_MAX_IDLE_CONNS", config.Database.MaxIdleConnections)
	setStringParameter(parameters, "SQL_MAX_OPEN_CONNS", config.Database.MaxOpenConnections)
	setStringParameter(parameters, "SQL_MAX_LIFETIME", config.Database.MaxLifetimeSeconds)
	setStringParameter(parameters, "SQL_SLOW_THRESHOLD_MS", config.Database.SlowQueryThresholdMS)

	setStringParameter(parameters, "REDIS_CONN_STRING", config.Redis.ConnectionString)
	setStringParameter(parameters, "REDIS_POOL_SIZE", config.Redis.PoolSize)
	setStringParameter(parameters, "SYNC_FREQUENCY", config.Redis.SyncFrequency)
	setStringParameter(parameters, "MEMORY_CACHE_ENABLED", config.Redis.MemoryCacheEnabled)

	setStringParameter(parameters, "SESSION_SECRET", config.Security.SessionSecret)
	setStringParameter(parameters, "CRYPTO_SECRET", config.Security.CryptoSecret)
	setStringParameter(parameters, "SESSION_COOKIE_SECURE", config.Security.SessionCookieSecure)
	if config.Security.SessionTrustedOrigins != nil {
		parameters["SESSION_COOKIE_TRUSTED_URL"] = strings.Join(config.Security.SessionTrustedOrigins, ",")
	}
	if config.Security.TrustedProxies != nil {
		parameters["TRUSTED_PROXIES"] = strings.Join(config.Security.TrustedProxies, ",")
	}
	setStringParameter(parameters, "TLS_INSECURE_SKIP_VERIFY", config.Security.TLSInsecureSkipVerify)

	setStringParameter(parameters, "DEBUG", config.Runtime.DebugEnabled)
	setStringParameter(parameters, "BATCH_UPDATE_ENABLED", config.Runtime.BatchUpdateEnabled)
	setStringParameter(parameters, "BATCH_UPDATE_INTERVAL", config.Runtime.BatchUpdateInterval)
	setStringParameter(parameters, "CHANNEL_UPDATE_FREQUENCY", config.Runtime.ChannelUpdateFrequency)
	setStringParameter(parameters, "RELAY_TIMEOUT", config.Runtime.RelayTimeout)
	setStringParameter(parameters, "RELAY_IDLE_CONN_TIMEOUT", config.Runtime.RelayIdleConnTimeout)
	setStringParameter(parameters, "STREAMING_TIMEOUT", config.Runtime.StreamingTimeout)
	setStringParameter(parameters, "UPDATE_TASK", config.Runtime.UpdateTask)
	setStringParameter(parameters, "ERROR_LOG_ENABLED", config.Runtime.ErrorLogEnabled)
	setStringParameter(parameters, "ENABLE_PPROF", config.Runtime.EnablePProf)

	setStringParameter(parameters, "UMAMI_WEBSITE_ID", config.Analytics.UmamiWebsiteID)
	setStringParameter(parameters, "UMAMI_SCRIPT_URL", config.Analytics.UmamiScriptURL)
	setStringParameter(parameters, "GOOGLE_ANALYTICS_ID", config.Analytics.GoogleAnalytics)

	options := make(map[string]string, len(config.Options)+2)
	for name, rawValue := range config.Options {
		if strings.TrimSpace(name) == "" {
			return nil, nil, errors.New("option name cannot be empty")
		}
		value, err := startupConfigValue(rawValue)
		if err != nil {
			return nil, nil, fmt.Errorf("options.%s: %w", name, err)
		}
		options[name] = value
	}
	if config.Site.SystemName != nil {
		options["SystemName"] = *config.Site.SystemName
	}
	if config.Site.ServerAddress != nil {
		options["ServerAddress"] = *config.Site.ServerAddress
	}

	if config.Server.Port != nil && (*config.Server.Port < 1 || *config.Server.Port > 65535) {
		return nil, nil, errors.New("server.port must be between 1 and 65535")
	}
	return parameters, options, nil
}

func setStringParameter[T ~string | ~int | ~bool](parameters map[string]string, name string, value *T) {
	if value == nil {
		return
	}
	parameters[name] = fmt.Sprint(*value)
}

func startupConfigValue(rawValue any) (string, error) {
	switch value := rawValue.(type) {
	case string:
		return value, nil
	case bool:
		return strconv.FormatBool(value), nil
	case int:
		return strconv.Itoa(value), nil
	case int64:
		return strconv.FormatInt(value, 10), nil
	case uint64:
		return strconv.FormatUint(value, 10), nil
	case float64:
		return strconv.FormatFloat(value, 'f', -1, 64), nil
	case []any:
		parts := make([]string, 0, len(value))
		for _, item := range value {
			part, err := startupConfigValue(item)
			if err != nil {
				return "", err
			}
			parts = append(parts, part)
		}
		return strings.Join(parts, ","), nil
	case nil:
		return "", errors.New("value cannot be null")
	default:
		return "", fmt.Errorf("value must be a scalar or list, got %T", rawValue)
	}
}
