import { createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'
import React from 'react'
import { RowType } from './useMetrics'

type MergedRowsContextType = {
  mergedRows: RowType[]
  handleMergedRows: (newValue: RowType[]) => void
  filteredRows: RowType[]
  handleFilteredRows: (newValue: RowType[]) => void
}

/**
 * mergedRows: api call 시도할 때마다 쌓이는 rows를 sort하여 저장한다.
 * filteredRows: mergedRows를 searchBar에서 필터링하여 저장한다. 이 값이 Table에 주입된다.
 */
const MergedRows = createContext<MergedRowsContextType>({
  mergedRows: [],
  handleMergedRows: () => 0,
  filteredRows: [],
  handleFilteredRows: () => 0,
})

export function MergedRowsProvider({ children }: { children: React.ReactNode }) {
  const [mergedRows, setMergedRows] = useState<RowType[]>([])
  const handleMergedRows = (newValue: RowType[]) => setMergedRows(newValue)
  const [filteredRows, setFilteredRows] = useState<RowType[]>([])
  const handleFilteredRows = (newValue: RowType[]) => setFilteredRows(newValue)

  return (
    <MergedRows.Provider
      value={{
        mergedRows,
        handleMergedRows,
        filteredRows,
        handleFilteredRows,
      }}
    >
      {children}
    </MergedRows.Provider>
  )
}

function useMergedRows() {
  const context = useContext(MergedRows)

  return context
}

export default useMergedRows
