import styled from "@emotion/styled";

export const BasicButton = styled.button`
  width: 115px;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  border: 2px solid #6713ef;
  line-height: 35px;
  background: #fefefe;

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
