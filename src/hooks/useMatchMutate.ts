import { useSWRConfig } from 'swr'

// SWR에서 전역 cache provider를 설정했을 때 mutate를 위해 사용하는 훅
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
