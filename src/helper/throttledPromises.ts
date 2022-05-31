// https://stackoverflow.com/questions/53948280/how-to-throttle-promise-all-to-5-promises-per-second

export async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
export function split(arr: any[], n: number) {
  var res = []
  while (arr.length) {
    res.push(arr.splice(0, n))
  }
  return res
}
export const delayMS = (t = 200) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(t)
    }, t)
  })
}
export const throttledPromises = (
  asyncFunction = () => 0,
  items = [],
  batchSize = 1,
  delay = 0
) => {
  return new Promise(async (resolve, reject) => {
    const output: any[] = []
    const batches = split(items, batchSize)
    await asyncForEach(batches, async (batch: any) => {
      const promises = batch.map(asyncFunction).map((p: Promise<any>) => p.catch(reject))
      const results = await Promise.all(promises)
      output.push(...results)
      await delayMS(delay)
    })
    resolve(output)
  })
}
