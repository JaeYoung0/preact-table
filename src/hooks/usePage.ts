import { fetchMetrics } from '@/services/rows'
import React from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

export type RowType = Record<string, any>

export type MetricsResponse = {
  report: RowType[]
  total_cnt: number // 전체 row 갯수
}

function usePage(rowFetchKey: string | null) {
  console.log('@@@@rowFetchKey@', rowFetchKey)

  // FIXME: useMetrics와 중복호출
  const fetcher = (url: string) => fetchMetrics(JSON.parse(url))

  const { isValidating: singlePageLoading } = useSWR<MetricsResponse[], Error>(
    rowFetchKey,
    fetcher,
    { dedupingInterval: 2000 }
  )

  return {
    singlePageLoading,
  }
}

export default usePage
