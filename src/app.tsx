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

            <button
              onClick={() => {
                window.postMessage({
                  key: 'cigro-table',
                  payload: {
                    env: 'dev',
                    metrics_type: 'CHANNEL',
                    user_id: '1651800183717x956761776063033100',
                    start: '2021-11-01',
                    end: '2021-11-30',
                    page: 0,
                    per_page: 10,
                    order_by_col_num: 1,
                    sort: 'ASC',
                    search_field: '',
                    keyword: '',
                    brand_name: '전체',
                    mustBeSavedVisibleOnServer: [{ label: '계정ID', visibleOnTable: false }],
                  },
                })
              }}
            >
              CHANNEL
            </button>
            <button
              onClick={() => {
                window.postMessage({
                  key: 'cigro-table',
                  payload: {
                    env: 'dev',
                    metrics_type: 'PRODUCT',
                    user_id: '1651800183717x956761776063033100',
                    start: '2021-11-01',
                    end: '2021-11-30',
                    page: 0,
                    per_page: 10,
                    order_by_col_num: 1,
                    sort: 'ASC',
                    search_field: '',
                    keyword: '',
                    brand_name: '전체',
                    mustBeSavedVisibleOnServer: [{ label: '계정ID', visibleOnTable: false }],
                  },
                })
              }}
            >
              PRODUCT
            </button>
            <button
              onClick={() => {
                window.postMessage({
                  key: 'cigro-table',
                  payload: {
                    env: 'dev',
                    metrics_type: 'OPTION',
                    user_id: '1651800183717x956761776063033100',
                    start: '2021-11-01',
                    end: '2021-11-30',
                    page: 0,
                    per_page: 10,
                    order_by_col_num: 1,
                    sort: 'ASC',
                    search_field: '',
                    keyword: '',
                    brand_name: '전체',
                    mustBeSavedVisibleOnServer: [{ label: '계정ID', visibleOnTable: false }],
                  },
                })
              }}
            >
              OPTION
            </button>
          </ModalProvider>
        </SWRConfig>
      </OptionsProvider>
    </ThemeProvider>
  )
}
