import AlertModal from '@/components/Modals/AlertModal'
import PromptModal from '@/components/Modals/PromptModal'
import { Overlay } from '@/components/Modals/Overlay'
import { createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { uniqueID } from '@/uniqueID'
import ConfirmModal from '@/components/Modals/ConfirmModal/ConfirmModal'

type ModalContextType = {
  modals: any[]
  openModal: (modal: ModalType) => void | Promise<any>
  closeModal: (id: number) => void
  handlePromptValue: (value: any) => void
  promptValue: any
}

type AlertModalType = {
  type: 'Alert'
  props: { id: number; message: string }
}

export type PromptModalType = {
  type: 'Prompt'
  props: {
    id: number
    message: string
    onClose?: () => void // FIXME: open할 때는 없어도 되는 props 구분하기
    value?: number
    handlePromptValue?: (newValue: string) => void
    // resolve?:()=>void
    resolve?: (value: unknown) => void
    inputType?: 'text' | 'number'
  }
}

export type ConfrimModalType = {
  type: 'Confirm'
  props: {
    message: string
    id?: number // optional은 모두 openModal에서 받을 필요없는 props임
    onClose?: () => void
    onOk?: () => void
  }
}

export type ModalType = AlertModalType | ConfrimModalType | PromptModalType

const dafaultContext = {
  modals: [],
  openModal: () => new Promise((resolve) => resolve(0)),
  closeModal: () => 0,
  handlePromptValue: () => 0,
  promptValue: '',
}

const ModalContext = createContext<ModalContextType>(dafaultContext)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalType[]>([])

  const [promptValue, setPromptValue] = useState<any>('')

  const handlePromptValue = (newValue: any) => setPromptValue(newValue)

  const openModal = (modal: ModalType) => {
    console.log('@@modal', modal)

    if (modal.type === 'Alert') return setModals([...modals, modal])

    if (modal.type === 'Confirm')
      return new Promise((resolve) => {
        const modalId = uniqueID()

        const { message } = modal.props
        setModals([
          ...modals,
          {
            type: 'Confirm',
            props: {
              id: modalId,
              message,
              onClose: () => {
                resolve(false)
                closeModal(modalId)
              },
              onOk: () => {
                resolve(true)
                closeModal(modalId)
              },
            },
          },
        ])
      })

    // 1. 전역에서 setModal
    // 2. Prompt 객체가 들어가고 컴포넌트 렌더링
    // 3.
    // PromptModal은 Promise 기반으로 값을 리턴한다.
    return new Promise((resolve) => {
      setModals([
        ...modals,
        {
          type: 'Prompt',
          props: {
            ...modal.props,
            // handlePromptValue,
            resolve,
            onClose: () => {
              closeModal(modal.props.id)
            },
          },
        },
      ])
    })
  }

  const closeModal = (id: number) => setModals([...modals.filter((m) => m.props.id !== id)])

  const renderModals = (modals: ModalType[]) =>
    modals.map((modal) => {
      switch (modal.type) {
        case 'Alert':
          return (
            <AlertModal
              {...modal.props}
              id={modal.props.id}
              onClose={() => closeModal(modal.props.id)}
            />
          )
        case 'Prompt':
          return <PromptModal {...modal.props} id={modal.props.id} />

        case 'Confirm':
          return <ConfirmModal {...modal.props} />

        default:
          return null
      }
    })

  return (
    <ModalContext.Provider
      value={{
        modals,
        openModal,
        closeModal,
        handlePromptValue,
        promptValue,
      }}
    >
      <div id="modal-root">
        {modals.length > 0 && <Overlay onClick={() => setModals([])} />}
        {renderModals(modals)}
        {children}
      </div>
    </ModalContext.Provider>
  )
}

export default function useModals() {
  const context = useContext(ModalContext)

  return context
}
