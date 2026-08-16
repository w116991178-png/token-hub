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
export const INTERFACE_LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'zh-TW', label: '繁體中文' },
] as const

export const DEFAULT_INTERFACE_LANGUAGE = 'en'
export const INTERFACE_LANGUAGE_DETECTION_ORDER = ['localStorage']

export type InterfaceLanguageCode =
  (typeof INTERFACE_LANGUAGE_OPTIONS)[number]['code']

export function normalizeInterfaceLanguage(value?: string | null): string {
  if (!value) return DEFAULT_INTERFACE_LANGUAGE

  const normalized = value.trim().replaceAll('_', '-').toLowerCase()
  if (normalized.startsWith('zh')) return 'zh-TW'

  const supportedLanguage = INTERFACE_LANGUAGE_OPTIONS.find(
    (language) => language.code.toLowerCase() === normalized
  )
  return supportedLanguage?.code ?? DEFAULT_INTERFACE_LANGUAGE
}

/**
 * Map a browser-detected locale onto the interface language codes this project
 * uses with i18next.
 *
 * Every Chinese locale intentionally resolves to Traditional Chinese because
 * the product does not target the Simplified Chinese market. Non-Chinese codes
 * pass through for i18next's normal matching (e.g. `fr-FR` -> `fr`).
 */
export function convertDetectedLanguage(value: string): string {
  const lower = value.trim().replaceAll('_', '-').toLowerCase()
  if (!lower.startsWith('zh')) return value
  return 'zh-TW'
}

/**
 * Convert an interface language code into a valid BCP-47 locale tag that the
 * `Intl.*` APIs accept. Legacy Chinese codes are migrated to Traditional.
 *
 * `new Intl.NumberFormat('zhCN')` throws `RangeError: Invalid language tag`, so
 * any locale derived from `i18n.language` / `i18n.resolvedLanguage` MUST be run
 * through this before it reaches an `Intl` constructor. Unknown values fall back
 * to `undefined`, which makes `Intl` use the runtime default locale.
 */
export function toIntlLocale(value?: string | null): string | undefined {
  if (!value) return undefined
  const normalized = value.trim().replaceAll('_', '-').toLowerCase()
  if (normalized.startsWith('zh')) return 'zh-TW'

  try {
    return Intl.getCanonicalLocales(value)[0]
  } catch {
    return undefined
  }
}
