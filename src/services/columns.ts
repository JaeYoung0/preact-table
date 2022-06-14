import { CigroAPI_V2 } from '@/helper/api'
import { DeployType, MetricsType } from '@/hooks/useTableState'

export type createCustomColCommand = {
  label: string
  display: 'NUMBER' | 'PERCENT' | 'WON'
  description?: string
  formula: string
  metrics_type: MetricsType
  type: 'CUSTOM'
  status: 'HIDDEN'
}

type ConfigType = {
  user_id: string
  env: DeployType
}

export const createCustomCol = async (config: ConfigType, command: createCustomColCommand) => {
  const { user_id, env } = config
  const result = await CigroAPI_V2('/metrics/columns', {
    params: {
      user_id,
      env,
    },
    method: 'POST',
    body: command,
  })
  return result
}

export type updateCustomColCommand = createCustomColCommand & {
  id: number
}

export const updateCustomCol = async (config: ConfigType, command: updateCustomColCommand) => {
  const { user_id, env } = config
  const result = await CigroAPI_V2(`/metrics/columns/${command.id}`, {
    params: {
      user_id,
      env,
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

export const updateCols = async (config: ConfigType, command: updateColsCommand) => {
  const { user_id, env } = config
  CigroAPI_V2('/metrics/columns', {
    params: {
      user_id,
      env,
    },
    method: 'PUT',
    body: command,
  })
}

export type deleteCustomColCommand = {
  id: number
}

export const deleteCustomCol = async (config: ConfigType, command: deleteCustomColCommand) => {
  const { user_id, env } = config
  const result = await CigroAPI_V2(`/metrics/columns/${command.id}`, {
    params: {
      user_id,
      env,
    },
    method: 'DELETE',
  })
  return result
}
