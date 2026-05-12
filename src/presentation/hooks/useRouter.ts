import { useState, useEffect, useCallback } from 'react'

export type Route =
  | { page: 'timeline' }
  | { page: 'albums' }
  | { page: 'album-detail'; albumId: string }

/**
 * useRouter — Lightweight hash-based router.
 * No external dependencies. Syncs with browser back/forward.
 */
export function useRouter() {
  const parseHash = (): Route => {
    const hash = window.location.hash.slice(1) // remove #
    if (hash === 'albums') return { page: 'albums' }
    if (hash.startsWith('album/')) {
      const albumId = hash.slice('album/'.length)
      return { page: 'album-detail', albumId }
    }
    return { page: 'timeline' }
  }

  const [route, setRoute] = useState<Route>(parseHash)

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((newRoute: Route) => {
    let hash = ''
    switch (newRoute.page) {
      case 'timeline':
        hash = '#timeline'
        break
      case 'albums':
        hash = '#albums'
        break
      case 'album-detail':
        hash = `#album/${newRoute.albumId}`
        break
    }
    window.location.hash = hash
  }, [])

  return { route, navigate }
}
