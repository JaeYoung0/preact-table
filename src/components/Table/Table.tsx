import { DataGrid, GridColumns } from '@mui/x-data-grid'
import MultiSelect from '@/components/MultiSelect'
import * as S from './Table.style'
import Download from '@/icons/Download'
import useOptions from '@/hooks/useOptions'
import useMetrics from '@/hooks/useMetrics'
import { useMemo, useState } from 'preact/hooks'
import CircularProgress from '@mui/material/CircularProgress'
import extractXLSX from '@/helper/extractXLSX'
import SearchBar from '../SearchBar'
import renderCellExpand from '@/helper/renderCellExpand'

export default function MyDataGrid() {
  const { rows, error, isLoading } = useMetrics()
  const { visibleOptions } = useOptions()
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)

  const cols = useMemo<GridColumns>(
    () =>
      visibleOptions.map((col) => ({
        field: col.label,
        headerName: col.label,
        width: 150,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => renderCellExpand(params, col),
      })),
    visibleOptions
  )

  const reCallTargetPage = Math.floor(rows.length / pageSize)
  console.log('@@reCallTargetPage', reCallTargetPage, page)

  return (
    <S.Wrapper>
      <S.SettingsWrapper>
        <SearchBar />
        <div style={{ display: 'flex' }}>
          <S.ExcelDownloadButton onClick={() => extractXLSX('test', rows)}>
            EXCEL
            <Download />
          </S.ExcelDownloadButton>
          <MultiSelect />
        </div>
      </S.SettingsWrapper>

      <DataGrid
        // rowsPerPageOptions={[5, 10, 20]}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        rowsPerPageOptions={[10, 50, 100]}
        pagination
        components={{
          ErrorOverlay: () => (
            <S.RowsOverlay>
              <p>에러가 발생했습니다.</p>
            </S.RowsOverlay>
          ),
          NoRowsOverlay: () => (
            <S.RowsOverlay>
              {error?.message ? <p>{error?.message}</p> : <p>불러올 데이터가 없습니다.</p>}
            </S.RowsOverlay>
          ),
          LoadingOverlay: () => (
            <S.RowsOverlay>
              <CircularProgress color="secondary" />
            </S.RowsOverlay>
          ),
          NoResultsOverlay: () => (
            <S.RowsOverlay>
              <CircularProgress color="secondary" />
            </S.RowsOverlay>
          ),
        }}
        loading={isLoading}
        rows={rows}
        columns={cols}
        disableSelectionOnClick
        showCellRightBorder
        disableColumnMenu
        localeText={{ MuiTablePagination: { labelRowsPerPage: '페이지 당' } }}
      />
    </S.Wrapper>
  )
}
