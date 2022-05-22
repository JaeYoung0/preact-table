import { customScroll } from '@/app.style'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { BasicButton } from '../common.style'
export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  .MuiDataGrid-columnHeaders {
    background: #505866;

    width: 100%;
    margin: 0 auto;
    display: flex;
  }

  /* remove cell border in Data Grid component of MUI */
  .MuiDataGrid-root .MuiDataGrid-cell:focus-within {
    outline: none !important;
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

  .MuiDataGrid-cellContent {
    text-overflow: clip;
  }

  .MuiDataGrid-columnHeader--sorted {
    background: #353c49;
    border: none;
  }

  .MuiDataGrid-iconSeparator {
    transform: scale(0.6, 1.5);
  }

  .MuiDataGrid-footerContainer {
    display: flex;
    justify-content: center;
  }

  .MuiDataGrid-virtualScroller {
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: #f2f4f6;
      border-radius: 2px;
    }

    ::-webkit-scrollbar-thumb {
      background: #d2d6da;
      border-radius: 6px;
    }
  }
`

export const SettingsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export const BottomPagingText = styled.p`
  position: absolute;
  /* bottom: -35px; */
  left: 50%;
  /* bottom: 0px; */
  transform: translateX(-50%);

  font-weight: 600;
  font-size: 12px;
  line-height: 135%;

  letter-spacing: -0.0008em;
  text-align: center;
  white-space: pre;

  color: #353c49;

  margin: 0;
`

export const BottomArrows = styled.div`
  position: absolute;
  left: 50%;
  /* bottom: -35px; */
  /* bottom: 0px; */
  transform: translateX(-50%);

  display: flex;
  justify-content: center;
  width: 200px;
`

const ArrowBase = css`
  border: none;
  background: none;
  cursor: pointer;
`

export const FirstPageArrow = styled.button`
  ${ArrowBase}
  transform: rotate(180deg);
`

export const PrevArrow = styled.button`
  ${ArrowBase}
  transform: rotate(180deg);
  margin-right: 65px;
`

export const NextArrowWrapper = styled.button`
  ${ArrowBase}
`

export const LastPageArrow = styled.button`
  ${ArrowBase}
`

export const PageSizeArea = styled.div`
  position: absolute;
  right: 36px;

  span {
    display: inline-block;
    white-space: pre;
    font-weight: 400;
    font-size: 12px;
    color: #9198a0;
  }

  .MuiInputBase-root {
    padding: 0px 10px;
    cursor: pointer;
  }

  .MuiSelect-select {
    width: 20px;
    height: 20px;
    padding: 0 0 0 0 !important;
  }

  .MuiInputBase-input {
    color: #505866;
    font-weight: 600;
    font-size: 12px;
  }

  svg {
    transform: rotate(90deg);
    /* padding: 10px 10px 0 0 !important; */
  }
`
