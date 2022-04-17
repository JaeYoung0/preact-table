import { useState } from "preact/hooks";

import { GridColumns } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import Table from "./components/Table";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6713ef",
    },
    secondary: {
      main: "#636378",
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Table />
      </div>
    </ThemeProvider>
  );
}

// function uniqueID() {
// 	return Math.floor(Math.random() * Date.now())
// };
//  const wrapperId = `table-${uniqueID()}`
//  console.log('@@wrapperId',wrapperId)
//   const wrapper = document.createElement('div');
// wrapper.setAttribute('id',wrapperId);
//   instance.canvas.append(wrapper);
