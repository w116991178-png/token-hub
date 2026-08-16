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
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, Blocks, Code2, Network, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { RichContent } from '@/components/rich-content'
import { SeoMetadata } from '@/components/seo-metadata'
import { Skeleton } from '@/components/ui/skeleton'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'

import { TokenHubFooter } from '../home/components'
import { getAboutContent } from './api'

function DefaultAboutContent() {
  const { t } = useTranslation()

  return (
    <main className='bg-[#f4f0e8] px-4 pt-28 pb-20 text-[#24221f] md:px-8 md:pt-36 md:pb-28 dark:bg-[#171714] dark:text-[#f4f0e8]'>
      <div className='mx-auto max-w-6xl'>
        <section className='grid gap-10 border-b border-black/10 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end dark:border-white/10'>
          <div>
            <p className='mb-5 text-xs font-black tracking-[0.2em] text-[#5f6500] uppercase dark:text-[#d9ff52]'>
              {t('About token-hub')}
            </p>
            <h1 className='max-w-4xl text-5xl leading-[0.95] font-black tracking-[-0.065em] md:text-7xl'>
              {t('One gateway for the AI models your products rely on.')}
            </h1>
          </div>
          <p className='max-w-xl text-base leading-7 font-medium text-[#64605a] dark:text-white/55'>
            {t(
              'token-hub brings model routing, access control, usage visibility, and cost management into one operational workspace for developers and teams.'
            )}
          </p>
        </section>

        <section className='grid gap-px border border-black/10 bg-black/10 md:grid-cols-3 dark:border-white/10 dark:bg-white/10'>
          {[
            {
              icon: Network,
              title: t('Unified model access'),
              body: t(
                'Connect compatible clients once and route requests across supported AI providers from a consistent API surface.'
              ),
            },
            {
              icon: ShieldCheck,
              title: t('Operational control'),
              body: t(
                'Manage credentials, permissions, quotas, provider health, and failover without scattering controls across applications.'
              ),
            },
            {
              icon: Blocks,
              title: t('Built for transparency'),
              body: t(
                'Inspect usage, latency, errors, and billing signals so teams can understand how their AI traffic behaves.'
              ),
            },
          ].map((item) => (
            <article
              key={item.title}
              className='bg-[#f4f0e8] p-7 md:p-9 dark:bg-[#171714]'
            >
              <item.icon className='mb-8 size-6 text-[#5f6500] dark:text-[#d9ff52]' />
              <h2 className='text-xl font-black tracking-[-0.035em]'>
                {item.title}
              </h2>
              <p className='mt-3 text-sm leading-6 font-medium text-[#6f6a63] dark:text-white/50'>
                {item.body}
              </p>
            </article>
          ))}
        </section>

        <section className='mt-16 grid gap-10 rounded-[2rem] bg-[#24221f] p-7 text-[#f4f0e8] md:p-12 lg:grid-cols-[0.8fr_1.2fr]'>
          <div>
            <Code2 className='mb-6 size-8 text-[#d9ff52]' />
            <h2 className='text-3xl font-black tracking-[-0.045em]'>
              {t('Open source and attribution')}
            </h2>
          </div>
          <div className='space-y-5 text-sm leading-7 font-medium text-white/60'>
            <p>
              {t(
                'token-hub is an independently maintained distribution based on the open-source New API project. New API and its contributors retain their respective copyrights.'
              )}
            </p>
            <p>
              {t('The New API project is maintained by')}{' '}
              <a
                href='https://github.com/QuantumNous'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white underline decoration-white/30 underline-offset-4 hover:decoration-[#d9ff52]'
              >
                {t('QuantumNous')}
              </a>
              {t(' and is based in part on')}{' '}
              <a
                href='https://github.com/songquanpeng/one-api'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white underline decoration-white/30 underline-offset-4 hover:decoration-[#d9ff52]'
              >
                {t('One API')}
              </a>{' '}
              {t('by')}{' '}
              <a
                href='https://github.com/songquanpeng'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white underline decoration-white/30 underline-offset-4 hover:decoration-[#d9ff52]'
              >
                {t('JustSong')}
              </a>
              .
            </p>
            <p>
              {t('This software is distributed under the')}{' '}
              <a
                href='https://github.com/QuantumNous/new-api/blob/main/LICENSE'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white underline decoration-white/30 underline-offset-4 hover:decoration-[#d9ff52]'
              >
                {t('GNU Affero General Public License v3.0')}
              </a>
              .
            </p>
            <div className='flex flex-col gap-3 pt-3 sm:flex-row'>
              <a
                href='https://github.com/w116991178-png/token-hub'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center gap-2 rounded-full bg-[#d9ff52] px-5 py-3 text-xs font-black tracking-wide text-[#24221f] uppercase'
              >
                {t('View token-hub source')}
                <ArrowUpRight className='size-4' />
              </a>
              <a
                href='https://github.com/QuantumNous/new-api'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-xs font-black tracking-wide text-white uppercase hover:border-white/50'
              >
                {t('View New API upstream')}
                <ArrowUpRight className='size-4' />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export function About() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['about-content'],
    queryFn: getAboutContent,
  })

  const rawContent = data?.data?.trim() ?? ''
  const hasContent = rawContent.length > 0
  const isUrl = hasContent && isHttpUrl(rawContent)
  const contentIsHtml = hasContent && isLikelyHtml(rawContent)

  let pageContent: ReactNode

  if (isLoading) {
    pageContent = (
      <main className='container mx-auto px-4 pt-28 pb-20'>
        <div className='mx-auto flex max-w-4xl flex-col gap-4 py-12'>
          <Skeleton className='h-8 w-[45%]' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[80%]' />
        </div>
      </main>
    )
  } else if (!hasContent) {
    pageContent = <DefaultAboutContent />
  } else if (isUrl) {
    pageContent = (
      <main>
        <iframe
          src={rawContent}
          className='h-[calc(100vh-3.5rem)] w-full border-0'
          title={t('About')}
          sandbox='allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts'
        />
      </main>
    )
  } else if (contentIsHtml) {
    pageContent = (
      <main>
        <RichContent
          mode='html'
          htmlVariant='isolated'
          content={rawContent}
          className='prose-neutral dark:prose-invert max-w-none'
        />
      </main>
    )
  } else {
    pageContent = (
      <main className='container mx-auto px-4 pt-28 pb-20'>
        <div className='mx-auto max-w-6xl'>
          <RichContent
            mode='markdown'
            content={rawContent}
            className='prose-neutral dark:prose-invert max-w-none'
          />
        </div>
      </main>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      <SeoMetadata
        pageName={t('About token-hub')}
        description={t(
          'Learn how token-hub unifies AI model routing, access control, usage visibility, and cost management, and review its open-source origins.'
        )}
        canonicalPath='/about/'
      />
      {pageContent}
      <TokenHubFooter />
    </PublicLayout>
  )
}
