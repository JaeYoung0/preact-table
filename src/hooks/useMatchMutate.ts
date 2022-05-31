import { useSWRConfig } from 'swr'

function useMatchMutate() {
  const { cache, mutate } = useSWRConfig()

  return (matcher: any, ...args: any[]) => {
    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance')
    }

    const keys = []

    for (const key of cache.keys()) {
      if (matcher.test(key)) {
        keys.push(key)
      }
    }

    console.log('####keys', keys)

    const mutations = keys.map((key) => mutate(key, ...args))
    return Promise.all(mutations)
  }
}

export default useMatchMutate
