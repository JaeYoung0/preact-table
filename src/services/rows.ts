import { CigroAPI_V2 } from '@/helper/api'
import dayjs from 'dayjs'

type getMetricsCommand = {
  user_id: string
  start: string
  end: string
  metrics_type: string

  search_field?: string
  keyword?: string

  order_by_col_num?: number
  sort?: 'ASC' | 'DESC'
}

export const fetchMetrics = async (payload: getMetricsCommand) => {
  const diffMonth = Math.abs(dayjs(payload.start).diff(dayjs(payload.end), 'month'))

  if (diffMonth > 12) {
    throw new Error('최대 1년까지 조회할 수 있습니다.')
  }

  const result = await CigroAPI_V2('/metrics', {
    method: 'GET',
    params: payload,
  })
  return result
}
