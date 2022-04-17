import { useState } from "preact/hooks";

import { GridColumns } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import Table from "./components/Table";

export function App() {
  return (
    <div>
      <Table />
    </div>
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
