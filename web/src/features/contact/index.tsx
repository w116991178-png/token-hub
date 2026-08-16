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
import {
  ArrowUpRight,
  GitBranch,
  LockKeyhole,
  MessageSquare,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { SeoMetadata } from '@/components/seo-metadata'
import { TokenHubFooter } from '@/features/home/components'

export function Contact() {
  const { t } = useTranslation()

  return (
    <PublicLayout showMainContainer={false}>
      <SeoMetadata
        pageName={t('Contact token-hub')}
        description={t(
          'Find the appropriate support and open-source contact channels for token-hub.'
        )}
        canonicalPath='/contact'
      />
      <main className='bg-[#f4f0e8] px-4 pt-28 pb-20 text-[#24221f] md:px-8 md:pt-36 md:pb-28 dark:bg-[#171714] dark:text-[#f4f0e8]'>
        <div className='mx-auto max-w-6xl'>
          <header className='max-w-4xl'>
            <p className='mb-5 text-xs font-black tracking-[0.2em] text-[#5f6500] uppercase dark:text-[#d9ff52]'>
              {t('Contact')}
            </p>
            <h1 className='text-5xl leading-[0.95] font-black tracking-[-0.065em] md:text-7xl'>
              {t('Start with the right channel.')}
            </h1>
            <p className='mt-7 max-w-2xl text-base leading-7 font-medium text-[#64605a] dark:text-white/55'>
              {t(
                'For deployment questions, bug reports, and source-code discussions, use the token-hub repository. Account, billing, and service-specific requests should use the private support channel provided by your site operator.'
              )}
            </p>
          </header>

          <section className='mt-14 grid gap-px border border-black/10 bg-black/10 md:grid-cols-3 dark:border-white/10 dark:bg-white/10'>
            <article className='bg-[#f4f0e8] p-7 md:p-9 dark:bg-[#171714]'>
              <GitBranch className='mb-8 size-6 text-[#5f6500] dark:text-[#d9ff52]' />
              <h2 className='text-xl font-black tracking-[-0.035em]'>
                {t('Open-source project')}
              </h2>
              <p className='mt-3 min-h-24 text-sm leading-6 font-medium text-[#6f6a63] dark:text-white/50'>
                {t(
                  'Review the source, report reproducible bugs, or propose improvements through GitHub.'
                )}
              </p>
              <a
                href='https://github.com/w116991178-png/token-hub'
                target='_blank'
                rel='noopener noreferrer'
                className='mt-5 inline-flex items-center gap-2 text-xs font-black tracking-wide text-[#4f5600] uppercase dark:text-[#d9ff52]'
              >
                {t('Open repository')}
                <ArrowUpRight className='size-4' />
              </a>
            </article>

            <article className='bg-[#f4f0e8] p-7 md:p-9 dark:bg-[#171714]'>
              <MessageSquare className='mb-8 size-6 text-[#5f6500] dark:text-[#d9ff52]' />
              <h2 className='text-xl font-black tracking-[-0.035em]'>
                {t('Account and billing support')}
              </h2>
              <p className='mt-3 text-sm leading-6 font-medium text-[#6f6a63] dark:text-white/50'>
                {t(
                  'Use the private contact method published by the operator of the token-hub deployment you use. Include your account identifier and relevant timestamps, but never send passwords or complete API keys.'
                )}
              </p>
            </article>

            <article className='bg-[#f4f0e8] p-7 md:p-9 dark:bg-[#171714]'>
              <LockKeyhole className='mb-8 size-6 text-[#5f6500] dark:text-[#d9ff52]' />
              <h2 className='text-xl font-black tracking-[-0.035em]'>
                {t('Security and privacy')}
              </h2>
              <p className='mt-3 text-sm leading-6 font-medium text-[#6f6a63] dark:text-white/50'>
                {t(
                  'Do not disclose vulnerabilities, personal information, API keys, or private request content in a public issue. Ask the operator for a private reporting channel first.'
                )}
              </p>
            </article>
          </section>
        </div>
      </main>
      <TokenHubFooter />
    </PublicLayout>
  )
}
