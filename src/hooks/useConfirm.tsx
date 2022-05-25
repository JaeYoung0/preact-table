import { ConfirmContext } from '@/contexts/confirm'
import { useContext } from 'preact/hooks'
// import { ConfirmContext } from "./ConfirmContextProvider";
// ConfirmContext

const useConfirm = () => {
  const { confirm, handleConfirm } = useContext(ConfirmContext)

  const isConfirmed = (prompt: any) => {
    const promise = new Promise((resolve, reject) => {
      handleConfirm({
        prompt,
        isOpen: true,
        proceed: resolve,
        cancel: reject,
      })
    })

    return promise.then(
      () => {
        handleConfirm({ ...confirm, isOpen: false })
        return true
      },
      () => {
        handleConfirm({ ...confirm, isOpen: false })
        return false
      }
    )
  }
  return {
    ...confirm,
    isConfirmed,
  }
}

export default useConfirm
