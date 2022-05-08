import { useEffect, useState } from 'preact/hooks'
import useSWR from 'swr'
import useMergedRows from './useMergedRows'

export const initialTableState = {
  user_id: '',
  start: '',
  end: '',
  search_field: '',
  order_by_col_num: 1, //default: 1
  metrics_type: 'SALES',
  page: 0,
}

export type TableState = typeof initialTableState

type BubbleIoInjectionData = {
  payload: TableState
  reset: boolean
}

/**
 * Bubbie.io에서 아래와 같은 방식으로 payload를 Table 컴포넌트로 전달한다.
    window.postMessage({
      payload: {
        user_id: '1651800183717x956761776063033100',
        start: '2021-12-05',
        end: '2022-04-05',
        metrics_type: 'SALES',
        order_by_col_num: 1,
        page:0
      },
      reset: false
    })
 */
function useBubbleIo() {
  const [payload, setPayload] = useState<TableState | null>(null)
  const { handleMergedRows } = useMergedRows()

  // postMessage에서 payload가 들어오면 payload를 캐싱하는 SWR
  const { data, error, mutate, isValidating } = useSWR<TableState | null, Error>(
    payload ? '@payload' : null,
    () => payload
  )

  useEffect(() => {
    const handleMessage = (e: MessageEvent<BubbleIoInjectionData>) => {
      const { payload, reset } = e.data
      console.log('## message event', e)

      console.log('## reset', reset)

      if (reset) {
        handleMergedRows([])
      }
      setPayload(payload)
    }
    // FIXME: message event가 여러번 들어온다. -> tableState를 context api로 전달해야할듯
    window.addEventListener('message', handleMessage, { once: true })

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    mutate()
  }, [payload])

  return { tableState: data, isLoading: isValidating, error, mutate }
}

export default useBubbleIo
