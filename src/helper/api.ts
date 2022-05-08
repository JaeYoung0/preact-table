export type ParamsType = Record<string, any>

function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText)

    // if (response.status == 404) {
    // }
  }
  return response
}

export const CigroAPI_V2 = (
  endpoint: string,
  config: {
    params: ParamsType
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: any
  }
) => {
  const prefix = 'https://dev.cigro.io/api/v2'

  let options: { method: string; body?: string } = {
    method: config.method,
  }
  endpoint += '?' + new URLSearchParams(config.params).toString()

  if (config.method !== 'GET') {
    //  FIXME: stringify를 해야해?..
    options.body = JSON.stringify(config.body)
  }

  return fetch(prefix + endpoint, options)
    .then(handleErrors)
    .then((response) => response.json())
    .catch((err) => {
      // console.error(err);
      throw err
    })
}
