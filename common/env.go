package common

import (
	"fmt"
	"strconv"
)

func GetEnvOrDefault(env string, defaultValue int) int {
	value := GetConfigOrEnv(env)
	if env == "" || value == "" {
		return defaultValue
	}
	num, err := strconv.Atoi(value)
	if err != nil {
		SysError(fmt.Sprintf("failed to parse %s: %s, using default value: %d", env, err.Error(), defaultValue))
		return defaultValue
	}
	return num
}

func GetEnvOrDefaultString(env string, defaultValue string) string {
	value := GetConfigOrEnv(env)
	if env == "" || value == "" {
		return defaultValue
	}
	return value
}

func GetEnvOrDefaultBool(env string, defaultValue bool) bool {
	value := GetConfigOrEnv(env)
	if env == "" || value == "" {
		return defaultValue
	}
	b, err := strconv.ParseBool(value)
	if err != nil {
		SysError(fmt.Sprintf("failed to parse %s: %s, using default value: %t", env, err.Error(), defaultValue))
		return defaultValue
	}
	return b
}
