import { DataGrid, GridColumns, GridSortModel } from '@mui/x-data-grid'
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
import MenuItem from '@mui/material/MenuItem'
import useModals from '@/hooks/useModals'
import Select from '@mui/material/Select'

export default function Table() {
  const { tableState } = useBubbleIo()
  // console.log('## tableState', tableState)
  console.log('## Table rendering!')

  const { openModal } = useModals()
  const {
    rows,
    error,
    isLoading: isRowFetching,
    totalRows,
    shouldMergeRows,
    fetchAllRows,
    handleRowFetchKeys,
  } = useMetrics()

  const { visibleOptions } = useOptions()

  const { mergedRows, handleMergedRows, filteredRows } = useMergedRows()
  const [currentPage, setCurrentPage] = useState(0)

  // const [currentPage, setCurrentPage] = useState(0)

  const [current, setCurrent] = useState({
    page: 0,
    perPage: 10,
  })
  console.log('@@shouldMergeRows', shouldMergeRows, mergedRows, current)
  console.log('!!rows', rows)

  const [sortLoading, setSortLoading] = useState(false)
  const [sortModel, setSortModel] = useState<GridSortModel>()

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

  const addRowIds = (rows: RowType[]) => {
    // add ids for MUI DataGrid
    return rows.map((item, index) => ({ ...item, id: index }))
  }

  const loadSortedRows = useCallback(
    (rows: RowType[], sortModel?: GridSortModel) => {
      if (!sortModel || sortModel.length === 0) {
        return addRowIds(rows)
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
    [isRowFetching, sortModel]
  )

  useEffect(() => {
    console.log('## mergedRows', mergedRows)
  }, [mergedRows])

  useEffect(() => {
    console.log('## filteredRows', filteredRows)
  }, [filteredRows])

  useEffect(() => {
    // console.log('@@rowFetchKey', rowFetchKey)

    if (rows?.length === 0) return
    setSortLoading(true)
    // if( cahce에 없었던 key냐?)
    if (shouldMergeRows) {
      // alert(`isRowFetching:${isRowFetching}`)
      // alert('merge!')

      handleMergedRows(loadSortedRows(rows, sortModel))
    }

    // if (!isRowFetching) return
    // page 변경 -> rows 새로 들어옴 -> mergedRows에 합칠 때 미리 소팅한 결과를 합치기
    console.log('## rows updated! -> mergedRows를 다시 sorting 합니다.')

    setSortLoading(false)
  }, [isRowFetching, shouldMergeRows])

  useEffect(() => {
    if (rows?.length === 0) return
    console.log('## sortModel updated! -> mergedRows를 다시 sorting 합니다. ')

    setSortLoading(true)

    handleMergedRows(loadSortedRows(rows, sortModel))
    setSortLoading(false)
  }, [sortModel])

  useEffect(() => {
    if (!tableState) return

    console.log('## current page updated')

    window.postMessage({
      payload: {
        ...tableState,
        page: current.page,
        per_page: current.perPage,
      },
      reset: false,
    })
  }, [current.page])

  useEffect(() => {
    if (!tableState) return

    console.log('## current per_page updated')

    handleRowFetchKeys([])
    handleMergedRows([])

    window.postMessage({
      payload: {
        ...tableState,
        page: current.page,
        per_page: current.perPage,
      },
      reset: false,
    })
  }, [current.perPage])

  const footerPageCountText = useMemo(
    () => `${current.page + 1}  /  ${Math.ceil(totalRows / current.perPage)}`,
    [totalRows, current]
  )

  // NOPE
  // if (rows.length === 0) return null

  const renderPagination = () => {
    // const apiRef = useGridApiContext()
    // const page = useGridSelector(apiRef, gridPageSelector)
    // const pageCount = useGridSelector(apiRef, gridPageCountSelector)

    const goToPage = (page: number) => {
      if (sortLoading || isRowFetching) return
      setCurrent({ ...current, page })
    }

    const handlePrevButtonClick = () => {
      if (sortLoading || isRowFetching) return
      if (current.page === 0) return

      setCurrent({ ...current, page: current.page - 1 })
      // apiRef.current.setPage(current.page - 1)
    }

    const handleNextButtonClick = () => {
      if (sortLoading || isRowFetching) return
      if (current.page === Math.ceil(totalRows / current.perPage) - 1) return

      setCurrent({ ...current, page: current.page + 1 })
      // apiRef.current.setPage(current.page + 1)
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
        <S.BottomPagingText>{footerPageCountText}</S.BottomPagingText>
        <S.BottomArrows>
          <S.FirstPageArrow onClick={() => goToPage(0)}>
            <ArrowForwardIcon />
            <ArrowForwardIcon style={{ transform: 'translate3d(-3px, 0, 0)' }} />
          </S.FirstPageArrow>
          <S.PrevArrow onClick={handlePrevButtonClick}>
            <ArrowForwardIcon />
          </S.PrevArrow>
          <S.NextArrowWrapper onClick={handleNextButtonClick}>
            <ArrowForwardIcon />
          </S.NextArrowWrapper>
          <S.LastPageArrow
            onClick={() => {
              fetchAllRows()
              goToPage(Math.ceil(totalRows / current.perPage) - 1)
            }}
          >
            <ArrowForwardIcon />
            <ArrowForwardIcon style={{ transform: 'translate3d(-3px, 0, 0)' }} />
          </S.LastPageArrow>
        </S.BottomArrows>

        <S.PageSizeArea>
          <span>{`페이지 당  `}</span>
          <Select
            labelId="page-select-label"
            id="page-select"
            value={current.perPage}
            onChange={(event) => {
              const newPageSize = Number(event.target.value)
              setCurrent({ ...current, perPage: newPageSize, page: 0 })
            }}
            IconComponent={() => <ArrowForwardIcon />}
          >
            {displays.map((display) => (
              <MenuItem key={display.value} value={display.value}>
                {display.label}
              </MenuItem>
            ))}
          </Select>

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
        page={current.page}
        onPageChange={(newPage) => {
          alert(newPage)
          setCurrent({ ...current, page: newPage })
        }}
        pageSize={current.perPage}
        rowsPerPageOptions={[10, 20, 30]}
        pagination
        rowCount={totalRows}
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
              {/* <span>Loading...</span> */}
              <CircularProgress color="secondary" />
            </S.RowsOverlay>
          ),
          NoResultsOverlay: () => (
            <S.RowsOverlay>
              <p>필터링 조건을 확인해주세요.</p>
            </S.RowsOverlay>
          ),
          Pagination: () => renderPagination(),
        }}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        loading={isRowFetching || sortLoading}
        columns={cols}
        rows={filteredRows}
        disableSelectionOnClick
        showCellRightBorder
        disableColumnMenu
      />
    </S.Wrapper>
  )
}
