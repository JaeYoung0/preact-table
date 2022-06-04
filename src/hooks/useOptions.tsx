import { createContext } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import React from 'react'
import { KeyedMutator } from 'swr'
import { columns as DATA_COLS } from '../data'
import useCols, { ColData } from './useCols'

type OptionsContextType = {
  visibleOptions: ColData[]
  hiddenOptions: ColData[]
  handleVisibileOptions: (newOptions: ColData[]) => void
  handleHiddenOptions: (newOptions: ColData[]) => void
  mutate: KeyedMutator<ColData[]>
}

const Options = createContext<OptionsContextType>({
  visibleOptions: [],
  hiddenOptions: [],
  handleVisibileOptions: () => 0,
  handleHiddenOptions: () => 0,
  mutate: () => new Promise(() => 0),
})

export function OptionsProvider({ children }: { children: React.ReactNode }) {
  const [visibleOptions, setVisibleOptions] = useState<ColData[]>([])
  const [hiddenOptions, setHiddenOptions] = useState<ColData[]>([])

  const handleVisibileOptions = (newOptions: ColData[]) => {
    setVisibleOptions(newOptions)
  }

  const handleHiddenOptions = (newOptions: ColData[]) => {
    setHiddenOptions(newOptions)
  }

  // visibleCols를 가공한 visibleOptions로 local state를 관리한다.
  const { visibleCols, hiddenCols, mutate, isLoading } = useCols()

  useEffect(() => {
    setVisibleOptions(visibleCols)
  }, [visibleCols, isLoading, visibleCols.length])

  useEffect(() => {
    setHiddenOptions(hiddenCols.sort((a, b) => b.type.localeCompare(a.type)))
  }, [hiddenCols, isLoading, hiddenCols.length])

  return (
    <Options.Provider
      value={{
        visibleOptions,
        hiddenOptions,
        handleVisibileOptions,
        handleHiddenOptions,
        mutate,
      }}
    >
      {children}
    </Options.Provider>
  )
}

function useOptions() {
  const options = useContext(Options)
  const { visibleOptions, hiddenOptions, handleVisibileOptions, handleHiddenOptions, mutate } =
    options
  return {
    visibleOptions,
    hiddenOptions,
    handleVisibileOptions,
    handleHiddenOptions,
    mutate,
  }
}

export default useOptions
