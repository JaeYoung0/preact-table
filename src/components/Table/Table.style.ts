import styled from '@emotion/styled'
import { BasicButton } from '../common.style'
export const Wrapper = styled.div`
  width: 100%;
  height: 500px;
  .MuiDataGrid-columnHeaders {
    background: #636378;

    width: 100%;
    margin: 0 auto;
    display: flex;
  }

  .MuiDataGrid-columnHeader:focus-within {
    outline: none;
  }

  .MuiDataGrid-columnHeaderTitleContainer {
    margin: 0 auto;
  }

  .MuiDataGrid-columnHeaderTitle {
    color: #fff;
  }

  .MuiDataGrid-sortIcon {
    color: #fff;
  }
`

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`

export const ExcelDownloadButton = styled(BasicButton)`
  margin-right: 10px;
`

export const RowsOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 10;

  p {
    font-size: 16px;
  }
`
