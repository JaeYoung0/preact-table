import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { GridRowModel } from '@mui/x-data-grid'
import useSWR from 'swr'
import { fetchMetrics } from '@/services/rows'
import useBubbleIo from './useBubbleIo'

export type RowType = Record<string, any>

export type MetricsResponse = {
  report: RowType[]
  total_cnt: number // 전체 row 갯수
}

function useMetrics() {
  const { tableState } = useBubbleIo()
  const [fetchedKeys, setFetchedKeys] = useState<any[]>([])

  // tableState 객체를 직렬화하지 않으면 mutate가 제대로 되지 않는다.
  const {
    data = { report: [], total_cnt: 0 },
    error,
    mutate,
    isValidating,
  } = useSWR<MetricsResponse, Error>(tableState ? JSON.stringify(tableState) : null, (tableState) =>
    fetchMetrics(JSON.parse(tableState))
  )

  const rowFetchKey = tableState ? JSON.stringify(tableState) : null
  // const fetchedKeys = [new Set(rowFetchKey)]
  // console.log('@@fetchedKeys', fetchedKeys)

  useEffect(() => {
    setFetchedKeys([...fetchedKeys, rowFetchKey])
  }, [rowFetchKey])

  const uniqueFetchedKeys = [...new Set(fetchedKeys)]
  console.log('@@uniqueFetchedKeys', uniqueFetchedKeys)

  /**
   * FIXME: data가 {detail: 'column formula error: 옳지 않은 식입니다. [상품가격 * 상품 할인가]'}로 들어오기도 한다. 이때 error가 undefined인게 이상함
   */

  // FIXME: page 0 , 1, 2... 새로운 페이지 콜할 때마다 전체 rows는 합쳐줘야함
  const rows: GridRowModel[] = useMemo(() => {
    if (!data || error) return []

    return data?.report?.map((row, idx) => ({ ...row, id: idx }))
  }, [data, error])

  const prevTotalRows = useRef(0)

  const totalRows = useMemo(() => {
    if (tableState?.page !== 0) return prevTotalRows.current
    if (!data || error) return 0

    prevTotalRows.current = data?.total_cnt
    return data.total_cnt
  }, [data, error])

  return {
    rows,
    mutate,
    error,
    isLoading: isValidating,
    data,
    totalRows,
    rowFetchKey,
  }
}

export default useMetrics
