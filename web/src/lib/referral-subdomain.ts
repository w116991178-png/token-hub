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

export const REFERRAL_ROOT_DOMAIN = 'token-hub.io'

export const REFERRAL_SUBDOMAIN_REQUIRED_MESSAGE =
  'A subdomain prefix is required when the referral agent is enabled'
export const REFERRAL_SUBDOMAIN_INVALID_MESSAGE =
  'The subdomain prefix must contain at least two letters and may only use lowercase letters, numbers, or single hyphens'
export const REFERRAL_SUBDOMAIN_RESERVED_MESSAGE =
  'This subdomain prefix is reserved and cannot be used'

const referralSubdomainPattern = /^[a-z][a-z0-9-]{1,62}$/

const reservedReferralSubdomains = new Set([
  'admin',
  'administrator',
  'api',
  'app',
  'assets',
  'auth',
  'billing',
  'blog',
  'cdn',
  'console',
  'dashboard',
  'demo',
  'dev',
  'docs',
  'download',
  'email',
  'files',
  'ftp',
  'git',
  'help',
  'img',
  'internal',
  'intranet',
  'login',
  'mail',
  'master',
  'media',
  'news',
  'oauth',
  'payment',
  'payments',
  'pop',
  'pop3',
  'register',
  'root',
  'secure',
  'security',
  'server',
  'sftp',
  'shop',
  'signup',
  'smtp',
  'ssh',
  'stage',
  'staging',
  'static',
  'status',
  'store',
  'support',
  'test',
  'testing',
  'token-hub',
  'tokenhub',
  'upload',
  'uploads',
  'user',
  'users',
  'wallet',
  'web',
  'www',
])

export function normalizeReferralSubdomain(value: string): string {
  return value.trim().toLowerCase()
}

export function validateReferralSubdomain(value: string): string | undefined {
  const normalized = normalizeReferralSubdomain(value)
  if (!normalized) return REFERRAL_SUBDOMAIN_REQUIRED_MESSAGE

  const letterCount = [...normalized].filter(
    (character) => character >= 'a' && character <= 'z'
  ).length
  if (
    !referralSubdomainPattern.test(normalized) ||
    normalized.endsWith('-') ||
    normalized.includes('--') ||
    normalized.startsWith('xn--') ||
    letterCount < 2
  ) {
    return REFERRAL_SUBDOMAIN_INVALID_MESSAGE
  }

  if (reservedReferralSubdomains.has(normalized)) {
    return REFERRAL_SUBDOMAIN_RESERVED_MESSAGE
  }

  return undefined
}
