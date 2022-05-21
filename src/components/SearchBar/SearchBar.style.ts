import { default as Estyled } from '@emotion/styled'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

export const Wrapper = Estyled.div`
  flex: 1;
`

export const OptionLi = Estyled.li`
  white-space: pre;
`

export const ClearIconWrapper = Estyled.span`
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
