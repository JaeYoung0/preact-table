import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 9999;
  transform: translate3d(-50%, -50%, 0);

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;

  width: 348px;
  height: 154px;

  padding: 42px 0 40px;

  background: #ffffff;
  border-radius: 10px;
`
export const Body = styled.div``

export const Message = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 135%;
  margin-bottom: 28px;

  color: #505866;
`

export const Input = styled.input`
  width: 180px;
  height: 31px;

  background: #f2f4f6;

  border: 1px solid #d1d6da;
  border-radius: 15.5px;
  margin-right: 8px;
  /* padding: 0 10px; */
  text-align: center;

  &:focus {
    border: none;
    outline: 1px solid #6713ef;
  }
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
