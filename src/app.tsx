import Table from '@/components/Table'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { OptionsProvider } from '@/hooks/useOptions'
import { MergedRowsProvider } from '@/hooks/useMergedRows'
import { SWRConfig } from 'swr'

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

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <MergedRowsProvider>
        <OptionsProvider>
          <SWRConfig value={swrConfig}>
            <Table />
          </SWRConfig>
        </OptionsProvider>
      </MergedRowsProvider>
    </ThemeProvider>
  )
}
