export interface ImageVariantOptions {
  width: number
  quality?: number
  resize?: 'cover' | 'contain' | 'fill'
}

/**
 * Builds lightweight image variants for providers that support URL transforms.
 * Falls back to the original URL when the provider cannot resize on the fly.
 */
export function buildImageVariantUrl(
  sourceUrl: string,
  { width, quality = 70, resize = 'cover' }: ImageVariantOptions,
): string {
  if (!sourceUrl) return sourceUrl

  try {
    const url = new URL(sourceUrl)

    if (url.hostname.includes('supabase.co')) {
      const objectPublicPath = '/storage/v1/object/public/'
      if (url.pathname.includes(objectPublicPath)) {
        url.pathname = url.pathname.replace(
          objectPublicPath,
          '/storage/v1/render/image/public/',
        )
        url.searchParams.set('width', String(width))
        url.searchParams.set('quality', String(quality))
        url.searchParams.set('resize', resize)
        return url.toString()
      }
    }

    if (url.hostname.includes('unsplash.com')) {
      url.searchParams.set('w', String(width))
      url.searchParams.set('q', String(quality))
      url.searchParams.set('auto', 'format')
      url.searchParams.set('fit', resize === 'contain' ? 'max' : 'crop')
      return url.toString()
    }
  } catch {
    return sourceUrl
  }

  return sourceUrl
}

export function buildImagePlaceholderUrl(sourceUrl: string): string {
  return buildImageVariantUrl(sourceUrl, {
    width: 32,
    quality: 20,
    resize: 'contain',
  })
}

export function buildTimelineThumbnailUrl(sourceUrl: string): string {
  return buildImageVariantUrl(sourceUrl, {
    width: 640,
    quality: 70,
    resize: 'contain',
  })
}
