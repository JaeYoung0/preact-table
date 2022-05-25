import useModals, { PromptModalType } from '@/hooks/useModals'
import * as S from './PromptModal.style'

type Props = PromptModalType['props']

function PromptModal({ message, onClose, resolve, inputType }: Props) {
  const { handlePromptValue, promptValue } = useModals()
  return (
    <S.Container>
      <S.Message>{message}</S.Message>
      <S.Body>
        <S.Input
          type={inputType}
          onChange={({ target: { value } }) => handlePromptValue?.(value)}
        />
        <S.Button
          onClick={() => {
            onClose?.()
            resolve?.(promptValue)
            handlePromptValue('')
          }}
        >
          확인
        </S.Button>
      </S.Body>
    </S.Container>
  )
}

export default PromptModal
