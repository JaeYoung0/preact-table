import Table from '@/components/Table'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { OptionsProvider } from '@/hooks/useOptions'
import { SWRConfig } from 'swr'
import { ModalProvider } from './hooks/useModals'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6713ef',
    },
    secondary: {
      main: '#505866',
    },
  },
})

/**
 * swr로 비동기 호출만 관리하고 local state는 context api로 관리한다.
 */
export function App() {
  return (
    <ThemeProvider theme={theme}>
      <OptionsProvider>
        <SWRConfig
          value={{
            dedupingInterval: 3000,
            errorRetryCount: 3,
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          }}
        >
          <ModalProvider>
            <Table />
          </ModalProvider>
        </SWRConfig>
      </OptionsProvider>
    </ThemeProvider>
  )
}
