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
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { RichContent } from '@/components/rich-content'
import { SeoMetadata } from '@/components/seo-metadata'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'

import { TokenHubFooter } from '../home/components'
import type { LegalDocumentResponse } from './types'

type LegalDocumentProps = {
  title: string
  queryKey: string
  fetchDocument: () => Promise<LegalDocumentResponse>
  description: string
  canonicalPath: string
  defaultContent: ReactNode
}

type LegalPageShellProps = {
  title: string
  description: string
  canonicalPath: string
  children: ReactNode
}

function LegalPageShell(props: LegalPageShellProps) {
  return (
    <PublicLayout showMainContainer={false}>
      <SeoMetadata
        pageName={props.title}
        description={props.description}
        canonicalPath={props.canonicalPath}
      />
      {props.children}
      <TokenHubFooter />
    </PublicLayout>
  )
}

export function LegalDocument(props: LegalDocumentProps) {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: [props.queryKey],
    queryFn: props.fetchDocument,
    staleTime: 10 * 60 * 1000,
  })

  const rawContent = data?.data?.trim() ?? ''
  const hasContent = rawContent.length > 0
  const isUrl = hasContent && isHttpUrl(rawContent)
  const contentIsHtml = hasContent && isLikelyHtml(rawContent)
  const success = data?.success ?? false

  if (isLoading) {
    return (
      <LegalPageShell
        title={props.title}
        description={props.description}
        canonicalPath={props.canonicalPath}
      >
        <main className='container mx-auto px-4 pt-28 pb-20'>
          <div className='mx-auto flex max-w-4xl flex-col gap-4 py-12'>
            <Skeleton className='h-8 w-[45%]' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-[90%]' />
            <Skeleton className='h-4 w-[80%]' />
          </div>
        </main>
      </LegalPageShell>
    )
  }

  if (!success || !hasContent) {
    return (
      <LegalPageShell
        title={props.title}
        description={props.description}
        canonicalPath={props.canonicalPath}
      >
        <main className='bg-[#f4f0e8] px-4 pt-28 pb-20 text-[#24221f] md:px-8 md:pt-36 md:pb-28 dark:bg-[#171714] dark:text-[#f4f0e8]'>
          <article className='mx-auto max-w-4xl'>
            <header className='border-b border-black/10 pb-10 dark:border-white/10'>
              <p className='mb-4 text-xs font-black tracking-[0.18em] text-[#5f6500] uppercase dark:text-[#d9ff52]'>
                {t('Legal')}
              </p>
              <h1 className='text-4xl font-black tracking-[-0.055em] md:text-6xl'>
                {props.title}
              </h1>
              <p className='mt-5 text-sm font-medium text-[#6f6a63] dark:text-white/50'>
                {t('Last updated: August 16, 2026')}
              </p>
            </header>
            <div className='mt-10 space-y-10 text-sm leading-7 font-medium text-[#5f5a54] dark:text-white/60 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-black [&_h2]:tracking-[-0.025em] [&_h2]:text-[#24221f] dark:[&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_ul]:space-y-2'>
              {props.defaultContent}
            </div>
          </article>
        </main>
      </LegalPageShell>
    )
  }

  if (isUrl) {
    return (
      <LegalPageShell
        title={props.title}
        description={props.description}
        canonicalPath={props.canonicalPath}
      >
        <main className='container mx-auto px-4 pt-28 pb-20'>
          <div className='mx-auto max-w-2xl py-12'>
            <Card>
              <CardHeader>
                <CardTitle>{props.title}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground text-sm'>
                  {t(
                    'The administrator configured an external link for this document.'
                  )}
                </p>
                <Button
                  render={
                    <a
                      href={rawContent}
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  {t('View document')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </LegalPageShell>
    )
  }

  return (
    <LegalPageShell
      title={props.title}
      description={props.description}
      canonicalPath={props.canonicalPath}
    >
      {contentIsHtml ? (
        <main className='pt-14'>
          <RichContent
            mode='html'
            htmlVariant='isolated'
            content={rawContent}
          />
        </main>
      ) : (
        <main className='container mx-auto px-4 pt-28 pb-20'>
          <article className='mx-auto max-w-4xl space-y-6 py-12'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-semibold tracking-tight'>
                {props.title}
              </h1>
            </div>

            <RichContent
              mode='markdown'
              content={rawContent}
              className='prose-neutral dark:prose-invert max-w-none'
            />
          </article>
        </main>
      )}
    </LegalPageShell>
  )
}
