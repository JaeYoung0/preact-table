import * as S from './AlertModal.style'
import { AlertModalType } from '@/hooks/useModals'

type Props = AlertModalType['props']

function Alert({ message, onClose }: Props) {
  return (
    <S.Container>
      <S.Message>{message}</S.Message>
      <S.Button onClick={() => onClose?.()}>확인</S.Button>
    </S.Container>
  )
}

export default Alert
