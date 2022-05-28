import { customScroll, hideScroll } from './../../app.style'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { BasicButton } from '../common.style'
const CONTAINER_HEIGHT = 50

export const ConfigButton = styled(BasicButton)`
  color: #fff;
  background-color: #6713ef;
`

export const TransparentBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 100;
`

export const ConfigContainer = styled.div<{ opened: boolean }>`
  position: absolute;
  top: calc(${CONTAINER_HEIGHT}px + 5px);
  right: 0;

  min-width: 670px;
  max-height: 385px;
  overflow-y: scroll;
  ${hideScroll}

  padding: 20px;

  background: #fff;
  border: 1px solid #d1d6da;
  border-radius: 10px;
  z-index: 100;

  visibility: hidden;

  ${({ opened }) =>
    opened &&
    css`
      visibility: visible;
    `}
`

export const ConfigHeader = styled.div`
  margin-bottom: 12px;
`

export const Title = styled.p`
  margin: 0;

  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.0038em;

  color: #353c49;
`

export const ConfigBody = styled.div`
  display: flex;
`

export const BodyLeft = styled.div`
  flex: 1;
  margin-right: 25px;
`

export const BodyRight = styled.div`
  flex: 1;
`

export const Label = styled.label`
  margin-bottom: 5px;
`

const OptionsWrapper = styled.ul`
  position: relative;
  background: #fff;

  border: 1px solid #f5f6f7;

  padding: 16px 10px;
  border-radius: 5px;
  margin: 10px 0 15px;

  max-width: 290px;
  height: 216px;
  // auto: show scrollbar only when needed
  overflow-y: auto;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 8px 0;
    padding: 0px 10px;
    height: 25px;

    font-weight: 600;
    font-size: 12px;
    line-height: 135%;

    color: #505866;

    cursor: pointer;
  }

  li > span {
    display: flex;
    align-items: center;
  }

  li:last-of-type {
    margin: 0;
  }
  li:hover {
    background: #f2f4f6;
    border-radius: 4px;
  }

  ${customScroll}
`

export const SubTitle = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-weight: 600;

  font-size: 16px;
  height: 28px;

  color: #505866;
`

export const OpenModalButton = styled.button`
  width: 90px;
  height: 28px;

  background: #505866;
  border-radius: 4px;

  font-size: 12px;
  color: #fff;
`

export const VisibleOptionsWrapper = styled(OptionsWrapper)`
  svg:nth-of-type(1) {
    margin-right: 10px;
    visibility: hidden;
  }

  li:hover {
    svg:nth-of-type(1) {
      visibility: visible;
    }
  }
`

export const HiddenOptionsWrapper = styled(OptionsWrapper)``

export const CustomLabelsWrapper = styled.div`
  font-weight: 600;
  font-size: 12px;

  span:not(:last-of-type) {
    margin-right: 10px;
  }

  span:nth-of-type(1) {
    color: #6713ef;
  }

  span:nth-of-type(2),
  span:nth-of-type(3) {
    color: #d1d6da;
  }
`

export const ButtonsWrapper = styled.div`
  display: flex;
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
export const SubmitButton = styled(ModalBasicButton)`
  justify-content: center;
  margin-left: 0;
  background-color: #6713ef;
  color: #fff;
`
