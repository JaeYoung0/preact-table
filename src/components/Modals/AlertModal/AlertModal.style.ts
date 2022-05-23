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

  padding: 42px 0 28px;

  background: #ffffff;
  border-radius: 10px;
`

export const Message = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 135%;

  color: #505866;
`

export const Button = styled.button`
  width: 57px;
  height: 31px;

  background: #6713ef;
  border: 1px solid #6713ef;
  border-radius: 18px;

  cursor: pointer;

  color: #fff;
`
