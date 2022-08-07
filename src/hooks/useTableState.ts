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

  // 렌더링시 배제할 컬럼명 모음
  // excludedLabels: string[]

  // excludedLabels에 넣었던 아이템은 mustBeSavedVisibleOnServer에서 visibleOnTable을 false로 할 것
  // 서버에 반드시 VISIBLE로 저장되어있어야 하는 열 목록
  mustBeSavedVisibleOnServer: { label: string; visibleOnTable: boolean }[]
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
    mustBeSavedVisibleOnServer: tableState?.mustBeSavedVisibleOnServer ?? [],
    mustBeSavedVisibleLabelList:
      tableState?.mustBeSavedVisibleOnServer.map((item) => item.label) ?? [],
    mustBeSavedVisibleMapper:
      tableState?.mustBeSavedVisibleOnServer.reduce<Record<string, unknown>>(
        (acc, cur) => ({ ...acc, [cur.label]: cur.visibleOnTable }),
        {}
      ) ?? {},
  }
}

export default useTableState
