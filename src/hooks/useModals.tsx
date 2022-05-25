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

export type AlertModalType = {
  type: 'Alert'
  props: {
    id?: number // FIXME: open할 때는 없어도 되는 props 구분하기
    message: string
    onClose?: () => void
  }
}

export type PromptModalType = {
  type: 'Prompt'
  props: {
    id?: number
    message: string
    onClose?: () => void
    value?: number
    handlePromptValue?: (newValue: string) => void
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
    if (modal.type === 'Alert') {
      const { message } = modal.props
      const modalId = uniqueID()

      return setModals([
        ...modals,
        {
          type: 'Alert',
          props: {
            id: modalId,
            message,
          },
        },
      ])
    }

    if (modal.type === 'Confirm')
      return new Promise((resolve) => {
        const { message } = modal.props
        const modalId = uniqueID()

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

    return new Promise((resolve) => {
      const modalId = uniqueID()

      setModals([
        ...modals,
        {
          type: 'Prompt',
          props: {
            id: modalId,
            ...modal.props,
            // handlePromptValue,
            resolve,
            onClose: () => {
              closeModal(modalId)
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

              // onClose={() => closeModal(modal.props.id)}
            />
          )
        case 'Prompt':
          return <PromptModal {...modal.props} />

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
