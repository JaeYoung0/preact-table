import { ColData } from '@/hooks/useCols'
import { Box, Popper, Typography, Paper } from '@mui/material'
import { useRef, useState, useEffect } from 'preact/hooks'
import numberWithCommas from '@/helper/numberWithCommas'

export function isOverflown(element: any) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
}

const GridCellExpand = function GridCellExpand(props: any) {
  const { width, value, displayType } = props
  const valueFormatter = (value: any) => {
    if (value === null || value === '') return '-'
    if (!value && value !== 0) return null

    if (displayType === 'PERCENT') {
      return `${Math.floor(value * 100 * 100) / 100}%`
    } else if (displayType === 'WON') {
      return `${numberWithCommas(Math.floor(value))}원`
    } else if (displayType === 'NUMBER') {
      return numberWithCommas(Math.floor(value))
    } else return value
  }

  const wrapper = useRef(null)
  const cellDiv = useRef(null)
  const cellRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [showFullCell, setShowFullCell] = useState(false)
  const [showPopper, setShowPopper] = useState(false)

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellRef.current)
    setShowPopper(isCurrentlyOverflown)
    setAnchorEl(cellDiv.current)
    setShowFullCell(true)
  }

  const handleMouseLeave = () => {
    setShowFullCell(false)
  }

  useEffect(() => {
    if (!showFullCell) {
      return undefined
    }

    function handleKeyDown(nativeEvent: any) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setShowFullCell, showFullCell])

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellRef}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {valueFormatter(value)}
      </Box>
      {showPopper && (
        <Popper
          style={{ zIndex: 500 }}
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
        >
          <Paper elevation={1}>
            <Typography variant="body2" style={{ padding: 8 }}>
              {valueFormatter(value)}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  )
}

function renderCellExpand(params: any, col: ColData) {
  return <GridCellExpand {...params} displayType={col.display} />
}

export default renderCellExpand
