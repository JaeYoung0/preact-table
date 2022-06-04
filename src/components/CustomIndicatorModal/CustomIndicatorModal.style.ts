import { customScroll } from '@/app.style'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: #000000;
  opacity: 0.5;
`

export const Container = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  z-index: 800;
  visibility: hidden;

  ${({ visible }) =>
    visible &&
    css`
      visibility: visible;
    `}
`

export const ModalWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  padding: 40px 30px;
  z-index: 999;

  background: #fff;
  border-radius: 5px;
  width: 400px;
`

export const Title = styled.p`
  margin: 0 0 20px;

  font-weight: 600;
  font-size: 20px;
  line-height: 135%;

  color: #353c49;
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

  font-weight: 600;
`

export const CancelButton = styled(ModalBasicButton)`
  color: #d1d6da;
  justify-content: center;
  margin-left: 0;
  margin-right: 10px;
  font-weight: 600;
`
export const SubmitButton = styled(ModalBasicButton)`
  justify-content: center;
  margin-left: 0;
  background-color: #6713ef;
  color: #fff;
  font-weight: 600;
`

export const Row = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 20px;

  font-weight: 600;
  font-size: 16px;

  input[name='label'] {
    color: #d1d6da;
  }
  label {
    color: #d1d6da;
  }

  .MuiOutlinedInput-input {
    color: #d1d6da;
  }
`

export const CaculatorName = styled.span`
  color: #9198a0;
  font-weight: 400;
  font-size: 16px;
`

export const OriginalIndicatorName = styled.p`
  color: #9198a0;
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 12px;
`

export const CalculatorButtonsWrapper = styled.div``

export const Reset = styled.button`
  display: inline-block;
  align-items: center;
  padding: 5px 10px;
  margin-right: 10px;

  border: none;
  background: #f2f4f6;
  border-radius: 4px;

  font-weight: 400;
  font-size: 12px;
  line-height: 135%;

  letter-spacing: -0.0008em;

  color: #9198a0;

  cursor: pointer;

  svg {
    margin-right: 5px;
  }
`

export const Backspace = styled(Reset)`
  margin-right: 0px;
`

export const CalculatorWrapper = styled.div``

export const CalculatorHeader = styled.div`
  display: flex;
  justify-content: space-evenly;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30px;

    font-weight: 400;
    font-size: 12px;
    line-height: 135%;
    color: #9198a0;

    background: #f2f4f6;
    border: 1px solid #d2d6da;
    cursor: pointer;

    &:first-of-type {
      border-radius: 5px 0 0 0;
    }

    &:last-of-type {
      border-radius: 0 5px 0 0;
    }
  }
`

export const CalculatorBody = styled.div`
  display: flex;
  flex-wrap: wrap;

  border-radius: 0 0 5px 5px;
  min-height: 80px;
  padding: 20px;

  word-break: break-all;
  height: 100%;

  border: 1px solid #d2d6da;
  border-top: none;

  margin-bottom: 20px;
`

export const FormulaItem = styled.span`
  height: 100%;
  padding: 5px 10px;
  background: #f2f4f6;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
`

export const OriginalIndicators = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  padding: 10px 12px;
  margin-bottom: 30px;

  max-width: 340px;
  max-height: 185px;

  overflow-y: auto;
  border: 1px solid #d2d6da;
  border-radius: 4px;

  ${customScroll}

  span {
    max-width: 130px;
    overflow-x: hidden;
    text-overflow: ellipsis;

    position: relative;
    padding: 6px 0;

    cursor: pointer;
    padding-left: 10px;
    border-radius: 5px;

    font-weight: 400;
    font-size: 14px;
    color: #353c49;

    &:hover {
      background: #f2f4f6;
    }
  }
`
