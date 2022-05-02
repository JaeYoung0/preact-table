import { useEffect, useState } from 'preact/hooks'
import useSWR from 'swr'

export const initialTableState = {
  user_id: '',
  start: '',
  end: '',
  search_field: '',
  order_by_col_num: 1, //default: 1
  metrics_type: 'SALES',
}

export type TableState = typeof initialTableState

type BubbleIoInjectionData = {
  payload: TableState
}

/**
 * Bubbie.io에서 아래와 같은 방식으로 payload를 Table 컴포넌트로 전달한다.
    window.postMessage({
      payload: {
        user_id: '1625805300271x339648481160378400',
        start: '2020-12-05',
        end: '2022-04-05',
        metrics_type: 'SALES',
        order_by_col_num: 1,
        page:0
      },
    })
 */
function useBubbleIo() {
  const [payload, setPayload] = useState<TableState | null>(null)

  // postMessage에서 payload가 들어오면 payload를 캐싱하는 SWR
  const { data, error, mutate, isValidating } = useSWR<TableState | null, Error>(
    payload ? '@payload' : null,
    () => payload
  )

  useEffect(() => {
    const receiveMessage = (e: MessageEvent<BubbleIoInjectionData>) => {
      const { payload } = e.data

      setPayload(payload)
    }
    window.addEventListener('message', receiveMessage)

    return () => window.removeEventListener('message', receiveMessage)
  }, [])

  useEffect(() => {
    mutate()
  }, [payload])

  return { tableState: data, isLoading: isValidating, error, mutate }
}

export default useBubbleIo
