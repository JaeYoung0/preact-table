import { DataGrid } from "@mui/x-data-grid";
import MultiSelect from "@/components/MultiSelect";
import * as S from "./Table.style";
import * as XLSX from "xlsx";
import Download from "@/icons/Download";
import useOptions from "@/hooks/useOptions";
import useMetrics from "@/hooks/useMetrics";
import numberWithCommas from "@/helper/numberWithCommas";
import useCols from "@/hooks/useCols";

function exportFilteredData(filename: string, rows: any[]) {
  filename = `${filename}.xlsx`;
  const sheet_data = rows;
  const ws = XLSX.utils.json_to_sheet(sheet_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "실적데이터");
  XLSX.writeFile(wb, filename);
}

export default function MyDataGrid() {
  const { rows, error, isLoading } = useMetrics();

  const { visibleOptions } = useOptions();

  return (
    <S.Wrapper>
      <S.ButtonsWrapper>
        <S.ExcelDownloadButton onClick={() => exportFilteredData("test", rows)}>
          EXCEL
          <Download />
        </S.ExcelDownloadButton>
        <MultiSelect />
      </S.ButtonsWrapper>

      <DataGrid
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
              <p>데이터를 불러오는 중입니다...</p>
            </S.RowsOverlay>
          ),
        }}
        rows={rows}
        loading={isLoading}
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
      />
    </S.Wrapper>
  );
}
