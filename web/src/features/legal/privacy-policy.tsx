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
import { useTranslation } from 'react-i18next'

import { getPrivacyPolicy } from './api'
import { LegalDocument } from './legal-document'

export function PrivacyPolicy() {
  const { t } = useTranslation()
  return (
    <LegalDocument
      title={t('Privacy Policy')}
      queryKey='privacy-policy'
      fetchDocument={getPrivacyPolicy}
      description={t(
        'Learn what information token-hub processes, why it is used, when it may be shared, and what privacy choices are available.'
      )}
      canonicalPath='/privacy-policy'
      defaultContent={
        <>
          <section>
            <h2>{t('1. Scope')}</h2>
            <p>
              {t(
                'This Privacy Policy explains how the operator of token-hub processes information when you visit the website, create an account, manage API credentials, or send requests through the gateway.'
              )}
            </p>
          </section>

          <section>
            <h2>{t('2. Information we process')}</h2>
            <ul>
              <li>
                {t(
                  'Account information, such as your username, email address, authentication method, account role, and account status.'
                )}
              </li>
              <li>
                {t(
                  'Service and billing information, including API keys, balances, quotas, subscription or payment records, and referral relationships.'
                )}
              </li>
              <li>
                {t(
                  'Usage and diagnostic information, such as model names, token counts, request timing, status codes, errors, IP addresses, device or browser details, and security events.'
                )}
              </li>
              <li>
                {t(
                  'Request content and generated output when needed to relay a request, provide requested functionality, investigate abuse, or retain logs under the operator’s configured logging policy.'
                )}
              </li>
            </ul>
          </section>

          <section>
            <h2>{t('3. How information is used')}</h2>
            <p>
              {t(
                'Information is used to provide and secure the service, authenticate users, route requests, calculate usage and charges, prevent fraud or abuse, diagnose failures, improve reliability, communicate service changes, and comply with legal obligations.'
              )}
            </p>
          </section>

          <section>
            <h2>{t('4. AI providers and other recipients')}</h2>
            <p>
              {t(
                'Requests are sent to the AI provider or infrastructure selected for processing. Those providers process submitted content under their own terms and privacy policies. Information may also be shared with hosting, database, cache, analytics, authentication, payment, and security providers when they are configured for this deployment, or when disclosure is required by law.'
              )}
            </p>
          </section>

          <section>
            <h2>{t('5. Cookies and local storage')}</h2>
            <p>
              {t(
                'token-hub uses cookies or browser storage for essential functions such as authentication, session security, language, theme, and interface preferences. Optional analytics may be enabled by the operator and should be reflected in the deployed configuration and consent controls where required.'
              )}
            </p>
          </section>

          <section>
            <h2>{t('6. Retention and security')}</h2>
            <p>
              {t(
                'Information is retained only for as long as needed for service delivery, security, accounting, dispute handling, and legal compliance, subject to the deployment’s configured retention periods. Reasonable technical and organizational safeguards are used, but no internet service can guarantee absolute security.'
              )}
            </p>
          </section>

          <section>
            <h2>{t('7. International processing')}</h2>
            <p>
              {t(
                'AI providers and infrastructure services may process information in countries other than your own. By selecting or using those providers, information may be transferred under the safeguards and terms applicable to the operator and provider.'
              )}
            </p>
          </section>

          <section>
            <h2>{t('8. Your choices and rights')}</h2>
            <p>
              {t(
                'Depending on applicable law, you may request access, correction, deletion, restriction, objection, or portability of personal information. You may also sign out, rotate or delete API keys, and stop using the service. Some records may be retained where required for security, billing, or legal compliance.'
              )}
            </p>
          </section>

          <section>
            <h2>{t('9. Children')}</h2>
            <p>
              {t(
                'The service is intended for users who can lawfully enter into the applicable agreement. It is not directed to children, and the operator does not knowingly collect personal information from children contrary to applicable law.'
              )}
            </p>
          </section>

          <section>
            <h2>{t('10. Changes and contact')}</h2>
            <p>
              {t(
                'This policy may be updated as the service or legal requirements change. The updated date will be shown on this page. For privacy questions, use the support channel provided by the site operator or the project repository. Do not post API keys, request content, or personal information in a public issue.'
              )}
            </p>
            <p>
              <a
                href='https://github.com/w116991178-png/token-hub'
                target='_blank'
                rel='noopener noreferrer'
                className='text-[#4f5600] underline underline-offset-4 dark:text-[#d9ff52]'
              >
                {t('token-hub open-source repository')}
              </a>
            </p>
          </section>
        </>
      }
    />
  )
}
