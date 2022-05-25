import { DataGrid, GridColumns, GridSortModel, useGridApiContext } from '@mui/x-data-grid'
import MultiSelect from '@/components/MultiSelect'
import * as S from './Table.style'
import Download from '@/icons/Download'
import useOptions from '@/hooks/useOptions'
import useMetrics, { RowType } from '@/hooks/useMetrics'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import CircularProgress from '@mui/material/CircularProgress'
import extractXLSX from '@/helper/extractXLSX'
import SearchBar from '../SearchBar'
import renderCellExpand from '@/helper/renderCellExpand'
import useMergedRows from '@/hooks/useMergedRows'
import useBubbleIo from '@/hooks/useBubbleIo'
import ArrowForwardIcon from '@/icons/ArrowForwardIcon'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import useModals from '@/hooks/useModals'

export default function Table() {
  const { tableState } = useBubbleIo()

  const { openModal } = useModals()

  const { rows, error, isLoading: isRowFetching, totalPageCount } = useMetrics()

  const { visibleOptions } = useOptions()
  const { mergedRows, handleMergedRows, filteredRows } = useMergedRows()
  const [pageSize, setPageSize] = useState(10)

  const [currentPage, setCurrentPage] = useState(0)

  const [sortLoading, setSortLoading] = useState(false)
  const [sortModel, setSortModel] = useState<GridSortModel>()

  const recallTargetPage = Math.floor(filteredRows.length / pageSize)

  const handleSortModelChange = async (newModel: GridSortModel) => {
    setSortModel(newModel)
  }

  const handleExcelDownloadButtonClick = async () => {
    const name = await openModal({
      type: 'Prompt',
      props: {
        inputType: 'text',
        message: '파일명을 입력해주세요',
      },
    })

    console.log('@@name', name)

    extractXLSX(name || 'untitled', filteredRows)
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

  const loadSortedRows = useCallback(
    (rows: RowType[], sortModel?: GridSortModel) => {
      if (!sortModel || sortModel.length === 0) {
        return rows
      }

      const sortedColumn = sortModel[0]

      let sortedRows = [...rows]
        .sort((a, b) => {
          const aCell = a[sortedColumn.field]
          const bCell = b[sortedColumn.field]
          if (typeof aCell === 'number' && typeof bCell === 'number') {
            return (a[sortedColumn.field] as number) - (b[sortedColumn.field] as number)
          } else {
            return String(a[sortedColumn.field]).localeCompare(String(b[sortedColumn.field]))
          }
        })
        .map((item, index) => ({ ...item, id: index }))

      if (sortModel[0].sort === 'desc') {
        sortedRows = sortedRows.reverse()
      }

      return sortedRows
    },
    [rows, sortModel]
  )

  useEffect(() => {
    console.log('## mergedRows', mergedRows)
  }, [mergedRows])

  useEffect(() => {
    console.log('## filteredRows', filteredRows)
  }, [filteredRows])

  useEffect(() => {
    if (rows.length === 0) return
    console.log('## rows updated! -> mergedRows를 다시 sorting 합니다.')

    setSortLoading(true)

    handleMergedRows(loadSortedRows([...mergedRows, ...rows], sortModel))
    setSortLoading(false)
  }, [rows])

  useEffect(() => {
    if (rows.length === 0) return
    console.log('## sortModel updated! -> mergedRows를 다시 sorting 합니다. ')

    setSortLoading(true)

    handleMergedRows(loadSortedRows(mergedRows, sortModel))
    setSortLoading(false)
  }, [sortModel])

  useEffect(() => {
    console.log('@@recallTargetPage:', recallTargetPage, 'currentPage:', currentPage)

    if (!tableState) return
    if (recallTargetPage === 0) return
    if (recallTargetPage - 1 <= currentPage) {
      setSortLoading(true)

      console.log(
        '@@recallTargetPage에 도달하였으므로 다음 page를 호출합니다',
        'recallTargetPage:',
        recallTargetPage
      )

      window.postMessage({
        payload: {
          ...tableState,
          page: tableState.page + 1,
        },
        reset: false,
      })

      setSortLoading(false)
    }
  }, [currentPage, totalPageCount])

  console.log('@@plz', currentPage, totalPageCount, pageSize)

  // NO
  // if (rows.length === 0) return null

  const getRowCount = useCallback(() => totalPageCount * pageSize, [totalPageCount, pageSize])

  const renderPagination = () => {
    const apiRef = useGridApiContext()
    // const page = useGridSelector(apiRef, gridPageSelector)
    // const pageCount = useGridSelector(apiRef, gridPageCountSelector)

    const goToPage = (page: number) => {
      apiRef.current.setPage(page)
      // setCurrentPage(page)
    }

    const handlePrevButtonClick = () => {
      if (currentPage === 0) return
      apiRef.current.setPage(currentPage - 1)
      // setCurrentPage(currentPage - 1)
    }

    const handleNextButtonClick = () => {
      apiRef.current.setPage(currentPage + 1)
      // setCurrentPage(currentPage + 1)
    }

    const displays = [
      {
        value: 10,
        label: 10,
      },
      {
        value: 20,
        label: 20,
      },
      {
        value: 30,
        label: 30,
      },
    ]

    return (
      <>
        <S.BottomPagingText>{`${currentPage + 1}  /  ${recallTargetPage}`}</S.BottomPagingText>
        <S.BottomArrows onClick={() => goToPage(0)}>
          <S.FirstPageArrow>
            <ArrowForwardIcon />
            <ArrowForwardIcon />
          </S.FirstPageArrow>
          <S.PrevArrow onClick={handlePrevButtonClick}>
            <ArrowForwardIcon />
          </S.PrevArrow>
          <S.NextArrowWrapper onClick={handleNextButtonClick}>
            <ArrowForwardIcon />
          </S.NextArrowWrapper>
          <S.LastPageArrow onClick={() => goToPage(totalPageCount)}>
            <ArrowForwardIcon />
            <ArrowForwardIcon />
          </S.LastPageArrow>
        </S.BottomArrows>

        {/* FIXME: svg 클릭하면 반응이 없다. TextField 말고 Select로 바꿔야할듯?.. */}
        <S.PageSizeArea>
          <span>{`페이지 당  `}</span>
          <TextField
            select
            value={pageSize}
            onChange={(event) => {
              const newPageSize = Number(event.target.value)
              apiRef.current.setPageSize(newPageSize)
              setPageSize(newPageSize)
            }}
            SelectProps={{
              IconComponent: () => <ArrowForwardIcon />,
            }}
          >
            {displays.map((display) => (
              <MenuItem key={display.value} value={display.value}>
                {display.label}
              </MenuItem>
            ))}
          </TextField>
          <span>{`  개 표시`}</span>
        </S.PageSizeArea>
      </>
    )
  }

  return (
    <S.Wrapper>
      <S.SettingsWrapper>
        <SearchBar />
        <div style={{ display: 'flex' }}>
          <S.ExcelDownloadButton onClick={handleExcelDownloadButtonClick}>
            excel
            <Download />
          </S.ExcelDownloadButton>
          <MultiSelect />
        </div>
      </S.SettingsWrapper>

      <DataGrid
        page={currentPage}
        onPageChange={(newPage) => {
          console.log('@@newPage', newPage)
          setCurrentPage(newPage)
        }}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        rowsPerPageOptions={[10, 20, 30]}
        pagination
        rowCount={getRowCount()}
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
          Pagination: () => renderPagination(),
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
        paginationMode="server"
      />
    </S.Wrapper>
  )
}
