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
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
  convertDetectedLanguage,
  DEFAULT_INTERFACE_LANGUAGE,
  INTERFACE_LANGUAGE_DETECTION_ORDER,
  INTERFACE_LANGUAGE_OPTIONS,
  normalizeInterfaceLanguage,
  toIntlLocale,
} from '../languages'

describe('interface language availability', () => {
  test('defaults to English without following the browser language', () => {
    assert.equal(DEFAULT_INTERFACE_LANGUAGE, 'en')
    assert.equal(normalizeInterfaceLanguage(), 'en')
    assert.deepEqual(INTERFACE_LANGUAGE_DETECTION_ORDER, ['localStorage'])
    assert.equal(
      INTERFACE_LANGUAGE_DETECTION_ORDER.includes('navigator'),
      false
    )
  })

  test('offers Traditional Chinese without a Simplified Chinese option', () => {
    const chineseOptions = INTERFACE_LANGUAGE_OPTIONS.filter((language) =>
      language.code.startsWith('zh')
    )

    assert.deepEqual(chineseOptions, [{ code: 'zh-TW', label: '繁體中文' }])
  })

  test('migrates every legacy Chinese preference to Traditional Chinese', () => {
    const legacyChineseCodes = [
      'zh',
      'zh-CN',
      'zh-Hans',
      'zhCN',
      'zh-TW',
      'zh-Hant',
      'zhTW',
    ]

    for (const code of legacyChineseCodes) {
      assert.equal(normalizeInterfaceLanguage(code), 'zh-TW')
      assert.equal(convertDetectedLanguage(code), 'zh-TW')
      assert.equal(toIntlLocale(code), 'zh-TW')
    }
  })
})
