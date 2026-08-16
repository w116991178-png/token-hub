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
import { ArrowDown, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { TOKEN_HUB_BRAND } from '../../config'

export function HowItWorks() {
  const { t } = useTranslation()
  const steps = [
    {
      number: '01',
      title: t('Create one key'),
      description: t(
        'Set a budget, choose permissions, and issue a credential for your app or team.'
      ),
      code: 'sk-th_live_••••••••',
    },
    {
      number: '02',
      title: t('Change one endpoint'),
      description: t(
        'Keep your existing SDK and point its base URL to the Token Hub gateway.'
      ),
      code: TOKEN_HUB_BRAND.apiBase,
    },
    {
      number: '03',
      title: t('Ship with visibility'),
      description: t(
        'Route traffic, watch spend, and tune provider performance from the dashboard.'
      ),
      code: 'status: ready',
    },
  ]

  return (
    <section className='border-y border-[#24221f]/15 bg-[#ebe5d9] px-4 py-20 md:px-8 md:py-32 dark:border-white/15 dark:bg-white/[0.035]'>
      <div className='mx-auto max-w-[86rem]'>
        <div className='grid gap-10 lg:grid-cols-[0.72fr_1.28fr]'>
          <div className='lg:sticky lg:top-32 lg:self-start'>
            <p className='text-[10px] font-black tracking-[0.2em] text-[#ff6b4a] uppercase'>
              02 / {t('Quick start')}
            </p>
            <h2 className='mt-5 max-w-xl text-[clamp(2.5rem,5vw,5rem)] leading-[0.94] font-black tracking-[-0.065em] text-[#24221f] dark:text-[#f4f0e8]'>
              {t('Three moves.')}
              <br />
              {t('Then ship.')}
            </h2>
            <p className='mt-6 max-w-md text-sm leading-6 font-medium text-[#24221f]/60 dark:text-white/55'>
              {t(
                'No proprietary SDK. No provider-by-provider rewrite. Your current OpenAI-compatible client is enough.'
              )}
            </p>
            <ArrowDown className='mt-10 hidden size-8 text-[#ff6b4a] lg:block' />
          </div>

          <ol className='border-t border-[#24221f]/20 dark:border-white/15'>
            {steps.map((step) => (
              <li
                key={step.number}
                className='grid gap-6 border-b border-[#24221f]/20 py-9 sm:grid-cols-[4rem_1fr] sm:py-12 dark:border-white/15'
              >
                <span className='font-mono text-sm font-black text-[#ff6b4a]'>
                  {step.number}
                </span>
                <div>
                  <div className='flex items-start gap-4'>
                    <span className='mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#24221f] text-[#d9ff52] dark:bg-[#f4f0e8] dark:text-[#171714]'>
                      <Check className='size-3.5' strokeWidth={3} />
                    </span>
                    <div>
                      <h3 className='text-2xl font-black tracking-[-0.045em] text-[#24221f] sm:text-3xl dark:text-[#f4f0e8]'>
                        {step.title}
                      </h3>
                      <p className='mt-3 max-w-xl text-sm leading-6 font-medium text-[#24221f]/60 dark:text-white/55'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <code className='mt-6 block overflow-x-auto rounded-xl border border-[#24221f]/15 bg-[#f4f0e8] px-4 py-3 text-xs font-bold text-[#24221f] dark:border-white/10 dark:bg-[#171714] dark:text-[#d9ff52]'>
                    {step.code}
                  </code>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
