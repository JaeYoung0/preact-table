export type ParamsType = Record<string, any>

function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

export const CigroAPI_V2 = (
  endpoint: string,
  config: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    params: ParamsType
    body?: any
  }
) => {
  const deployType = config.params.env as 'prod' | 'dev'

  const baseUrl = {
    dev: 'https://dev.cigro.io/api/v2',
    prod: 'https://prod.cigro.io/api/v2',
  }

  const prefix = baseUrl[deployType] ?? baseUrl['prod']

  let options: { method: string; body?: string } = {
    method: config.method,
  }

  const { env, ...rest } = config.params
  endpoint += '?' + new URLSearchParams(rest).toString()

  if (config.method !== 'GET') {
    options.body = JSON.stringify(config.body)
  }

  return fetch(prefix + endpoint, options)
    .then(handleErrors)
    .then((response) => response.json())
    .catch((err) => {
      throw err
    })
}
