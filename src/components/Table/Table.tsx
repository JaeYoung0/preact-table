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
import useTableState from '@/hooks/useTableState'
import ArrowForwardIcon from '@/icons/ArrowForwardIcon'
import MenuItem from '@mui/material/MenuItem'
import useModals from '@/hooks/useModals'
import Select from '@mui/material/Select'
import { fetchMetrics } from '@/services/rows'

export default function Table() {
  const { tableState } = useTableState()
  // console.log('## tableState', tableState)
  console.log('## Table rendering!')

  const { rows, error, isLoading: isRowFetching, totalRows } = useMetrics()
  console.log('@@@@rows', rows)

  const { visibleOptions } = useOptions()
  console.log('@@@@visibleOptions', visibleOptions)

  const [current, setCurrent] = useState({
    page: 0,
    perPage: 10,
  })
  const { openModal } = useModals()

  const [sortModel, setSortModel] = useState<GridSortModel>()
  console.log('@@@@sortModel', sortModel)

  const handleSortModelChange = async (newModel: GridSortModel) => {
    console.log('@@@@newModel', newModel)

    setSortModel(newModel)
  }

  const handleExcelDownloadButtonClick = async () => {
    if (!tableState) return

    const name = await openModal({
      type: 'Prompt',
      props: {
        inputType: 'text',
        message: '파일명을 입력해주세요',
      },
    })

    // 현재 tableState기준 page 쿼리를 제거하여 전체 데이터를 다운받는다
    const { page, ...rest } = tableState

    const { report: rows } = await fetchMetrics({
      ...rest,
    })

    extractXLSX(name || 'untitled', rows)
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

    window.postMessage({
      payload: {
        ...tableState,
        page: current.page,
        per_page: current.perPage,
      },
      reset: false,
    })
  }, [current.perPage])

  useEffect(() => {
    if (!tableState || !sortModel || sortModel.length === 0) return

    console.log('## sortModel updated')

    const orderId = visibleOptions.find((option) => option.label === sortModel[0].field)?.order
    if (!orderId) return alert('새로고침 해주세요')

    window.postMessage({
      payload: {
        ...tableState,
        sort: sortModel[0].sort?.toUpperCase(),
        order_by_col_num: orderId,
      },
      reset: false,
    })
  }, [sortModel])

  const footerPageCountText = useMemo(
    () => `${current.page + 1}  /  ${Math.ceil(totalRows / current.perPage)}`,
    [totalRows, current]
  )

  // NOPE
  // if (rows.length === 0) return null

  const renderPagination = () => {
    const goToPage = (page: number) => {
      if (isRowFetching) return
      setCurrent({ ...current, page })
    }

    const handlePrevButtonClick = () => {
      if (isRowFetching) return
      if (current.page === 0) return

      setCurrent({ ...current, page: current.page - 1 })
    }

    const handleNextButtonClick = () => {
      if (isRowFetching) return
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
          <div>
            <S.FirstPageArrow onClick={() => goToPage(0)}>
              <ArrowForwardIcon />
              <ArrowForwardIcon style={{ transform: 'translate3d(-3px, 0, 0)' }} />
            </S.FirstPageArrow>
            <S.PrevArrow onClick={handlePrevButtonClick}>
              <ArrowForwardIcon />
            </S.PrevArrow>
          </div>

          <div>
            <S.NextArrowWrapper onClick={handleNextButtonClick}>
              <ArrowForwardIcon />
            </S.NextArrowWrapper>
            <S.LastPageArrow
              onClick={() => {
                // fetchAllRows()
                goToPage(Math.ceil(totalRows / current.perPage) - 1)
              }}
            >
              <ArrowForwardIcon />
              <ArrowForwardIcon style={{ transform: 'translate3d(-3px, 0, 0)' }} />
            </S.LastPageArrow>
          </div>
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
        page={0} // useMetrics에서 가져온 데이터를 그대로 보여준다
        onPageChange={(newPage) => {
          alert(newPage)
          setCurrent({ ...current, page: newPage })
        }}
        pageSize={current.perPage}
        rowsPerPageOptions={[10, 20, 30]}
        // pagination
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
        loading={isRowFetching}
        columns={cols}
        rows={rows}
        disableSelectionOnClick
        showCellRightBorder
        disableColumnMenu
      />
    </S.Wrapper>
  )
}
