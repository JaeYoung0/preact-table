import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const Wrapper = styled.div`
  * {
    box-sizing: border-box;
  }
`

export const hideScroll = css`
  &::-webkit-scrollbar {
    display: none; /*  for Chrome, Safari, and Opera */
  }
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
`

export const customScroll = css`
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-track {
    background: #f2f4f6;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: #d2d6da;
    border-radius: 2px;
  }
`
