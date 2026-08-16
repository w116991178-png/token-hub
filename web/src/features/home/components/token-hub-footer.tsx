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
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { TOKEN_HUB_BRAND } from '../config'
import { BrandMark } from './brand-mark'

export function TokenHubFooter() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className='bg-[#24221f] px-4 text-[#f4f0e8] md:px-8'>
      <div className='mx-auto max-w-[86rem] py-10 md:py-14'>
        <div className='grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1fr_auto_auto_auto] md:gap-16'>
          <div>
            <Link to='/' className='inline-flex items-center gap-3'>
              <BrandMark />
              <span className='text-xl font-black tracking-[-0.05em]'>
                {TOKEN_HUB_BRAND.name}
              </span>
            </Link>
            <p className='mt-4 max-w-sm text-sm leading-6 font-medium text-white/45'>
              {t(
                'A single, observable gateway for the models your products depend on.'
              )}
            </p>
          </div>

          <nav aria-label={t('Product links')}>
            <p className='mb-4 text-[10px] font-black tracking-[0.17em] text-white/35 uppercase'>
              {t('Product')}
            </p>
            <div className='flex flex-col gap-3 text-sm font-bold text-white/65'>
              <Link to='/pricing' className='hover:text-[#d9ff52]'>
                {t('Pricing')}
              </Link>
              <Link to='/models' className='hover:text-[#d9ff52]'>
                {t('Models')}
              </Link>
              <Link to='/playground' className='hover:text-[#d9ff52]'>
                {t('Playground')}
              </Link>
            </div>
          </nav>

          <nav aria-label={t('Company links')}>
            <p className='mb-4 text-[10px] font-black tracking-[0.17em] text-white/35 uppercase'>
              {t('Company')}
            </p>
            <div className='flex flex-col gap-3 text-sm font-bold text-white/65'>
              <Link to='/about' className='hover:text-[#d9ff52]'>
                {t('About Us')}
              </Link>
              <Link to='/contact' className='hover:text-[#d9ff52]'>
                {t('Contact')}
              </Link>
              <Link to='/privacy-policy' className='hover:text-[#d9ff52]'>
                {t('Privacy Policy')}
              </Link>
              <Link to='/user-agreement' className='hover:text-[#d9ff52]'>
                {t('Terms of Service')}
              </Link>
            </div>
          </nav>

          <nav aria-label={t('Open-source links')}>
            <p className='mb-4 text-[10px] font-black tracking-[0.17em] text-white/35 uppercase'>
              {t('Open Source')}
            </p>
            <div className='flex flex-col gap-3 text-sm font-bold text-white/65'>
              <a
                href='https://github.com/w116991178-png/token-hub'
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-center gap-2 hover:text-[#d9ff52]'
              >
                {t('token-hub on GitHub')}
                <ArrowUpRight className='size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
              </a>
              <a
                href='https://github.com/QuantumNous/new-api'
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-center gap-2 hover:text-[#d9ff52]'
              >
                {t('New API upstream')}
                <ArrowUpRight className='size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
              </a>
            </div>
          </nav>
        </div>

        <div className='flex flex-col justify-between gap-4 pt-6 text-[10px] font-bold tracking-[0.12em] text-white/30 uppercase lg:flex-row lg:items-center'>
          <span>
            © {year} {TOKEN_HUB_BRAND.name}. {t('All rights reserved.')}
          </span>
          <p className='max-w-3xl normal-case lg:text-right'>
            {t('token-hub is based on the open-source')}{' '}
            <a
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noopener noreferrer'
              className='text-white/50 hover:text-white/80'
            >
              {t('New API project')}
            </a>
            {t(
              '. New API and its contributors retain their respective copyrights.'
            )}
            <br />
            <a
              href='https://github.com/QuantumNous/new-api'
              target='_blank'
              rel='noopener noreferrer'
              className='text-white/50 hover:text-white/80'
            >
              {t('Frontend design and development by New API contributors.')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
