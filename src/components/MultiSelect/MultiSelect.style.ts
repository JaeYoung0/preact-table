import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { BasicButton } from "../common.style";

export const ConfigButton = styled(BasicButton)`
  width: 95px;
`;

const CONTAINER_HEIGHT = 35;

const hideScroll = css`
  &::-webkit-scrollbar {
    display: none; /*  for Chrome, Safari, and Opera */
  }
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
`;

export const ConfigContainer = styled.div<{ opened: boolean }>`
  position: absolute;
  top: calc(${CONTAINER_HEIGHT}px + 5px);
  right: 0;

  min-width: 250px;
  max-height: 800px;
  overflow-y: scroll;
  ${hideScroll}

  padding: 20px;

  background: #fff;
  border: 1px solid #636378;
  border-radius: 5px;
  z-index: 100;

  visibility: hidden;

  ${({ opened }) =>
    opened &&
    css`
      visibility: visible;
    `}
`;

export const Label = styled.label`
  margin-bottom: 5px;
`;

const OptionsWrapper = styled.ul`
  position: relative;
  background: #fff;

  border: 1px solid #f5f6f7;

  padding: 0px;
  border-radius: 5px;
  margin: 5px 0;

  max-height: 200px;
  overflow-y: scroll;
  ${hideScroll}
`;

export const Title = styled.p`
  margin: 0;
  font-size: 16px;
  margin-bottom: 30px;
  font-weight: bold;
`;

export const SubTitle = styled(Title)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const OpenModalButton = styled.div``;

export const VisibleOptionsWrapper = styled(OptionsWrapper)`
  margin-bottom: 20px;

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 5px;

    cursor: pointer;
  }
  svg {
    font-size: 18px;
    color: #636378;
    &:hover {
      color: red;
    }
  }
`;

export const HiddenOptionsWrapper = styled(OptionsWrapper)`
  margin-bottom: 20px;

  li {
    position: relative;
    list-style: none;
    padding: 10px;
    cursor: pointer;

    &:hover {
      background: #f5f6f7;
    }

    &::after {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      content: "추가 +";
      font-size: 14px;
      font-weight: bold;
      color: #636378;
    }
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const CancelButton = styled(BasicButton)`
  justify-content: center;
  margin-right: 10px;
`;
export const SubmitButton = styled(BasicButton)`
  justify-content: center;
`;
