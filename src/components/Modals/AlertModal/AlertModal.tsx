import * as S from './AlertModal.style'

interface Props {
  id: number
  message: string
  onClose: (id: number) => void
}

function Alert({ message, onClose, id }: Props) {
  return (
    <S.Container>
      <S.Message>{message}</S.Message>
      <S.Button onClick={() => onClose(id)}>확인</S.Button>
    </S.Container>
  )
}

export default Alert
