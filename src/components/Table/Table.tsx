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
  console.log('## tableState', tableState)
  console.log('## Table rendering!')

  const { openModal } = useModals()
  const { rows, error, isLoading: isRowFetching, totalRows } = useMetrics()

  const { visibleOptions } = useOptions()
  const { mergedRows, handleMergedRows, filteredRows } = useMergedRows()
  // const [currentPage, setCurrentPage] = useState(0)

  const [current, setCurrent] = useState({
    page: 0,
    perPage: 10,
  })

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

  const loadSortedRows = useCallback(
    (rows: RowType[], sortModel?: GridSortModel) => {
      if (!sortModel || sortModel.length === 0) {
        return rows
      }

      console.log('## loadSortedRows')

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
    if (rows?.length === 0) return
    console.log('## rows updated! -> mergedRows를 다시 sorting 합니다.')

    setSortLoading(true)

    handleMergedRows(loadSortedRows([...mergedRows, ...rows], sortModel))
    setSortLoading(false)
  }, [rows])

  useEffect(() => {
    if (rows?.length === 0) return
    console.log('## sortModel updated! -> mergedRows를 다시 sorting 합니다. ')

    setSortLoading(true)

    handleMergedRows(loadSortedRows(mergedRows, sortModel))
    setSortLoading(false)
  }, [sortModel])

  useEffect(() => {
    if (!tableState) return

    // FIXME: per_page가 달라졌을 때만 reset
    // if (current.page === 0) {
    //   handleMergedRows([])
    // }
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
    const goToPage = (page: number) => {
      if (sortLoading || isRowFetching) return
      setCurrent({ ...current, page })
    }

    const handlePrevButtonClick = () => {
      if (sortLoading || isRowFetching) return
      if (current.page === 0) return

      setCurrent({ ...current, page: current.page - 1 })
    }

    const handleNextButtonClick = () => {
      if (sortLoading || isRowFetching) return
      if (current.page === Math.ceil(totalRows / current.perPage) - 1) return

      setCurrent({ ...current, page: current.page + 1 })
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
          <S.LastPageArrow onClick={() => goToPage(Math.ceil(totalRows / current.perPage) - 1)}>
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
              <span>Loading...</span>
            </S.RowsOverlay>
          ),
          NoResultsOverlay: () => (
            <S.RowsOverlay>
              <CircularProgress color="secondary" />
            </S.RowsOverlay>
          ),
          Pagination: () => renderPagination(),
          // Pagination: CustomPagination,
          // Footer: () => renderPagination(),
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
      />
    </S.Wrapper>
  )
}
