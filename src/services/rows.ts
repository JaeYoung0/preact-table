import { CigroAPI_V2 } from '@/helper/api'

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
  const result = await CigroAPI_V2('/metrics', {
    method: 'GET',
    params: payload,
  })
  return result
}
