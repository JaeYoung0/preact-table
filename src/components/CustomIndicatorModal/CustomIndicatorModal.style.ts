import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { BasicButton } from "../common.style";

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: #000000;
  opacity: 0.5;
`;

export const Container = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  z-index: 990;
  visibility: hidden;

  ${({ visible }) =>
    visible &&
    css`
      visibility: visible;
    `}
`;

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
`;

export const Title = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 20px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const CancelButton = styled(BasicButton)`
  justify-content: center;
`;
export const SubmitButton = styled(BasicButton)`
  justify-content: center;
`;

export const Row = styled.div`
  display: flex;
  /* justify-content: flex-start; */
  align-items: center;

  margin-bottom: 20px;
`;

export const CaculatorName = styled.span`
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 1.4375em;
`;

export const Reset = styled.span`
  cursor: pointer;
  border: 1px solid #cfcfcf;
  padding: 5px 10px;
  border-radius: 10px;
`;

export const CalculatorWrapper = styled.div``;

export const CalculatorHeader = styled.div`
  display: flex;
  justify-content: space-evenly;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30px;

    background: #f5f6f7;
    border: 1px solid #cfcfcf;
    cursor: pointer;

    &:first-of-type {
      border-radius: 5px 0 0 0;
    }

    &:last-of-type {
      border-radius: 0 5px 0 0;
    }
  }
`;

export const CalculatorBody = styled.div`
  border-radius: 0 0 5px 5px;
  min-height: 80px;
  padding: 20px;

  border: 1px solid #cfcfcf;
  border-top: none;

  margin-bottom: 20px;

  span {
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */

    /* line-height: 50px; */
  }
`;

export const FormulaItem = styled.span`
  padding: 5px 10px;
  background: #f5f6f7;
  border-radius: 5px;
  margin-right: 5px;
`;

export const OriginalIndicators = styled.div`
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(200px, 2fr));

  margin-bottom: 30px;

  span {
    position: relative;
    padding: 5px 0;
    cursor: pointer;
    padding-left: 25px;
    border-radius: 5px;
    margin-bottom: 5px;

    &:hover {
      background: #f5f6f7;
      &::before {
        content: "+";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 10px;
      }
    }
  }
`;
