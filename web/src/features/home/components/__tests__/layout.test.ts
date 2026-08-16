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

import { TOKEN_HUB_BRAND, TOKEN_HUB_LAYOUT } from '../../config'

describe('Token Hub landing layout', () => {
  test('stacks the hero on small screens and splits it on large screens', () => {
    const classes = TOKEN_HUB_LAYOUT.hero.split(' ')

    assert.ok(classes.includes('grid'))
    assert.ok(classes.includes('lg:grid-cols-[1.12fr_0.88fr]'))
  })

  test('keeps metrics readable in two columns before expanding to four', () => {
    const classes = TOKEN_HUB_LAYOUT.stats.split(' ')

    assert.ok(classes.includes('grid-cols-2'))
    assert.ok(classes.includes('md:grid-cols-4'))
  })

  test('expands feature cards progressively without horizontal overflow', () => {
    const classes = TOKEN_HUB_LAYOUT.features.split(' ')

    assert.ok(classes.includes('md:grid-cols-2'))
    assert.ok(classes.includes('lg:grid-cols-3'))
  })

  test('uses the production domain for the public API base', () => {
    const apiBase = new URL(TOKEN_HUB_BRAND.apiBase)

    assert.equal(apiBase.protocol, 'https:')
    assert.equal(apiBase.hostname, 'token-hub.io')
    assert.equal(apiBase.pathname, '/v1')
  })
})
