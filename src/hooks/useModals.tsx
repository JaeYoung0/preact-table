import AlertModal from '@/components/Modals/AlertModal'
import PromptModal from '@/components/Modals/PromptModal'
import { Overlay } from '@/components/Modals/Overlay'

import { createContext } from 'preact'
import { useCallback, useContext, useEffect, useState } from 'preact/hooks'

type ModalContextType = {
  modals: any[]
  openModal: (modal: ModalType) => void | Promise<any>
  closeModal: (id: number) => void
  handlePromptValue: (value: any) => void
  promptValue: any
}

type AlertModal = {
  type: 'Alert'
  props: { id: number; message: string }
}

type ConfirmModal = {
  type: 'Confirm'
  props: { id: number; message: string; onClose: () => any; value: number }
}

export type PromptModalType = {
  type: 'Prompt'
  props: {
    id: number
    message: string
    onClose?: () => void // FIXME: open할 때는 없어도 되는 props 구분하기
    value?: number
    handlePromptValue?: (newValue: string) => void
  }
}

export type ModalType = AlertModal | ConfirmModal | PromptModalType

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

    if (modal.type !== 'Prompt') return setModals([...modals, modal])

    // PromptModal은 Promise 기반으로 값을 리턴한다.
    return new Promise((resolve) => {
      setModals([
        ...modals,
        {
          type: 'Prompt',
          props: {
            ...modal.props,
            // handlePromptValue,
            onClose: () => {
              resolve(true)

              // FIXME - 클로저에 갇혀버린다.
              // resolve(promptValue)

              closeModal(modal.props.id)
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
          return <PromptModal {...modal.props} id={modal.props.id} />

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
