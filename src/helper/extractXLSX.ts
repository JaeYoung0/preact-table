import * as XLSX from 'xlsx'

export default function extractXLSX(filename: string, rows: any[]) {
  filename = `${filename}.xlsx`
  const sheet_data = rows
  const ws = XLSX.utils.json_to_sheet(sheet_data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '실적데이터')
  XLSX.writeFile(wb, filename)
}
