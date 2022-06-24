import React from 'react'
import useCols, { ColData } from '@/hooks/useCols'
import { useEffect, useState } from 'preact/hooks'
import * as S from './SearchBar.style'
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@/icons/SearchIcon'
import CloseIcon from '@/icons/CloseIcon'
import useTableState from '@/hooks/useTableState'
import useModals from '@/hooks/useModals'

type FilterOption = {
  id: number
  label: string
  value: string
}

function SearchBar() {
  const [autocompleteLabels, setAutocompleteLabels] = useState<ColData[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([])
  const { tableState } = useTableState()

  const { openModal } = useModals()

  const { visibleCols } = useCols()

  useEffect(() => {
    // visibleCols가 바뀔 때 마다 TEXT 타입 컬럼을 autocompleteLabels로 둔다.
    const textCols = visibleCols.filter((col) => col.display === 'TEXT')
    setAutocompleteLabels(textCols)
  }, [visibleCols])

  const handleInputChange = (inputValue: string) => setSearchValue(inputValue)

  const handleDeleteChip = (idx: number) => {
    setFilterOptions([...filterOptions.filter((_, filterIdx) => filterIdx !== idx)])

    window.postMessage({
      key: 'cigro-table',
      payload: {
        ...tableState,
        search_field: '',
        keyword: '',
      },
    })
  }

  const renderStartAdornment = () => {
    return filterOptions.map((item, idx) => (
      <Chip
        sx={{ mr: 0.5, background: '#F2F4F6', borderRadius: '15px', pr: 1, height: '26px' }}
        label={
          <>
            <span
              style={{
                fontSize: '12px',
                color: '#9198a0',
              }}
            >{`${item.label} 포함 `}</span>
            <span style={{ color: '#353C49', fontSize: '12px' }}>{item.value}</span>
          </>
        }
        deleteIcon={<CloseIcon width={8} height={8} color="#9198A0" />}
        onClick={() => handleDeleteChip(idx)}
        onDelete={() => handleDeleteChip(idx)}
      />
    ))
  }

  const removeAllFilters = () => {
    setFilterOptions([])
    window.postMessage({
      key: 'cigro-table',
      payload: {
        ...tableState,
        search_field: '',
        keyword: '',
      },
    })
  }

  const renderEndAdornment = () => {
    return filterOptions.length !== 0 ? (
      <S.ClearIconWrapper onClick={removeAllFilters}>
        <ClearIcon color="action" fontSize="small" />
      </S.ClearIconWrapper>
    ) : (
      <SearchIcon />
    )
  }

  const renderInput = (params: AutocompleteRenderInputParams) => {
    const { InputProps } = params
    const { startAdornment, ...rest } = InputProps
    return (
      <S.CssTextField
        {...params}
        multiline
        placeholder={filterOptions.length === 0 ? '원하는 조건을 입력해 필터링하세요.' : ''}
        onKeyDown={(e) => {
          e.stopPropagation()
        }}
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

    if (filterOptions.length >= 1)
      return openModal({
        type: 'Alert',
        props: {
          message: '필터링 가능한 컬럼은 하나만 선택할 수 있습니다.',
        },
      })

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
        // 조건 입력하고 enter하면 반영안됨 -> 키보드 이벤트 제거로 대응
        <S.OptionLi
          {...props}
          onClick={() => {
            if (!searchValue) return
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

  useEffect(() => {
    if (filterOptions.length === 0) return
    window.postMessage({
      key: 'cigro-table',
      payload: {
        ...tableState,
        search_field: filterOptions[0].label,
        keyword: filterOptions[0].value,
      },
    })
  }, [filterOptions])

  return (
    <S.Wrapper>
      <Autocomplete
        sx={{ flex: 1, mr: 10 }}
        id="table-autocomplete"
        multiple
        options={autocompleteLabels}
        renderInput={renderInput}
        inputValue={searchValue}
        onInputChange={(e, inputValue, reason) => {
          handleInputChange(inputValue)
        }}
        filterOptions={(options) => options}
        renderOption={(props, option, state) => {
          return renderOptions(props, option)
        }}
      />
    </S.Wrapper>
  )
}

export default SearchBar
