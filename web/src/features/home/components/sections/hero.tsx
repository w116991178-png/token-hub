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
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useStatus } from '@/hooks/use-status'

import { TOKEN_HUB_LAYOUT } from '../../config'
import { RoutingConsole } from '../routing-console'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const docsUrl =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'
  const primaryHref = props.isAuthenticated ? '/dashboard' : '/sign-up'
  const primaryLabel = props.isAuthenticated
    ? t('Open dashboard')
    : t('Start building')

  return (
    <section className='relative overflow-hidden px-4 pt-28 pb-14 md:px-8 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24'>
      <div aria-hidden='true' className='token-hub-grid absolute inset-0' />
      <div aria-hidden='true' className='token-hub-orbit -top-24 -right-48' />

      <div
        className={`relative mx-auto max-w-[86rem] ${TOKEN_HUB_LAYOUT.hero}`}
      >
        <div className='max-w-3xl'>
          <div className='token-hub-reveal flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-[#24221f]/55 uppercase dark:text-white/50'>
            <span className='h-px w-8 bg-[#ff6b4a]' />
            {t('AI traffic control for builders')}
          </div>

          <h1 className='token-hub-reveal token-hub-delay-1 mt-7 text-[clamp(3.25rem,7.3vw,7rem)] leading-[0.88] font-black tracking-[-0.075em] text-[#24221f] dark:text-[#f4f0e8]'>
            {t('One API.')}
            <br />
            <span className='relative inline-block text-[#ff6b4a]'>
              {t('Every model.')}
              <span className='absolute right-0 -bottom-2 left-0 h-2 rounded-full bg-[#d9ff52]' />
            </span>
          </h1>

          <p className='token-hub-reveal token-hub-delay-2 mt-8 max-w-2xl text-base leading-7 font-medium text-[#24221f]/65 md:text-lg md:leading-8 dark:text-white/60'>
            {t(
              'Connect once, route every AI request, and keep cost, latency, and reliability under control from one clear workspace.'
            )}
          </p>

          <div className='token-hub-reveal token-hub-delay-3 mt-9 flex flex-wrap items-center gap-3'>
            <Link
              to={primaryHref}
              className='group inline-flex h-12 items-center gap-3 rounded-full bg-[#24221f] px-6 text-sm font-black text-[#f4f0e8] transition-colors hover:bg-[#ff6b4a] dark:bg-[#f4f0e8] dark:text-[#171714] dark:hover:bg-[#ff6b4a]'
            >
              {primaryLabel}
              <ArrowUpRight className='size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </Link>
            <a
              href={docsUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex h-12 items-center rounded-full border border-[#24221f]/25 px-6 text-sm font-black text-[#24221f] transition-colors hover:border-[#24221f] hover:bg-[#24221f] hover:text-[#f4f0e8] dark:border-white/25 dark:text-[#f4f0e8] dark:hover:border-white dark:hover:bg-[#f4f0e8] dark:hover:text-[#171714]'
            >
              {t('Read the docs')}
            </a>
          </div>

          <div className='token-hub-reveal token-hub-delay-4 mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-[#24221f]/55 dark:text-white/50'>
            {[
              t('OpenAI-compatible'),
              t('Usage metering'),
              t('Smart failover'),
            ].map((item) => (
              <span key={item} className='flex items-center gap-2'>
                <CheckCircle2 className='size-4 text-[#ff6b4a]' />
                {item}
              </span>
            ))}
          </div>
        </div>

        <RoutingConsole />
      </div>

      <div className='relative mx-auto mt-16 max-w-[86rem] border-y border-[#24221f]/15 py-5 md:mt-24 dark:border-white/15'>
        <div className='flex flex-wrap items-center justify-between gap-x-8 gap-y-4'>
          <span className='text-[10px] font-black tracking-[0.18em] text-[#24221f]/40 uppercase dark:text-white/40'>
            {t('One key unlocks the AI stack')}
          </span>
          {['OpenAI', 'Anthropic', 'Gemini', 'DeepSeek', 'Qwen', 'Mistral'].map(
            (provider) => (
              <span
                key={provider}
                className='text-sm font-black tracking-[-0.03em] text-[#24221f]/70 dark:text-white/65'
              >
                {provider}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  )
}
