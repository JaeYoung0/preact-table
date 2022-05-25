import useModals, { PromptModalType } from '@/hooks/useModals'
import * as S from './PromptModal.style'

type Props = PromptModalType['props']

function PromptModal({ message, onClose }: Props) {
  const { handlePromptValue } = useModals()
  return (
    <S.Container>
      <S.Message>{message}</S.Message>
      <S.Input type="number" onChange={({ target: { value } }) => handlePromptValue?.(value)} />
      <S.Button onClick={() => onClose?.()}>확인</S.Button>
    </S.Container>
  )
}

export default PromptModal
