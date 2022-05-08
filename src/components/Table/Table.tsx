import { DataGrid, GridColumns, GridSortModel } from '@mui/x-data-grid'
import MultiSelect from '@/components/MultiSelect'
import * as S from './Table.style'
import Download from '@/icons/Download'
import useOptions from '@/hooks/useOptions'
import useMetrics, { RowType } from '@/hooks/useMetrics'
import { useEffect, useMemo, useState } from 'preact/hooks'
import CircularProgress from '@mui/material/CircularProgress'
import extractXLSX from '@/helper/extractXLSX'
import SearchBar from '../SearchBar'
import renderCellExpand from '@/helper/renderCellExpand'
import useMergedRows from '@/hooks/useMergedRows'
import useBubbleIo from '@/hooks/useBubbleIo'

export default function Table() {
  const { tableState } = useBubbleIo()

  const { rows, error, isLoading: isRowFetching, data } = useMetrics()
  const { visibleOptions } = useOptions()
  const { mergedRows, handleMergedRows, filteredRows } = useMergedRows()
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)
  const [sortLoading, setSortLoading] = useState(false)

  console.log('## filteredRows', filteredRows)

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: rows?.[0]?.[0], sort: 'asc' },
  ])

  const handleSortModelChange = async (newModel: GridSortModel) => {
    setSortModel(newModel)
  }

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

  const loadSortedRows = (sortModel: GridSortModel, rows: RowType[]) => {
    if (sortModel.length === 0) {
      return rows
    }

    const sortedColumn = sortModel[0]

    let sortedRows = [...rows].sort((a, b) => {
      const aCell = a[sortedColumn.field]
      const bCell = b[sortedColumn.field]
      if (typeof aCell === 'number' && typeof bCell === 'number') {
        return (a[sortedColumn.field] as number) - (b[sortedColumn.field] as number)
      } else {
        return String(a[sortedColumn.field]).localeCompare(String(b[sortedColumn.field]))
      }
    })

    if (sortModel[0].sort === 'desc') {
      sortedRows = sortedRows.reverse()
    }

    return sortedRows
  }

  useEffect(() => {
    if (rows.length === 0) return
    console.log('## rows updated! -> mergedRows sorted & merged will also be changed')

    setSortLoading(true)

    handleMergedRows(loadSortedRows(sortModel, [...mergedRows, ...rows]))
    setSortLoading(false)
  }, [rows])

  useEffect(() => {
    if (rows.length === 0) return
    console.log('## sortModel updated! -> filteredRows sorted & mergedRows -> mergedRows updated')

    setSortLoading(true)

    handleMergedRows(loadSortedRows(sortModel, [...filteredRows, ...rows]))
    setSortLoading(false)
  }, [sortModel])

  useEffect(() => {
    const recallTargetPage = Math.floor(filteredRows.length / pageSize)
    console.log(
      '## recallTargetPage에 도달하였으므로 다음 page를 호출합니다',
      'recallTargetPage:',
      recallTargetPage
    )

    if (!tableState) return
    if (recallTargetPage - 1 <= page) {
      setSortLoading(true)

      window.postMessage({
        payload: {
          ...tableState,
          page: tableState.page + 1,
        },
      })
      setSortLoading(false)
    }
  }, [page])

  return (
    <S.Wrapper>
      <S.SettingsWrapper>
        <SearchBar />
        <div style={{ display: 'flex' }}>
          <S.ExcelDownloadButton onClick={() => extractXLSX('test', filteredRows)}>
            excel
            <Download />
          </S.ExcelDownloadButton>
          <MultiSelect />
        </div>
      </S.SettingsWrapper>

      <DataGrid
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        rowsPerPageOptions={[10, 20, 30]}
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
              <span>Loading...</span>
            </S.RowsOverlay>
          ),
          NoResultsOverlay: () => (
            <S.RowsOverlay>
              <CircularProgress color="secondary" />
            </S.RowsOverlay>
          ),
        }}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        loading={isRowFetching || sortLoading}
        rows={filteredRows}
        columns={cols}
        disableSelectionOnClick
        showCellRightBorder
        disableColumnMenu
        localeText={{ MuiTablePagination: { labelRowsPerPage: '페이지 당' } }}
      />
    </S.Wrapper>
  )
}
