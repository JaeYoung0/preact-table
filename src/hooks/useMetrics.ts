import { useMemo } from 'preact/hooks'
import { GridRowModel } from '@mui/x-data-grid'
import useSWR from 'swr'
import { fetchMetrics } from '@/services/rows'

interface Props {
  pageSize: number
  page: number
}

function useMetrics({ pageSize, page }: Props) {
  const key = {
    user_id: '1625805300271x339648481160378400',
    start: '1618833417',
    end: '1650369417',
    metrics_type: 'SALES',
    per_page: pageSize,
    page,
  }

  const {
    data = [],
    error,
    mutate,
    isValidating,
  } = useSWR<Record<string, unknown>[], Error>(
    JSON.stringify(key),

    () => fetchMetrics(key),
    {
      dedupingInterval: 3000,
      errorRetryCount: 3,

      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  /**
   * FIXME: data가 {detail: 'column formula error: 옳지 않은 식입니다. [상품가격 * 상품 할인가]'}로 들어오기도 한다. 이때 error가 undefined인게 이상함
   */

  const rows: GridRowModel[] = useMemo(() => {
    if (!data || error) return []

    return data?.map((row, idx) => ({ ...row, id: idx }))
  }, [data, error])

  return {
    rows,
    mutate,
    error,
    isLoading: isValidating,
  }
}

export default useMetrics
