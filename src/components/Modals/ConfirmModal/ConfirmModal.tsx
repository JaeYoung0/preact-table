import * as S from './ConfirmModal.style'
import { ConfrimModalType } from '@/hooks/useModals'

type Props = ConfrimModalType['props']

function ConfirmModal({ message, onClose, onOk }: Props) {
  return (
    <S.Container>
      <S.Message>{message}</S.Message>

      <S.ButtonsWrapper>
        <S.CancelButton onClick={() => onClose?.()}>취소</S.CancelButton>
        <S.OkButton onClick={() => onOk?.()}>확인</S.OkButton>
      </S.ButtonsWrapper>
    </S.Container>
  )
}

export default ConfirmModal
