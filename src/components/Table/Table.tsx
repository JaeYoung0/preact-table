import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { rows as DATA_ROWS, columns as DATA_COLS } from "../../data";
import { useState, useEffect } from "react";
import MultiSelect from "@/components/MultiSelect";
import * as S from "./Table.style";
import * as XLSX from "xlsx";
import Download from "@/icons/Download";

const FIELD_NAMES = DATA_COLS.map((col) => col.field);

export default function MyDataGrid() {
  const [rows, setRows] = useState(DATA_ROWS);
  const [cols, setCols] = useState(DATA_COLS);
  const [selectedOptions, setSelectedOptions] = useState(FIELD_NAMES);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedOptions(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

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
      selectedOptions.map((fieldName) => ({
        field: fieldName,
        headerName: fieldName,
        width: 150,
        headerAlign: "center",
        align: "center",
      }))
    );
  }, [selectedOptions]);

  return (
    <S.Wrapper>
      <S.ButtonsWrapper>
        <S.ExcelDownloadButton onClick={() => exportFilteredData("test", rows)}>
          EXCEL
          <Download />
        </S.ExcelDownloadButton>
        <MultiSelect
          options={FIELD_NAMES}
          selectedOptions={selectedOptions}
          // onChange={handleChange}
        />
      </S.ButtonsWrapper>

      <DataGrid
        rows={rows}
        columns={cols}
        // pageSize={10}
        // rowsPerPageOptions={[10, 15, 20]}
        // checkboxSelection
        disableSelectionOnClick
        // disableColumnSelector
        showCellRightBorder
        disableColumnMenu
        components={
          {
            // Toolbar: GridToolbar,
          }
        }
      />
    </S.Wrapper>
  );
}
