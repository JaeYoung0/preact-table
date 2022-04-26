import { TableState } from '@/components/Table/Table'
import { useEffect, useState } from 'preact/hooks'

type BubbleIoInjectionData = {
  payload: TableState
}

/**
 * Bubbie.io에서 아래와 같은 방식으로 payload를 Table 컴포넌트로 전달한다.
    window.postMessage({
      payload: {
        page: 0,
        pageSize: 5,
        rowCount: 10,
        userId: '1625805300271x339648481160378400',
        start: '1618833417',
        end: '1650369417',
        metrics_type: 'SALES',
      },
    })
 */
function useBubbleIo() {
  const [payload, setPayload] = useState<null | TableState>(null)

  useEffect(() => {
    const receiveMessage = (e: MessageEvent<BubbleIoInjectionData>) => {
      console.log('@@receiveMessage event', e)
      const { payload } = e.data
      setPayload(payload)
      // setTableState(payload)
    }
    window.addEventListener('message', receiveMessage)

    return () => window.removeEventListener('message', receiveMessage)
  }, [])

  return { payload }
}

export default useBubbleIo
