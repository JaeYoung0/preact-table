import { useEffect, useState } from 'preact/hooks'

export type DeployType = 'dev' | 'prod'
export type MetricsType = 'SALES' | 'AD'

export type TableStateType = {
  metrics_type: MetricsType
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
  visibleLabels: string[]
}

type BubbleIoInjectionData = {
  key: typeof ALLOW_KEY
  payload: TableStateType
}

const ALLOW_KEY = 'cigro-table'

/**
 * Bubbie.io에서 window.postMessage를 쏘면 여기서 받는다.
 */
function useTableState() {
  const [tableState, setTableState] = useState<TableStateType | null>(null)

  useEffect(() => {
    const handleMessage = (e: MessageEvent<BubbleIoInjectionData>) => {
      const { payload, key } = e.data
      if (key !== ALLOW_KEY) return
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
