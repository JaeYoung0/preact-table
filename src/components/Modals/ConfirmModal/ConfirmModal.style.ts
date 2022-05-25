import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 999;
  transform: translate3d(-50%, -50%, 0);

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;

  width: 348px;
  height: 154px;

  padding: 42px 20px 28px;

  background: #ffffff;
  border-radius: 10px;
`

export const Message = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 135%;

  color: #505866;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`
export const ModalBasicButton = styled.button`
  width: 52px;
  height: 34px;
  border: none;

  background: #f2f4f6;
  border-radius: 4px;
`

export const CancelButton = styled(ModalBasicButton)`
  color: #d1d6da;
  justify-content: center;
  margin-left: 0;
  margin-right: 10px;
`
export const OkButton = styled(ModalBasicButton)`
  justify-content: center;
  margin-left: 0;
  background-color: #6713ef;
  color: #fff;
`
