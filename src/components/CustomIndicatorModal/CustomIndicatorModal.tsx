import * as S from './CustomIndicatorModal.style'
import { useEffect, useState } from 'preact/hooks'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import useCols from '@/hooks/useCols'
import {
  createCustomCol,
  createCustomColCommand,
  updateCustomCol,
  updateCustomColCommand,
} from '@/services/columns'
import useBubbleIo from '@/hooks/useBubbleIo'
import RemoveIcon from '@/icons/RemoveIcon'
import ResetIcon from '@/icons/ResetIcon'
import useModals from '@/hooks/useModals'
import { uniqueID } from '@/uniqueID'

export type IndicatorModalValue = {
  label: string
  description: string
  display: 'NUMBER' | 'WON' | 'PERCENT'
  formula: string[]
  id?: number | null
}

const displays = [
  {
    value: 'NUMBER',
    label: '숫자',
  },
  {
    value: 'WON',
    label: '통화(원)',
  },
  {
    value: 'PERCENT',
    label: '백분율',
  },
]

interface Props {
  visible: boolean
  close: () => void
  initialModalState: IndicatorModalValue
}

function CustomIndicatorModal({ visible, close, initialModalState }: Props) {
  const [modalState, setModalState] = useState<IndicatorModalValue>(() => initialModalState)

  const { tableState } = useBubbleIo()
  const { openModal, promptValue } = useModals()
  console.log('@@promptValue', promptValue)

  useEffect(() => {
    setModalState(initialModalState)
  }, [initialModalState])

  const { ingredientCols, mutate: mutateCols } = useCols()

  const handleChange = (event: any) => {
    setModalState({
      ...modalState,
      [event.target.name]: event.target.value,
    })
  }

  const handleReset = () => setModalState({ ...modalState, formula: [] })

  const handleBackspace = () =>
    setModalState({
      ...modalState,
      formula: [...modalState.formula.slice(0, modalState.formula.length - 1)],
    })

  const renderFormula = (item: string) => {
    if (item === '*') return <S.FormulaItem>x</S.FormulaItem>
    else if (item === '/') return <S.FormulaItem>&divide;</S.FormulaItem>
    else return <S.FormulaItem>{item}</S.FormulaItem>
  }

  const handleSave = async () => {
    if (modalState?.id) {
      const command: updateCustomColCommand = {
        type: 'CUSTOM',
        status: 'HIDDEN',
        label: modalState.label,
        display: modalState.display,
        description: modalState.description,
        formula: modalState.formula.join(' '),
        metrics_type: 'SALES',
        id: modalState?.id,
      }

      const res = await updateCustomCol(tableState?.user_id ?? '', command)
      if (res) {
        openModal({
          type: 'Alert',
          props: {
            id: uniqueID(),
            message: '지표를 수정했습니다.',
          },
        })
      }
    } else {
      const command: createCustomColCommand = {
        type: 'CUSTOM',
        status: 'HIDDEN',
        label: modalState.label,
        display: modalState.display,
        description: modalState.description,
        formula: modalState.formula.join(' '),
        metrics_type: 'SALES',
      }

      const res = await createCustomCol(tableState?.user_id ?? '', command)
      if (res) {
        openModal({
          type: 'Alert',
          props: {
            id: uniqueID(),
            message: '지표를 생성했습니다.',
          },
        })
      }
    }

    await mutateCols()
    close()
  }

  const handleCalculatorClick: React.MouseEventHandler = async (e) => {
    const value = (e.target as HTMLElement).dataset.value as string
    if (value === '숫자') {
      const result = await openModal({
        type: 'Prompt',
        props: {
          id: uniqueID(),
          message: '숫자를 입력해주세요.',
          inputType: 'number',
        },
      })

      if (!result) return

      setModalState({
        ...modalState,
        formula: [...modalState.formula, String(result)],
      })
    } else {
      setModalState({
        ...modalState,
        formula: [...modalState.formula, value],
      })
    }
  }

  return (
    <S.Container visible={visible}>
      <S.Backdrop onClick={close} />
      <S.ModalWrapper>
        <S.Title>맞춤 지표 만들기</S.Title>
        <S.Row>
          <TextField
            id="custom-label"
            name="label"
            label="이름"
            value={modalState.label}
            variant="outlined"
            onChange={handleChange}
            sx={{
              flex: 1,
            }}
          />

          <TextField
            id="custom-display"
            name="display"
            select
            label="형식"
            value={modalState.display}
            sx={{ m: 1, flex: 1 }}
            onChange={handleChange}
          >
            {displays.map((display) => (
              <MenuItem key={display.value} value={display.value}>
                {display.label}
              </MenuItem>
            ))}
          </TextField>
        </S.Row>
        <S.Row>
          <TextField
            id="custom-description"
            name="description"
            value={modalState.description}
            label="설명 - 선택사항"
            variant="outlined"
            sx={{ width: '100%' }}
            onChange={handleChange}
          />
        </S.Row>

        <S.Row style={{ justifyContent: 'space-between', marginBottom: '10px' }}>
          <S.CaculatorName>수식</S.CaculatorName>
          <S.CalculatorButtonsWrapper>
            <S.Reset type="button" onClick={handleReset}>
              <ResetIcon />
              리셋
            </S.Reset>
            <S.Backspace type="button" onClick={handleBackspace}>
              <RemoveIcon />
              지우기
            </S.Backspace>
          </S.CalculatorButtonsWrapper>
        </S.Row>
        <S.CalculatorHeader onClick={handleCalculatorClick}>
          <span data-value="+">+</span>
          <span data-value="-">-</span>
          <span data-value="*">x</span>
          <span data-value="/">&divide;</span>
          <span data-value="(">{`(`}</span>
          <span data-value=")">{`)`}</span>
          <span data-value="숫자">{`숫자`}</span>
        </S.CalculatorHeader>

        <S.CalculatorBody>{modalState.formula?.map(renderFormula)}</S.CalculatorBody>

        <S.OriginalIndicatorName>지표</S.OriginalIndicatorName>
        <S.OriginalIndicators>
          {ingredientCols.map((col) => (
            <span
              onClick={() => {
                setModalState({
                  ...modalState,
                  formula: [...modalState.formula, col.label],
                })
              }}
            >
              {col.label}
            </span>
          ))}
        </S.OriginalIndicators>

        <S.ButtonsWrapper>
          <S.CancelButton
            onClick={() => {
              close()
            }}
          >
            취소
          </S.CancelButton>
          <S.SubmitButton onClick={handleSave}>저장</S.SubmitButton>
        </S.ButtonsWrapper>
      </S.ModalWrapper>
    </S.Container>
  )
}

export default CustomIndicatorModal
