import { PromptModal } from '@/hooks/useModals'
import * as S from './PromptModal.style'

// interface Props {
//   id: number
//   message: string
//   onClose: (id: number) => void
//   value: number
// }

type Props = PromptModal['props']

function ConfirmModal({ message, onClose, id, handleInputChange }: Props) {
  return (
    <S.Container>
      <S.Message>{message}</S.Message>
      <S.Input type="number" onChange={(e) => handleInputChange?.(e.target.value)} />
      <S.Button onClick={() => onClose?.(id)}>확인</S.Button>
    </S.Container>
  )
}

export default ConfirmModal
