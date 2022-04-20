import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { rows as DATA_ROWS, columns as DATA_COLS } from "../../data";
import { useState, useEffect } from "preact/hooks";
import MultiSelect from "@/components/MultiSelect";
import * as S from "./Table.style";
import * as XLSX from "xlsx";
import Download from "@/icons/Download";
import useOptions from "@/hooks/useOptions";
import { GridColumns } from "@mui/x-data-grid";
import useMetrics from "@/hooks/useMetrics";

function exportFilteredData(filename: string, rows: any[]) {
  filename = `${filename}.xlsx`;
  const sheet_data = rows;
  const ws = XLSX.utils.json_to_sheet(sheet_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "실적데이터");
  XLSX.writeFile(wb, filename);
}

export default function MyDataGrid() {
  const { cols, rows } = useMetrics();

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
          NoRowsOverlay: () => (
            <S.NoRowsOverlay>
              <p>데이터를 불러오는 중입니다...</p>
            </S.NoRowsOverlay>
          ),
        }}
        rows={rows}
        // FIXME: 이러면 useMetrics에서 cols를 구할 필요가 없다..
        columns={visibleOptions.map((col) => ({
          field: col.label,
          headerName: col.label,
          width: 150,
          headerAlign: "center",
          align: "center",
        }))}
        disableSelectionOnClick
        showCellRightBorder
        disableColumnMenu
      />
    </S.Wrapper>
  );
}
