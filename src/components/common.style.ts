import styled from '@emotion/styled'

export const BasicButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98px;
  height: 38px;
  padding: 8px 16px;

  border: 1px solid #6713ef;
  line-height: 135%;
  background: #fefefe;
  border-radius: 50px;
  cursor: pointer;

  font-size: 16px;

  color: #6713ef;

  &:hover {
    background: #6713ef;
    color: #fefefe;

    path {
      fill: #fefefe;
    }
  }
`
