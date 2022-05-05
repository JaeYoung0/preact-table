import { createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'
import React from 'react'
import { RowType } from './useMetrics'

type MergedRowsContextType = {
  mergedRows: RowType[]
  handleMergedRows: (newValue: RowType[]) => void
}

const MergedRows = createContext<MergedRowsContextType>({
  mergedRows: [],
  handleMergedRows: () => 0,
})

export function MergedRowsProvider({ children }: { children: React.ReactNode }) {
  const [mergedRows, setMergedRows] = useState<RowType[]>([])
  const handleMergedRows = (newValue: RowType[]) => setMergedRows(newValue)

  return (
    <MergedRows.Provider
      value={{
        mergedRows,
        handleMergedRows,
      }}
    >
      {children}
    </MergedRows.Provider>
  )
}

function useMergedRows() {
  const context = useContext(MergedRows)

  const { mergedRows, handleMergedRows } = context
  return {
    mergedRows,
    handleMergedRows,
  }
}

export default useMergedRows
