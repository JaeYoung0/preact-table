import { useContext, useState } from 'preact/hooks'
import { createContext } from 'preact'

type PromptContextType = {
  prompt: ''
  isOpen: false
  proceed: null
  cancel: null
}

// const defaultContext = {
//  prompt:{
//   prompt: '',
//   isOpen: false,
//   proceed: null,
//   cancel: null,
//  }

//  setPrompt: (newPrompt: PromptContextType) => {}

//   // isOpen: false,
//   // proceed: null,
//   // cancel: null,
// }

const defaultContext = [{}, () => 0]

export const PromptContext = createContext(defaultContext)

const PromptContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [prompt, setPrompt] = useState({
    prompt: '',
    isOpen: false,
    proceed: null,
    cancel: null,
  })

  return <PromptContext.Provider value={[prompt, setPrompt]}>{children}</PromptContext.Provider>
}

// const ConfirmContextProvider = ({ children }:{children: React.ReactNode}) => {

//   const [confirm, setConfirm] = useState({
//     prompt: "",
//     isOpen: false,
//     proceed: null,
//     cancel: null
//   });

//   return (
//     <ConfirmContext.Provider value={[confirm, setConfirm]}
//       {children}
//     </ConfirmContext.Provider>
//  );
// }
export default PromptContextProvider
