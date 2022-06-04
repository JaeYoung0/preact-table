import { useMemo, useRef, useState } from 'preact/hooks'
import { GridRowModel } from '@mui/x-data-grid'
import useSWR from 'swr'
import { fetchMetrics } from '@/services/rows'
import useTableState from './useTableState'

export type RowType = Record<string, any>

export type MetricsResponse = {
  report: RowType[]
  total_cnt: number // 전체 row 갯수
}

function useMetrics() {
  const { tableState } = useTableState()

  const rowFetchKey = tableState ? JSON.stringify(tableState) : null
  const [rowFetchKeys, setRowFetchKeys] = useState<any[]>([])

  const isPoppedFromCaches = useRef(false)

  const fetcher = (url: string) => fetchMetrics(JSON.parse(url))

  const {
    data = { report: [], total_cnt: 0 },
    error,
    mutate,
    isValidating,
  } = useSWR<MetricsResponse, Error>(rowFetchKey, fetcher)

  const handleRowFetchKeys = (newValues: string[]) => setRowFetchKeys(newValues)

  /**
   * FIXME: data가 {detail: 'column formula error: 옳지 않은 식입니다. [상품가격 * 상품 할인가]'}로 들어오기도 한다. 이때 error가 undefined인게 이상함
   */

  const rows: GridRowModel[] = useMemo(() => {
    if (!data || error) return []

    return data?.report.map((item, index) => ({ ...item, id: index }))
  }, [data, error])

  const isInitialFetch = rowFetchKeys.length === 1

  const prevTotalRows = useRef(0)
  console.log('@@@@prevTotalRows', prevTotalRows)

  const totalRows = useMemo(() => {
    if (!data || data.total_cnt == 0) return prevTotalRows.current
    if (error) return 0

    prevTotalRows.current = data.total_cnt
    return data.total_cnt
  }, [data, error, tableState])
  // console.log('@@@totalRows', totalRows)

  return {
    rows,
    mutate,
    error,
    isLoading: isValidating,
    data,
    totalRows,

    shouldMergeRows: !isPoppedFromCaches.current || isInitialFetch,
    handleRowFetchKeys,
  }
}

export default useMetrics
