import { useEffect, useRef, useState } from 'react'

// true once the element has scrolled into view (stays true afterwards, so reveal animations play once)
export default function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setSeen(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ref, seen]
}
