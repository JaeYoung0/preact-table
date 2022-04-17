import React from "react";
import styled from "@emotion/styled";

const BasicButton = styled.button`
  width: 115px;
  height: 35px;
  display: flex;
  justify-content: space-between;

  align-items: center;
  padding: 0px 20px;
  border: 2px solid #6713ef;
  margin-left: auto;
  line-height: 35px;

  cursor: pointer;

  font-size: 15px;
  color: #6713ef;
  border-radius: 50px;

  &:hover {
    background: #6713ef;
    color: #fefefe;

    path {
      fill: #fefefe;
    }
  }
`;
interface Props {
  children: any;
  icon?: any;
  onClick?: () => void;
}

function Button({ children, icon, onClick, ...props }: Props) {
  return (
    <BasicButton {...props} onClick={onClick}>
      <span>{children}</span>
      <div>{icon}</div>
    </BasicButton>
  );
}

export default Button;
