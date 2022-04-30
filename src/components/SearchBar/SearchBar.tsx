import React from 'react'
import Input from '@mui/material/Input'
import useCols, { ColData } from '@/hooks/useCols'
import useOptions from '@/hooks/useOptions'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'preact/hooks'
import SearchIcon from '@mui/icons-material/Search'
import * as S from './SearchBar.style'
import useMetrics from '@/hooks/useMetrics'
import Autocomplete from '@mui/material/Autocomplete'

const options = [
  { label: 'The Godfather', id: 1 },
  { label: 'Pulp Fiction', id: 2 },
]

function SearchBar() {
  const { visibleCols } = useCols()
  // console.log('@@visibleCols', )

  const [autocompleteLabels, setAutocompleteLabels] = useState<ColData[]>([])

  useEffect(() => {
    const textCols = visibleCols.filter((col) => col.display === 'TEXT')
    // .map((col) => ({
    //   id: col.id,
    //   label: col.label,
    //   searchValue: '',
    // }))

    console.log('@@textCols', textCols)

    setAutocompleteLabels(textCols)
  }, [visibleCols])

  console.log('@@autocompleteLabels', autocompleteLabels)

  const [searchValue, setSearchValue] = useState('')

  // console.log('@@labels', labels)

  // const { visibleOptions } = useOptions()

  const { rows, mutate } = useMetrics()
  console.log('@@searchValue', searchValue)
  console.log('@@rows', rows)
  console.log('@@autocompleteLabels', autocompleteLabels)

  // const [chips, setChips] = useState([])

  // console.log('@@visibleCols vs visibleOptions ', visibleCols, visibleOptions)

  const handleChange = (event: any) => {
    setSearchValue(event.target.value)
  }

  useEffect(() => {
    // if (!searchValue) setAutocompleteLabels([])
  }, [searchValue])

  return (
    <S.Wrapper>
      <Autocomplete
        inputValue={searchValue}
        // value={searchValue}
        // inputMode="text"
        // inputMode="search"

        onInputChange={(e, newValue, reason) => {
          console.log('@@newValue', newValue)

          setSearchValue(newValue)
          setAutocompleteLabels(
            autocompleteLabels.map((label) => ({ ...label, searchValue: newValue }))
          )
        }}
        onChange={(e, value) => {
          // FIXME: 여기서 mutate
          console.log('@@wow', e, value)
        }}
        // onChange={handleChange}

        multiple
        id="tags-outlined"
        options={autocompleteLabels}
        onOpen={(e) => console.log('@@onOpen', e)}
        getOptionLabel={(option) => {
          return `${option.label} 이름 포함 ${searchValue}`
        }}
        onSelect={(e) => console.log('@@onSelect', e)}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="검색"
            onChange={handleChange}
            // InputProps={{
            //   endAdornment: (
            //     <span
            //       onClick={() => {
            //         alert(searchValue)
            //         mutate(
            //           rows.filter((row) => row['브랜드'] === searchValue),
            //           false
            //         )
            //       }}
            //     >
            //       <SearchIcon />
            //     </span>
            //   ),
            // }}
          />
        )}
        sx={{ flex: 1, mr: 10 }}
      />
    </S.Wrapper>
    // <S.Wrapper>
    // <TextField
    //   id="table-search"
    //   name="search"
    //   value={searchValue}
    //   variant="outlined"
    //   onChange={handleChange}
    //   InputProps={{
    //     endAdornment: (
    //       <span
    //         onClick={() => {
    //           alert(searchValue)
    //           mutate(
    //             rows.filter((row) => row['브랜드'] === searchValue),
    //             false
    //           )
    //         }}
    //       >
    //         <SearchIcon />
    //       </span>
    //     ),
    //   }}
    //   sx={{ flex: 1, mr: 10 }}
    // />
    // </S.Wrapper>
  )
}

export default SearchBar
