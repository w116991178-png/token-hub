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

import { TOKEN_HUB_LAYOUT } from '../../config'

interface StatsProps {
  className?: string
}

export function Stats(_props: StatsProps) {
  const { t } = useTranslation()
  const stats = [
    { value: '50+', label: t('Upstream providers') },
    { value: '100+', label: t('Billable AI models') },
    { value: '99.9%', label: t('Gateway availability target') },
    { value: '<1 min', label: t('To switch your endpoint') },
  ]

  return (
    <section className='bg-[#24221f] px-4 text-[#f4f0e8] md:px-8'>
      <div className={`mx-auto max-w-[86rem] ${TOKEN_HUB_LAYOUT.stats}`}>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={
              index === 0
                ? 'py-8 sm:py-10'
                : 'border-l border-white/10 py-8 pl-5 sm:py-10 sm:pl-8'
            }
          >
            <p className='font-mono text-2xl font-black tracking-[-0.06em] text-[#d9ff52] sm:text-4xl'>
              {stat.value}
            </p>
            <p className='mt-2 max-w-36 text-[10px] leading-4 font-bold tracking-[0.13em] text-white/45 uppercase'>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
