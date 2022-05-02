import useSWR from 'swr'
import { CigroAPI_V2 } from '@/helper/api'
import { useMemo } from 'preact/hooks'
import useBubbleIo from './useBubbleIo'

export type ColData = CustomColType | OriginalColType

export type CustomColType = {
  type: 'CUSTOM'
  metrics_type: 'SALES'
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
  metrics_type: 'SALES'
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
  const { tableState } = useBubbleIo()

  const { data, error, mutate, isValidating } = useSWR<ColData[]>(
    tableState ? '/metrics/columns' : null,
    (key) =>
      CigroAPI_V2(key, {
        method: 'GET',
        params: {
          user_id: tableState?.user_id ?? '',
          metrics_type: 'SALES',
        },
      }),
    {
      dedupingInterval: 3000,
      errorRetryCount: 3,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // refreshInterval: 5000, // 5초마다 폴링
    }
  )

  console.log('@@useCols data', data)

  const visibleCols = useMemo(() => {
    if (!data || error) return []
    return data.filter((item) => item.status === 'VISIBLE')
  }, [data, isValidating])

  const hiddenCols = useMemo(() => {
    if (!data || error) return []
    return data.filter((item) => item.status === 'HIDDEN')
  }, [data, isValidating])

  /**
   * 맞춤 지표 만들기의 재료가 될 수 있는 cols 모음
   */
  const ingredientCols = useMemo(() => {
    if (!data) return []
    return data.filter((item) => item.type === 'ORIGINAL' && item.display !== 'TEXT')
  }, [data])

  console.log('@@ingredientCols', ingredientCols)

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
