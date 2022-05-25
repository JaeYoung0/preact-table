import Table from '@/components/Table'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { OptionsProvider } from '@/hooks/useOptions'
import { MergedRowsProvider } from '@/hooks/useMergedRows'
import { SWRConfig } from 'swr'
import { ModalProvider } from './hooks/useModals'
import PromptContextProvider from './contexts/prompt'

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

const swrConfig = {
  dedupingInterval: 3000,
  errorRetryCount: 3,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}

/**
 * swr로 비동기 호출만 관리하고 local state는 context api로 관리한다.
 */
export function App() {
  return (
    <ThemeProvider theme={theme}>
      <MergedRowsProvider>
        <OptionsProvider>
          <SWRConfig value={swrConfig}>
            <PromptContextProvider>
              <ModalProvider>
                <Table />
              </ModalProvider>
            </PromptContextProvider>
          </SWRConfig>
        </OptionsProvider>
      </MergedRowsProvider>
    </ThemeProvider>
  )
}
