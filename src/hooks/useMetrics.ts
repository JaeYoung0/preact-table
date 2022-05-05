import { useMemo } from 'preact/hooks'
import { GridRowModel } from '@mui/x-data-grid'
import useSWR from 'swr'
import { fetchMetrics } from '@/services/rows'
import useBubbleIo from './useBubbleIo'

export type RowType = Record<string, unknown>

function useMetrics() {
  const { tableState } = useBubbleIo()

  console.log('@@tableState', tableState)

  // tableState 객체를 직렬화하지 않으면 mutate가 제대로 되지 않는다.
  const { data = [], error, mutate, isValidating } = useSWR<RowType[], Error>(
    tableState ? JSON.stringify(tableState) : null,
    (tableState) => fetchMetrics(JSON.parse(tableState))
  )

  /**
   * FIXME: data가 {detail: 'column formula error: 옳지 않은 식입니다. [상품가격 * 상품 할인가]'}로 들어오기도 한다. 이때 error가 undefined인게 이상함
   */

  // FIXME: page 0 , 1, 2... 새로운 페이지 콜할 때마다 전체 rows는 합쳐줘야함
  const rows: GridRowModel[] = useMemo(() => {
    if (!data || error) return []

    return data?.map((row, idx) => ({ ...row, id: idx }))
  }, [data, error])

  return {
    rows,
    mutate,
    error,
    isLoading: isValidating,
    data,
  }
}

export default useMetrics
