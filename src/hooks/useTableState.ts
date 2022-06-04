import { useEffect, useState } from 'preact/hooks'

export type TableStateType = {
  metrics_type: 'SALES' // default
  user_id: string
  start: string
  end: string
  page: number
  per_page: number

  // 소팅
  order_by_col_num: number
  sort: 'ASC' | 'DESC'

  // 필터링
  search_field: string
  keyword: string
}

type BubbleIoInjectionData = {
  payload: TableStateType
  reset: boolean
}

/**
 * Bubbie.io에서 postMessage를 쏘면 여기서 받는다.
    window.postMessage({
      payload: {
        user_id: '1651800183717x956761776063033100',
        start: '2021-12-05',
        end: '2022-04-05',
        metrics_type: 'SALES',
        order_by_col_num: 1,
        per_page:10,
        page:0
      },
      reset: false
    })
 */
function useTableState() {
  const [tableState, setTableState] = useState<TableStateType | null>(null)

  useEffect(() => {
    const handleMessage = (e: MessageEvent<BubbleIoInjectionData>) => {
      const { payload, reset } = e.data

      setTableState(payload)
    }
    window.addEventListener('message', handleMessage)

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return {
    tableState,
  }
}

export default useTableState
