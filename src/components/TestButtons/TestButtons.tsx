function TestButtons() {
  return (
    <>
      <button
        onClick={() => {
          window.postMessage({
            key: 'cigro-table',
            payload: {
              env: 'dev',
              metrics_type: 'SALES_CHANNEL',
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
        SALES_CHANNEL
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
    </>
  )
}

export default TestButtons
