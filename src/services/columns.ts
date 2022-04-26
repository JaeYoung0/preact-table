import { CigroAPI_V2 } from '@/helper/api'

export type createCustomColCommand = {
  label: string
  display: 'NUMBER' | 'PERCENT' | 'WON'
  description?: string
  formula: string
  metrics_type: 'SALES'
  type: 'CUSTOM'
  status: 'HIDDEN'
}

export const createCustomCol = async (command: createCustomColCommand) => {
  const result = await CigroAPI_V2('/metrics/columns', {
    params: {
      user_id: '1625805300271x339648481160378400',
    },
    method: 'POST',
    body: command,
  })
  return result
}

export type updateCustomColCommand = createCustomColCommand & {
  id: number
}

export const updateCustomCol = async (command: updateCustomColCommand) => {
  const result = await CigroAPI_V2(`/metrics/columns/${command.id}`, {
    params: {
      user_id: '1625805300271x339648481160378400',
    },
    method: 'PUT',
    body: command,
  })
  return result
}

export type updateColsCommand = {
  type: 'CUSTOM' | 'ORIGINAL'
  status: string
  order: number | null
  id: number
}[]

export const updateCols = async (command: updateColsCommand) => {
  CigroAPI_V2('/metrics/columns', {
    params: {
      user_id: '1625805300271x339648481160378400',
    },
    method: 'PUT',
    body: command,
  })
}

export type deleteCustomColCommand = {
  id: number
}

export const deleteCustomCol = async (command: deleteCustomColCommand) => {
  const result = await CigroAPI_V2(`/metrics/columns/${command.id}`, {
    params: {
      user_id: '1625805300271x339648481160378400',
    },
    method: 'DELETE',
  })
  return result
}
