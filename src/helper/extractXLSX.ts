import { RowType } from '@/hooks/useMetrics'
import * as XLSX from 'xlsx'

export default function extractXLSX(name: string, rows: RowType[]) {
  const filename = `${name}.xlsx`
  const sheetData = rows.map((row) => {
    if (row.id || row.id === 0) {
      delete row.id
    } else if (row.account_id || row.account_id === 0) {
      delete row.account_id
    }
    return row
  })

  const ws = XLSX.utils.json_to_sheet(sheetData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '실적데이터')
  XLSX.writeFile(wb, filename)
}
