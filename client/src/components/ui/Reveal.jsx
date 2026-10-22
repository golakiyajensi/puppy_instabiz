import useInView from '../../hooks/useInView'

// Fades its children up when they scroll into view. `delay` is in milliseconds.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, seen] = useInView({ threshold: 0.12 })
  return (
    <Tag ref={ref} className={`reveal ${seen ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
