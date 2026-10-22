import { useEffect, useRef, useState } from 'react'
import { PawIcon } from './Doodles'
import useReducedMotion from '../../hooks/useReducedMotion'

const MIN_DISTANCE = 42
const PRINT_LIFETIME = 500

export default function CursorPawTrail() {
  const reduced = useReducedMotion()
  const [prints, setPrints] = useState([])
  const nextId = useRef(0)
  const previousPoint = useRef(null)

  useEffect(() => {
    setPrints([])
    previousPoint.current = null
    if (reduced) return undefined

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return

      const point = { x: event.clientX, y: event.clientY }
      const previous = previousPoint.current
      previousPoint.current = point

      if (previous) {
        const distance = Math.hypot(point.x - previous.x, point.y - previous.y)
        if (distance < MIN_DISTANCE) return
      }

      const id = nextId.current++
      setPrints((current) => [...current, { ...point, id }])
    }

    window.addEventListener('pointermove', onPointerMove)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div className="cursor-paw-trail" aria-hidden="true">
      {prints.map((print, index) => (
        <PawIcon
          key={print.id}
          size={20}
          className="cursor-paw-print"
          style={{
            left: print.x,
            top: print.y,
            rotate: `${index % 2 === 0 ? -18 : 18}deg`,
          }}
          onAnimationEnd={() => setPrints((current) => current.filter((item) => item.id !== print.id))}
        />
      ))}
    </div>
  )
}
