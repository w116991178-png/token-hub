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
import { useEffect } from 'react'

import { TOKEN_HUB_BRAND } from '@/features/home/config'

type SeoMetadataProps = {
  pageName: string
  description: string
  canonicalPath: string
}

function setMetaContent(
  selector: string,
  attributeName: 'name' | 'property',
  attributeValue: string,
  content: string
): void {
  const element = document.head.querySelector<HTMLMetaElement>(selector)
  if (element) {
    element.setAttribute('content', content)
    return
  }

  const meta = document.createElement('meta')
  meta.setAttribute(attributeName, attributeValue)
  meta.setAttribute('content', content)
  document.head.append(meta)
}

export function SeoMetadata(props: SeoMetadataProps): null {
  useEffect(() => {
    const canonicalUrl = new URL(
      props.canonicalPath,
      TOKEN_HUB_BRAND.siteUrl
    ).toString()
    const socialTitle = `${props.pageName} | ${TOKEN_HUB_BRAND.name}`
    const canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    )

    if (canonical) {
      canonical.href = canonicalUrl
    } else {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = canonicalUrl
      document.head.append(link)
    }

    setMetaContent(
      'meta[name="description"]',
      'name',
      'description',
      props.description
    )
    setMetaContent(
      'meta[property="og:title"]',
      'property',
      'og:title',
      socialTitle
    )
    setMetaContent(
      'meta[property="og:description"]',
      'property',
      'og:description',
      props.description
    )
    setMetaContent(
      'meta[property="og:url"]',
      'property',
      'og:url',
      canonicalUrl
    )
    setMetaContent(
      'meta[name="twitter:title"]',
      'name',
      'twitter:title',
      socialTitle
    )
    setMetaContent(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      props.description
    )

    return () => {
      const homeDescription =
        'token-hub is a unified, observable AI API gateway for routing models, managing access, monitoring usage, and controlling costs.'
      if (canonical) canonical.href = `${TOKEN_HUB_BRAND.siteUrl}/`
      setMetaContent(
        'meta[name="description"]',
        'name',
        'description',
        homeDescription
      )
      setMetaContent(
        'meta[property="og:title"]',
        'property',
        'og:title',
        'token-hub — Unified AI API Gateway'
      )
      setMetaContent(
        'meta[property="og:description"]',
        'property',
        'og:description',
        homeDescription
      )
      setMetaContent(
        'meta[property="og:url"]',
        'property',
        'og:url',
        `${TOKEN_HUB_BRAND.siteUrl}/`
      )
      setMetaContent(
        'meta[name="twitter:title"]',
        'name',
        'twitter:title',
        'token-hub — Unified AI API Gateway'
      )
      setMetaContent(
        'meta[name="twitter:description"]',
        'name',
        'twitter:description',
        homeDescription
      )
    }
  }, [props.canonicalPath, props.description, props.pageName])

  return null
}
