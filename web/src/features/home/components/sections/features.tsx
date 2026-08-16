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
  ChartNoAxesCombined,
  Gauge,
  KeyRound,
  Route,
  ShieldCheck,
  WalletCards,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { TOKEN_HUB_LAYOUT } from '../../config'

interface FeaturesProps {
  className?: string
}

const CARD_STYLES = [
  'bg-[#ff6b4a] text-[#24221f] md:col-span-2',
  'bg-[#24221f] text-[#f4f0e8]',
  'bg-[#d9ff52] text-[#24221f]',
  'bg-[#ebe5d9] text-[#24221f] dark:bg-white/10 dark:text-[#f4f0e8]',
  'bg-[#f4f0e8] text-[#24221f] dark:bg-[#171714] dark:text-[#f4f0e8] md:col-span-2',
] as const

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()
  const features = [
    {
      icon: Route,
      title: t('Route by policy, not by guesswork'),
      description: t(
        'Balance requests across providers by model, group, priority, and availability—without touching application code.'
      ),
      meta: t('Smart routing'),
    },
    {
      icon: ShieldCheck,
      title: t('Fail over before users notice'),
      description: t(
        'Health checks and automatic retries keep production traffic moving when an upstream slows down.'
      ),
      meta: t('Resilience'),
    },
    {
      icon: WalletCards,
      title: t('Know every token'),
      description: t(
        'Track spend in real time with model-level pricing, quotas, and transparent usage records.'
      ),
      meta: t('Cost control'),
    },
    {
      icon: KeyRound,
      title: t('Keys built for teams'),
      description: t(
        'Issue scoped credentials, define permissions, and keep environments isolated.'
      ),
      meta: t('Access control'),
    },
    {
      icon: ChartNoAxesCombined,
      title: t('See the whole request path'),
      description: t(
        'Inspect latency, token use, errors, and provider performance from one operational view.'
      ),
      meta: t('Observability'),
    },
  ]

  return (
    <section className='px-4 py-20 md:px-8 md:py-32'>
      <div className='mx-auto max-w-[86rem]'>
        <div className='grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end'>
          <div>
            <p className='text-[10px] font-black tracking-[0.2em] text-[#ff6b4a] uppercase'>
              01 / {t('Control layer')}
            </p>
            <h2 className='mt-5 text-[clamp(2.5rem,5vw,5rem)] leading-[0.94] font-black tracking-[-0.065em] text-[#24221f] dark:text-[#f4f0e8]'>
              {t('Built to run')}
              <br />
              {t('AI in production.')}
            </h2>
          </div>
          <p className='max-w-xl text-base leading-7 font-medium text-[#24221f]/60 lg:ml-auto dark:text-white/55'>
            {t(
              'Token Hub turns a fragmented provider stack into one dependable control plane—simple for developers, precise for operators.'
            )}
          </p>
        </div>

        <div
          className={`mt-14 overflow-hidden rounded-[2rem] border border-[#24221f]/15 bg-[#24221f]/15 dark:border-white/15 dark:bg-white/15 ${TOKEN_HUB_LAYOUT.features}`}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className={`group min-h-72 p-7 sm:p-9 ${CARD_STYLES[index]}`}
              >
                <div className='flex items-start justify-between'>
                  <span className='text-[10px] font-black tracking-[0.16em] uppercase opacity-55'>
                    {String(index + 1).padStart(2, '0')} / {feature.meta}
                  </span>
                  <Icon className='size-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6' />
                </div>
                <div className='mt-20 max-w-md'>
                  <h3 className='text-xl leading-tight font-black tracking-[-0.04em] sm:text-2xl'>
                    {feature.title}
                  </h3>
                  <p className='mt-4 text-sm leading-6 font-medium opacity-65'>
                    {feature.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>

        <div className='mt-8 flex items-center gap-3 text-xs font-bold text-[#24221f]/55 dark:text-white/50'>
          <Gauge className='size-4 text-[#ff6b4a]' />
          {t('Designed for high-concurrency AI workloads')}
        </div>
      </div>
    </section>
  )
}
