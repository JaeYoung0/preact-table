import { useEffect, useState } from 'preact/hooks'

export type DeployType = 'dev' | 'prod'

export type TableStateType = {
  metrics_type: 'SALES' // default
  user_id: string
  env: DeployType
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
}

/**
 * Bubbie.io에서 window.postMessage를 쏘면 여기서 받는다.
 */
function useTableState() {
  const [tableState, setTableState] = useState<TableStateType | null>(null)

  useEffect(() => {
    const handleMessage = (e: MessageEvent<BubbleIoInjectionData>) => {
      const { payload } = e.data

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
