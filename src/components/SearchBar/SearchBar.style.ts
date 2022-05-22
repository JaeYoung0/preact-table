import { default as Estyled } from '@emotion/styled'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

export const Wrapper = Estyled.div`
  flex: 1;

  .MuiOutlinedInput-root{
    padding:0 15px 0 10px !important;
  }
`

export const OptionLi = Estyled.li`
  white-space: pre;
  font-weight: 400;
  font-size: 14px;
  line-height: 135%;
  letter-spacing: -0.0008em;
  color: #9198A0;

  b{
    font-weight: 400;
    font-size: 14px;
    line-height: 135%;
    color: #D1D6DA;
  }

`

export const ClearIconWrapper = Estyled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const CssTextField = styled(TextField)({
  '& textarea ': {
    fontSize: '14px',
  },

  '& .MuiOutlinedInput-root': {
    borderRadius: '18px',
    padding: '0 15px 0 20px !important',
    height: '38px',
  },

  // FIXME: placeholder color
})
