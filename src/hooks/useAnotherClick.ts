import { RefObject } from 'preact'
import { useEffect, useState } from 'preact/hooks'

// FIXME: modal 닫을 떄 써먹으려했는데 안됨
function useAnotherClick(me: RefObject<HTMLElement>) {
  const [anotherClick, setAnotherClick] = useState<boolean>(false)

  const handleWindowClick = (e: MouseEvent) => {
    if (!me.current) return
    setAnotherClick(!me.current.contains(e.target as Node))
  }

  useEffect(() => {
    window.addEventListener('click', handleWindowClick)

    return () => {
      window.removeEventListener('click', handleWindowClick)
    }
  }, [])

  return { anotherClick }
}

export default useAnotherClick
