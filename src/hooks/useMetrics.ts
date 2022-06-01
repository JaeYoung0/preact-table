import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { GridRowModel } from '@mui/x-data-grid'
import useSWR, { useSWRConfig } from 'swr'
import { fetchMetrics } from '@/services/rows'
import useBubbleIo from './useBubbleIo'
import throttle from '@/helper/throttle'
import usePage from './usePage'

export type RowType = Record<string, any>

export type MetricsResponse = {
  report: RowType[]
  total_cnt: number // 전체 row 갯수
}

function useMetrics() {
  const { tableState } = useBubbleIo()
  const rowFetchKey = tableState ? JSON.stringify(tableState) : null
  const [rowFetchKeys, setRowFetchKeys] = useState<any[]>([])
  // const { cache } = useSWRConfig()

  // const { singlePageLoading } = usePage(rowFetchKey)

  console.log('@@@@rowFetchKeys', JSON.stringify(rowFetchKeys))

  const isPoppedFromCaches = useRef(false)

  const fetcher = (url: string) => fetchMetrics(JSON.parse(url))

  // const multiFetcher = (rowFetchKeys: string) => {
  //   const urls = JSON.parse(rowFetchKeys) as string[]
  //   return Promise.all(
  //     urls.map((url) => (cache.get(url) ? cache.get(url) : fetchMetrics(JSON.parse(url))))
  //   )
  // }

  const {
    data = { report: [], total_cnt: 0 },
    error,
    mutate,
    isValidating,
  } = useSWR<MetricsResponse, Error>(rowFetchKey, fetcher)

  useEffect(() => {
    if (rowFetchKeys.includes(rowFetchKey)) {
      isPoppedFromCaches.current = true
    } else {
      isPoppedFromCaches.current = false
    }

    if (rowFetchKey === null) return
    else setRowFetchKeys([...new Set([...rowFetchKeys, rowFetchKey])])
  }, [rowFetchKey])

  const handleRowFetchKeys = (newValues: string[]) => setRowFetchKeys(newValues)

  /**
   * FIXME: data가 {detail: 'column formula error: 옳지 않은 식입니다. [상품가격 * 상품 할인가]'}로 들어오기도 한다. 이때 error가 undefined인게 이상함
   */

  const rows: GridRowModel[] = useMemo(() => {
    if (!data || error) return []
    console.log('@@@@data', data)

    // const result = data.reduce(
    //   (acc, cur) => ({
    //     report: [...acc.report, ...cur.report],
    //     total_cnt: cur.total_cnt,
    //   }),
    //   { report: [], total_cnt: 0 }
    // )

    return data?.report
  }, [data, error])

  const isInitialFetch = rowFetchKeys.length === 1

  const prevTotalRows = useRef(0)

  const totalRows = useMemo(() => {
    if (tableState?.page !== 0) return prevTotalRows.current
    // if (data.length === 0 || error) return 0
    if (error) return 0

    prevTotalRows.current = data.total_cnt
    return data.total_cnt
  }, [data, error])

  const fetchAllRows = () => {
    if (!tableState) return
    const { page, ...rest } = tableState
    window.postMessage({
      payload: {
        ...rest,
        // page: current.page,
        // per_page: current.perPage,
      },
      reset: true,
    })
  }

  return {
    rows,
    mutate,
    error,
    isLoading: isValidating,
    data,
    totalRows,

    shouldMergeRows: !isPoppedFromCaches.current || isInitialFetch,
    fetchAllRows,
    handleRowFetchKeys,
  }
}

export default useMetrics
