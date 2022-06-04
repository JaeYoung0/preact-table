import { CigroAPI_V2 } from '@/helper/api'
import { TableStateType } from '@/hooks/useTableState'
import dayjs from 'dayjs'

type getMetricsCommand = {
  [P in keyof Omit<TableStateType, 'page'>]: TableStateType[P]
} & {
  page?: number
}

export type RowType = Record<string, any>

export type MetricsResponse = {
  report: RowType[]
  total_cnt: number // 전체 row 갯수
}

export const fetchMetrics = async (payload: getMetricsCommand) => {
  console.log('@@@@fetchMetrics payload', payload)

  const diffMonth = Math.abs(dayjs(payload.start).diff(dayjs(payload.end), 'month'))

  if (diffMonth > 12) {
    throw new Error('최대 1년까지 조회할 수 있습니다.')
  }

  const result: MetricsResponse = await CigroAPI_V2('/metrics', {
    method: 'GET',
    params: { ...payload },
  })
  return result
}
