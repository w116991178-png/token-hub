/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
package i18n

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestChineseLocalesResolveToTraditionalChinese(t *testing.T) {
	t.Parallel()

	tests := []string{
		"zh",
		"zh-CN",
		"zh-Hans",
		"zhCN",
		"zh-TW",
		"zh-Hant",
		"zhTW",
	}

	for _, language := range tests {
		t.Run(language, func(t *testing.T) {
			t.Parallel()
			assert.Equal(t, LangZhTW, ParseAcceptLanguage(language))
		})
	}
}

func TestSupportedLanguagesExcludeSimplifiedChinese(t *testing.T) {
	t.Parallel()

	languages := SupportedLanguages()
	assert.Contains(t, languages, LangZhTW)
	assert.Contains(t, languages, LangEn)
	assert.NotContains(t, languages, LangZhCN)
}
