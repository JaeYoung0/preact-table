import { useContext, useState } from 'preact/hooks'
import { createContext } from 'preact'

type PromptContextType = {
  confirm: {
    prompt: string
    isOpen: boolean
    proceed: any
    cancel: any
  }
  handleConfirm: (prompt: any) => void
}

export const ConfirmContext = createContext<PromptContextType>({
  confirm: {
    prompt: '',
    isOpen: false,
    proceed: null,
    cancel: null,
  },
  handleConfirm: () => 0,
})

const ConfirmContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [confirm, setConfirm] = useState({
    prompt: '',
    isOpen: false,
    proceed: null,
    cancel: null,
  })

  const handleConfirm = (prompt: any) => setConfirm(prompt)

  return (
    <ConfirmContext.Provider
      value={{
        confirm,
        handleConfirm,
      }}
    >
      {children}
    </ConfirmContext.Provider>
  )
}

export default ConfirmContextProvider
