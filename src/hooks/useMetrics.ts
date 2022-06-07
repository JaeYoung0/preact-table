import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
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
  console.log('@@tableState', tableState)

  const rowFetchKey = tableState ? JSON.stringify(tableState) : null
  const [rowFetchKeys, setRowFetchKeys] = useState<any[]>([])
  console.log('@@rowFetchKeys', rowFetchKeys)

  useEffect(() => {
    if (!tableState) return
    setRowFetchKeys([...new Set([...rowFetchKeys, rowFetchKey])])
  }, [tableState])

  const isPoppedFromCaches = useRef(false)

  const fetcher = (url: string) => fetchMetrics(JSON.parse(url))

  const {
    data = { report: [], total_cnt: 0 },
    error,
    mutate,
    isValidating,
  } = useSWR<MetricsResponse, Error>(rowFetchKey, fetcher)

  const rows: GridRowModel[] = useMemo(() => {
    if (!data || error) return []

    return data?.report.map((item, index) => ({ ...item, id: index }))
  }, [data, error])

  const isInitialFetch = rowFetchKeys.length === 1

  const prevTotalRows = useRef(0)

  const totalRows = useMemo(() => {
    if (!data || data.total_cnt == 0) return prevTotalRows.current
    if (error) return 0

    prevTotalRows.current = data.total_cnt
    return data.total_cnt
  }, [data, error, tableState])

  return {
    rows,
    mutate,
    error,
    isLoading: isValidating,
    data,
    totalRows,
    shouldMergeRows: !isPoppedFromCaches.current || isInitialFetch,

    rowFetchKeys,
  }
}

export default useMetrics
