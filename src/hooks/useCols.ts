import { MetricsType } from '@/hooks/useTableState'
import useSWR from 'swr'
import { CigroAPI_V2 } from '@/helper/api'
import { useMemo } from 'preact/hooks'
import useTableState from './useTableState'

export type ColData = CustomColType | OriginalColType

export type CustomColType = {
  type: 'CUSTOM'
  metrics_type: MetricsType
  label: string
  display: 'WON' | 'PERCENT' | 'NUMBER'
  order: number
  formula: string
  company_id: number
  status: 'VISIBLE' | 'HIDDEN'
  description: string
  id: number
}

export type OriginalColType = {
  type: 'ORIGINAL'
  metrics_type: MetricsType
  label: string
  display: 'TEXT' | 'WON' | 'PERCENT' | 'NUMBER'
  order: number
  formula: string
  company_id: number
  status: 'VISIBLE' | 'HIDDEN'
  description: string
  id: number
}

function useCols() {
  const { tableState, mustBeSavedVisibleLabelList } = useTableState()

  const { data, error, mutate, isValidating } = useSWR<ColData[]>(
    tableState ? ['/metrics/columns', tableState.metrics_type] : null,
    (key) =>
      CigroAPI_V2('/metrics/columns', {
        method: 'GET',
        params: {
          user_id: tableState?.user_id ?? '',
          env: tableState?.env ?? 'prod',
          metrics_type: tableState?.metrics_type,
        },
      })
  )

  const visibleCols = useMemo(() => {
    if (!data || error) return []

    const filtered = data.filter((item) => {
      if (mustBeSavedVisibleLabelList.includes(item.label)) return true
      return item.status === 'VISIBLE'
    })

    return filtered
  }, [data, isValidating])

  const hiddenCols = useMemo(() => {
    if (!data || error) return []

    return data.filter((item) => {
      if (mustBeSavedVisibleLabelList.includes(item.label)) return false
      return item.status === 'HIDDEN'
    })
  }, [data, isValidating])

  /**
   * 맞춤 지표 만들기의 재료가 될 수 있는 cols 모음
   */
  const ingredientCols = useMemo(() => {
    if (!data) return []
    return data.filter((item) => item.type === 'ORIGINAL' && item.display !== 'TEXT')
  }, [data])

  return {
    visibleCols,
    hiddenCols,
    ingredientCols,
    mutate,
    error,
    isLoading: isValidating,
  }
}

export default useCols
