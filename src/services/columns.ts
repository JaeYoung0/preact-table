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

export const createCustomCol = async (user_id: string, command: createCustomColCommand) => {
  const result = await CigroAPI_V2('/metrics/columns', {
    params: {
      user_id,
    },
    method: 'POST',
    body: command,
  })
  return result
}

export type updateCustomColCommand = createCustomColCommand & {
  id: number
}

export const updateCustomCol = async (user_id: string, command: updateCustomColCommand) => {
  const result = await CigroAPI_V2(`/metrics/columns/${command.id}`, {
    params: {
      user_id,
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

export const updateCols = async (user_id: string, command: updateColsCommand) => {
  CigroAPI_V2('/metrics/columns', {
    params: {
      user_id,
    },
    method: 'PUT',
    body: command,
  })
}

export type deleteCustomColCommand = {
  id: number
}

export const deleteCustomCol = async (user_id: string, command: deleteCustomColCommand) => {
  const result = await CigroAPI_V2(`/metrics/columns/${command.id}`, {
    params: {
      user_id,
    },
    method: 'DELETE',
  })
  return result
}
