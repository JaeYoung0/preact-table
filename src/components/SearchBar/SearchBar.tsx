import React from 'react'
import useCols, { ColData } from '@/hooks/useCols'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'preact/hooks'
import * as S from './SearchBar.style'
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import ClearIcon from '@mui/icons-material/Clear'
import useMergedRows from '@/hooks/useMergedRows'

type FilterOption = {
  id: number
  label: string
  value: string
}

function SearchBar() {
  const [autocompleteLabels, setAutocompleteLabels] = useState<ColData[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([])

  const { visibleCols } = useCols()

  const { mergedRows, handleFilteredRows } = useMergedRows()

  useEffect(() => {
    // visibleCols가 바뀔 때 마다 TEXT 타입 컬럼을 autocompleteLabels로 둔다.
    const textCols = visibleCols.filter((col) => col.display === 'TEXT')
    setAutocompleteLabels(textCols)
  }, [visibleCols])

  useEffect(() => {
    console.log('## 멀티 필터링', 'mergedRows:', mergedRows, 'filterOptions:', filterOptions)

    if (filterOptions.length === 0) handleFilteredRows(mergedRows)
    else {
      handleFilteredRows(
        mergedRows.filter((row) => {
          let result = true
          const regexList = filterOptions.map((option) => new RegExp(option.value))

          filterOptions.forEach((option) =>
            regexList.forEach((regex) =>
              regex.test(row[option.label]) ? (result = true) : (result = false)
            )
          )

          return result
        })
      )
    }
  }, [filterOptions, mergedRows])

  const handleInputChange = (inputValue: string) => setSearchValue(inputValue)

  const handleDeleteChip = (idx: number) => {
    setFilterOptions([...filterOptions.filter((_, filterIdx) => filterIdx !== idx)])
  }

  const renderStartAdornment = () => {
    return filterOptions.map((item, idx) => (
      <Chip
        sx={{ mr: 0.5 }}
        label={`${item.label} 포함 ${item.value}`}
        onDelete={(e) => handleDeleteChip(idx)}
      />
    ))
  }

  const renderEndAdornment = () => {
    return filterOptions.length !== 0 ? (
      <S.ClearIconWrapper onClick={() => setFilterOptions([])}>
        <ClearIcon color="action" fontSize="small" />
      </S.ClearIconWrapper>
    ) : null
  }

  const renderInput = (params: AutocompleteRenderInputParams) => {
    const { InputProps } = params
    const { startAdornment, ...rest } = InputProps
    return (
      <TextField
        {...params}
        label="검색"
        multiline
        InputProps={{
          ...rest,
          startAdornment: renderStartAdornment(),
          endAdornment: renderEndAdornment(),
        }}
      />
    )
  }

  const handleOptionClick = (option: ColData) => {
    const { id, label } = option
    setFilterOptions([
      ...filterOptions,
      {
        id,
        label,
        value: searchValue,
      },
    ])

    setSearchValue('')
  }

  const renderOptions = (props: React.HTMLAttributes<HTMLLIElement>, option: ColData) => {
    if (!searchValue)
      return (
        <S.OptionLi
          {...props}
          onClick={() => {
            if (!searchValue) return
            handleOptionClick(option)
          }}
        >
          {option.label} <b>조건을 입력해주세요.</b>
        </S.OptionLi>
      )
    return (
      <S.OptionLi {...props} onClick={() => handleOptionClick(option)}>
        {option.label} <b>포함 {searchValue}</b>
      </S.OptionLi>
    )
  }

  return (
    <S.Wrapper>
      <Autocomplete
        id="table-autocomplete"
        multiple
        options={autocompleteLabels}
        renderInput={renderInput}
        inputValue={searchValue}
        onInputChange={(e, inputValue, reason) => handleInputChange(inputValue)}
        // onChange={(e, value, reason) => {
        //   // FIXME: 여기서 mutate ?
        // }}
        filterOptions={(options) => options}
        renderOption={(props, option, state) => {
          return renderOptions(props, option)
        }}
        sx={{ flex: 1, mr: 10 }}
      />
    </S.Wrapper>
  )
}

export default SearchBar
