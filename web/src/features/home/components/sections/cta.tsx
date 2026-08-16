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
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()
  const target = props.isAuthenticated ? '/dashboard' : '/sign-up'
  const label = props.isAuthenticated
    ? t('Open dashboard')
    : t('Create an account')

  return (
    <section className='px-4 py-20 md:px-8 md:py-28'>
      <div className='relative mx-auto max-w-[86rem] overflow-hidden rounded-[2rem] bg-[#ff6b4a] px-6 py-14 text-[#24221f] sm:px-10 md:py-20 lg:px-16'>
        <div aria-hidden='true' className='token-hub-cta-orbit' />
        <div className='relative grid items-end gap-10 lg:grid-cols-[1fr_auto]'>
          <div>
            <p className='text-[10px] font-black tracking-[0.2em] uppercase opacity-60'>
              03 / {t('Your next request')}
            </p>
            <h2 className='mt-5 max-w-4xl text-[clamp(2.6rem,6vw,6rem)] leading-[0.9] font-black tracking-[-0.075em]'>
              {t('Make every token count.')}
            </h2>
            <p className='mt-6 max-w-xl text-sm leading-6 font-bold opacity-65 md:text-base'>
              {t(
                'Start with one key and one endpoint. Token Hub handles the routing, metering, and operational clarity behind it.'
              )}
            </p>
          </div>
          <Link
            to={target}
            className='group inline-flex h-14 w-fit shrink-0 items-center gap-6 rounded-full bg-[#24221f] px-7 text-sm font-black text-[#f4f0e8] transition-transform hover:-translate-y-1'
          >
            {label}
            <ArrowRight className='size-4 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>
      </div>
    </section>
  )
}
