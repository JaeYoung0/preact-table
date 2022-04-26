import { DataGrid } from "@mui/x-data-grid";
import MultiSelect from "@/components/MultiSelect";
import * as S from "./Table.style";
import Download from "@/icons/Download";
import useOptions from "@/hooks/useOptions";
import useMetrics from "@/hooks/useMetrics";
import numberWithCommas from "@/helper/numberWithCommas";
import { useEffect, useState } from "preact/hooks";
import CircularProgress from "@mui/material/CircularProgress";
import extractXLSX from "@/helper/extractXLSX";

export default function MyDataGrid() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    setRowCount(pageSize * (page + 2));
  }, [pageSize, page]);

  const { rows, error, isLoading } = useMetrics({
    pageSize,
    page,
  });

  const { visibleOptions } = useOptions();

  return (
    <S.Wrapper>
      <S.ButtonsWrapper>
        <S.ExcelDownloadButton onClick={() => extractXLSX("test", rows)}>
          EXCEL
          <Download />
        </S.ExcelDownloadButton>
        <MultiSelect
          pageState={{
            page,
            pageSize,
            rowCount,
          }}
        />
      </S.ButtonsWrapper>

      <DataGrid
        paginationMode="server"
        pageSize={pageSize}
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        rowsPerPageOptions={[5, 10, 20]}
        page={page}
        pagination
        onPageChange={(newPage) => setPage(newPage)}
        rowCount={rowCount ?? 100}
        components={{
          // FIXME: Loading Indicator
          ErrorOverlay: () => (
            <S.RowsOverlay>
              <p>에러가 발생했습니다.</p>
            </S.RowsOverlay>
          ),
          NoRowsOverlay: () => (
            <S.RowsOverlay>
              {error?.message ? (
                <p>{error?.message}</p>
              ) : (
                <p>불러올 데이터가 없습니다.</p>
              )}
            </S.RowsOverlay>
          ),
          LoadingOverlay: () => (
            <S.RowsOverlay>
              <CircularProgress color="secondary" />
            </S.RowsOverlay>
          ),
        }}
        loading={isLoading}
        rows={rows}
        columns={visibleOptions.map((col) => ({
          field: col.label,
          headerName: col.label,
          width: 150,
          headerAlign: "center",
          align: "center",
          valueFormatter: (params) => {
            return typeof params.value === "number"
              ? numberWithCommas(Math.floor(params.value))
              : params.value;
          },
        }))}
        disableSelectionOnClick
        showCellRightBorder
        disableColumnMenu
        localeText={{ MuiTablePagination: { labelRowsPerPage: "페이지 당" } }}
      />
    </S.Wrapper>
  );
}
