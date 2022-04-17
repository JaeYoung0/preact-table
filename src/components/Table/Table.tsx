import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { rows as DATA_ROWS, columns as DATA_COLS } from "../../data";
import { useState, useEffect } from "preact/hooks";
import MultiSelect from "@/components/MultiSelect";
import * as S from "./Table.style";
import * as XLSX from "xlsx";
import Download from "@/icons/Download";
import useOptions from "@/hooks/useOptions";

const FIELD_NAMES = DATA_COLS.map((col) => col.field);

export default function MyDataGrid() {
  const [rows, setRows] = useState(DATA_ROWS);
  const [cols, setCols] = useState(DATA_COLS);

  const { visibleOptions } = useOptions();

  function exportFilteredData(filename: string, rows: any[]) {
    filename = `${filename}.xlsx`;
    const sheet_data = rows;
    const ws = XLSX.utils.json_to_sheet(sheet_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "실적데이터");
    XLSX.writeFile(wb, filename);
  }

  useEffect(() => {
    setCols(
      visibleOptions.map((fieldName) => ({
        field: fieldName,
        headerName: fieldName,
        width: 150,
        headerAlign: "center",
        align: "center",
      }))
    );
  }, [visibleOptions]);

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
        rows={rows}
        columns={cols}
        disableSelectionOnClick
        showCellRightBorder
        disableColumnMenu
      />
    </S.Wrapper>
  );
}
