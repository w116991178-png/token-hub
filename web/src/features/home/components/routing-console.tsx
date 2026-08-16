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
import { Check, CornerDownRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { TOKEN_HUB_BRAND } from '../config'

const ROUTES = [
  { model: 'gpt-5', provider: 'OpenAI', latency: '428 ms', active: false },
  { model: 'claude-4', provider: 'Anthropic', latency: '361 ms', active: true },
  { model: 'gemini-2.5', provider: 'Google', latency: '492 ms', active: false },
] as const

export function RoutingConsole() {
  const { t } = useTranslation()

  return (
    <div className='token-hub-reveal relative mx-auto w-full max-w-[34rem] lg:mr-0'>
      <div className='absolute -top-5 -right-3 hidden rounded-full bg-[#d9ff52] px-4 py-2 text-[10px] font-black tracking-[0.14em] text-[#24221f] uppercase shadow-[4px_4px_0_#24221f] sm:block'>
        {t('Live routing')}
      </div>
      <div className='overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#1d1c19] text-[#f4f0e8] shadow-[0_35px_80px_-35px_rgba(36,34,31,0.75)]'>
        <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
          <div className='flex items-center gap-2'>
            <span className='size-2 rounded-full bg-[#ff6b4a]' />
            <span className='size-2 rounded-full bg-[#d9ff52]' />
            <span className='size-2 rounded-full bg-white/30' />
          </div>
          <span className='font-mono text-[10px] font-bold tracking-[0.18em] text-white/45 uppercase'>
            token-hub / edge-01
          </span>
        </div>

        <div className='p-5 sm:p-6'>
          <p className='text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase'>
            {t('Single endpoint')}
          </p>
          <div className='mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3'>
            <span className='rounded-md bg-[#ff6b4a] px-2 py-1 font-mono text-[10px] font-black text-[#24221f]'>
              POST
            </span>
            <code className='min-w-0 truncate text-xs text-white/80 sm:text-sm'>
              {TOKEN_HUB_BRAND.apiBase}/chat/completions
            </code>
          </div>

          <div className='my-5 flex items-center gap-3 text-[10px] font-bold tracking-[0.16em] text-white/35 uppercase'>
            <span className='h-px flex-1 bg-white/10' />
            {t('Smart route selected')}
            <span className='h-px flex-1 bg-white/10' />
          </div>

          <div className='space-y-2'>
            {ROUTES.map((route) => (
              <div
                key={route.model}
                className={
                  route.active
                    ? 'flex items-center gap-3 rounded-xl border border-[#d9ff52]/50 bg-[#d9ff52]/10 px-3 py-3'
                    : 'flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-white/35'
                }
              >
                <div
                  className={
                    route.active
                      ? 'flex size-7 items-center justify-center rounded-full bg-[#d9ff52] text-[#24221f]'
                      : 'flex size-7 items-center justify-center rounded-full border border-white/10'
                  }
                >
                  {route.active ? (
                    <Check className='size-3.5' strokeWidth={3} />
                  ) : (
                    <CornerDownRight className='size-3.5' />
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate font-mono text-xs font-bold'>
                    {route.model}
                  </p>
                  <p className='mt-0.5 text-[10px]'>{route.provider}</p>
                </div>
                <span className='font-mono text-[10px]'>{route.latency}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-3 border-t border-white/10 bg-black/15'>
          {[
            [t('Status'), '200 OK'],
            [t('Input'), '1,248 tok'],
            [t('Cost'), '$0.0042'],
          ].map(([label, value], index) => (
            <div
              key={label}
              className={
                index === 0 ? 'px-4 py-4' : 'border-l border-white/10 px-4 py-4'
              }
            >
              <p className='text-[9px] font-bold tracking-[0.14em] text-white/35 uppercase'>
                {label}
              </p>
              <p className='mt-1 font-mono text-xs font-bold'>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
