/**
 * Shared IntersectionObserver instance for performance.
 *
 * Instead of creating a new IntersectionObserver for every single MediaCard,
 * we use a single global observer. It simply adds an 'is-visible' CSS class
 * when the element enters the viewport, avoiding costly React state updates (re-renders).
 */

let observer: IntersectionObserver | null = null

function getObserver() {
  if (typeof window === 'undefined') return null

  if (!observer) {
    observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visibility class to trigger CSS animation
            entry.target.classList.add('is-visible')
            // Stop observing once it's visible
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '100px' }
    )
  }

  return observer
}

export function observeElement(el: Element) {
  const obs = getObserver()
  if (obs) {
    obs.observe(el)
  }
}

export function unobserveElement(el: Element) {
  const obs = getObserver()
  if (obs) {
    obs.unobserve(el)
  }
}
