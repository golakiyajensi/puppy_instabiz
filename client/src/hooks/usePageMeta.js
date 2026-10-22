import { useEffect } from 'react'

// Sets the browser-tab title and the description search engines show (SEO basics)
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | TeddyPups U.A.E.` : 'TeddyPups U.A.E. — Premium teacup puppies in Dubai'
    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, description])
}
