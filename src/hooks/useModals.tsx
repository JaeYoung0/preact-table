import AlertModal from '@/components/Modals/AlertModal'
import PromptModal from '@/components/Modals/PromptModal'
import { Overlay } from '@/components/Modals/Overlay'

import { createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'

type ModalContextType = {
  modals: any[]
  openModal: (modal: ModalType) => void
  closeModal: (id: number) => void
}

type AlertModal = {
  type: 'Alert'
  props: { id: number; message: string }
}

type ConfirmModal = {
  type: 'Confirm'
  props: { id: number; message: string; onClose: () => any; value: number }
}

export type PromptModal = {
  type: 'Prompt'
  props: {
    id: number
    message: string
    onClose?: (id: number) => void // FIXME: open할 때는 없어도 되는 props 구분하기
    value?: number
    handleInputChange?: (newValue: string) => void
  }
}

export type ModalType = AlertModal | ConfirmModal | PromptModal

const dafaultContext = {
  modals: [],
  openModal: () => 0,
  closeModal: () => 0,
}

const ModalContext = createContext<ModalContextType>(dafaultContext)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalType[]>([])

  const [promptValue, setPromptValue] = useState<string>('')
  console.log('@@promptValue', promptValue)

  const openModal = (modal: ModalType) => {
    if (modal.type !== 'Prompt') return setModals([...modals, modal])

    // FIXME: Promise 기반 Prompt
    return new Promise((resolve) => {
      setModals([
        ...modals,
        {
          type: 'Prompt',
          props: {
            ...modal.props,
            // onCl
            handleInputChange: (newValue: string) => {
              setPromptValue(newValue)
            },
            onClose: () => {
              closeModal(modal.props.id)
              resolve(promptValue)
              // setPromptValue('')
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
          return (
            <PromptModal
              {...modal.props}
              id={modal.props.id}
              // onClose={() => {
              //   closeModal(modal.props.id)

              // // return new Promise((resolve) => resolve(1))
              // }}
            />
          )

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
