import ConfigIcon from '@/icons/Config'
import * as S from './MultiSelect.style'
import { useState } from 'preact/hooks'
import CustomIndicatorModal from '../CustomIndicatorModal'
import useOptions from '@/hooks/useOptions'
import useCols, { CustomColType } from '@/hooks/useCols'
import { IndicatorModalValue } from '../CustomIndicatorModal'
import { deleteCustomCol, updateCols, updateColsCommand } from '@/services/columns'
import useMetrics from '@/hooks/useMetrics'
import useBubbleIo from '@/hooks/useBubbleIo'
import useMergedRows from '@/hooks/useMergedRows'
import CloseIcon from '@/icons/CloseIcon'
import HoverDotsIcon from '@/icons/HoverDotsIcon'
import PlusIcon from '@/icons/PlusIcon'
import useModals from '@/hooks/useModals'
import { uniqueID } from '@/uniqueID'

const initialValues: IndicatorModalValue = {
  label: '',
  description: '',
  display: 'NUMBER',
  formula: [],
  id: null,
}

const splitRegex = /[\+\-\*\/\(\)]/g

const parseFormula = (formula: string[]) => {
  if (formula.length === 0) return []

  return formula?.[0]
    ?.replace(/\s/g, '')
    .replace(splitRegex, (matched) => `#${matched}#`)
    .split('#')
}

export default function MultiSelect() {
  const [opened, setOpened] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const [initialModalState, setInitialModalState] = useState<IndicatorModalValue>(initialValues)

  const { visibleOptions, handleVisibileOptions, handleHiddenOptions, hiddenOptions } = useOptions()

  const { tableState } = useBubbleIo()
  console.log('@@tableState', tableState)

  const { openModal: openCustomModal } = useModals()

  const { mutate: mutateCols } = useCols()
  const { mutate: mutateRows } = useMetrics()
  const { handleMergedRows } = useMergedRows()

  const openModal = (payload: IndicatorModalValue) => {
    setInitialModalState({
      ...payload,
      formula: parseFormula(payload.formula),
    })
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const toggleSettings = () => setOpened(!opened)
  const closeSettings = () => setOpened(false)

  const handleDragStart = (idx: number) => {
    setDraggingIdx(idx)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    ;(e.target as HTMLLIElement).style.borderBottom = '2px solid #6713ef'
  }

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault()
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    ;(e.target as HTMLLIElement).style.borderBottom = 'initial'
  }

  const handleDragDrop = (e: React.DragEvent<HTMLLIElement>, targetIdx: number) => {
    ;(e.target as HTMLLIElement).style.borderBottom = 'initial'

    if (draggingIdx === null) return

    const newList = [...visibleOptions]
    const draggingItem = newList[draggingIdx]

    // draggingItem 삭제하기
    newList.splice(draggingIdx, 1)

    // draggingItem 옮기기
    newList.splice(targetIdx > draggingIdx ? targetIdx : targetIdx + 1, 0, draggingItem)

    handleVisibileOptions(newList)
  }

  const handleCustomListClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    option: CustomColType
  ) => {
    e.stopPropagation()
    const { label, description, display, formula, id } = option

    openModal({
      label,
      description,
      display,
      formula: [formula],
      id,
    })
  }

  const handleSave = async () => {
    const visibleOptionsPayload = visibleOptions.map((option, idx) => ({
      type: option.type,
      status: 'VISIBLE',
      order: idx + 1,
      id: option.id,
    }))

    const hiddenOptionsPayload = hiddenOptions.map((option) => ({
      type: option.type,
      status: 'HIDDEN',
      order: null,
      id: option.id,
    }))

    const isClearGroupByTarget =
      visibleOptions.filter((option) => {
        const groupByTarget = option.type === 'ORIGINAL' && option.display === 'TEXT'
        return groupByTarget
      }).length === 0

    if (isClearGroupByTarget) {
      return openCustomModal({
        type: 'Alert',
        props: {
          id: uniqueID(),
          message: '정렬 기준이 되는 열을 선택해주세요.',
        },
      })
    }

    const command: updateColsCommand = [...visibleOptionsPayload, ...hiddenOptionsPayload]

    closeSettings()

    openCustomModal({
      type: 'Alert',
      props: {
        id: uniqueID(),
        message: '열 설정이 저장되었습니다.',
      },
    })

    mutateCols([...visibleOptions, ...hiddenOptions], false)

    await updateCols(tableState?.user_id ?? '', command)

    // updateCols 200응답받고 바로 mutate하면 이전값으로 업데이트 되어버릴 때가 있다.
    // -> DB 업데이트가 느려서 그런가?! -> 어쩔 수 없이 setTimeout으로 처리 ...
    setTimeout(() => {
      // FIXME: 새롭게 hidden -> visible로 바뀐 col이 1개 이상 존재할 때만 mutate하기
      console.log(
        '## 열 설정이 변경되었습니다. mergedRows를 초기화하고, 변경된 cols에 따라 rows를 다시 호출합니다.'
      )

      handleMergedRows([])
      mutateRows()
    }, 100)
  }

  const handleCustomColDelete = async (id: number) => {
    // const isConfirmed = confirm('삭제하시겠습니까?')

    const isConfirmed = await openCustomModal({
      type: 'Confirm',
      props: {
        message: '삭제하시겠습니까?',
      },
    })

    if (isConfirmed) {
      await deleteCustomCol(tableState?.user_id ?? '', { id })
      await mutateCols()

      openCustomModal({
        type: 'Alert',
        props: {
          id: uniqueID(),
          message: '삭제를 완료했습니다.',
        },
      })
    }
  }

  return (
    <>
      <S.ConfigButton onClick={() => toggleSettings()}>
        열 수정
        <ConfigIcon fill="#fff" />
      </S.ConfigButton>
      {opened && <S.TransparentBackground onClick={() => closeSettings()} />}
      <S.ConfigContainer opened={opened}>
        <S.ConfigHeader>
          <S.Title>열 설정</S.Title>
        </S.ConfigHeader>

        <S.ConfigBody>
          <S.BodyLeft>
            <S.SubTitle>표시</S.SubTitle>
            <S.VisibleOptionsWrapper>
              {visibleOptions.map((option, idx) => (
                <li
                  draggable
                  key={idx}
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDragDrop(e, idx)}
                >
                  {option.label}

                  {
                    <span
                      onClick={() => {
                        handleVisibileOptions(
                          visibleOptions.filter((item) => item.id !== option.id)
                        )
                        handleHiddenOptions([...hiddenOptions, { ...option, status: 'HIDDEN' }])
                      }}
                    >
                      <HoverDotsIcon />
                      <CloseIcon />
                      {/* <VisibilityOffIcon /> */}
                    </span>
                  }
                </li>
              ))}
            </S.VisibleOptionsWrapper>
          </S.BodyLeft>

          <S.BodyRight>
            <S.SubTitle>
              지표
              <S.OpenModalButton onClick={() => openModal(initialValues)}>
                + 커스텀 지표
              </S.OpenModalButton>
            </S.SubTitle>
            <S.HiddenOptionsWrapper>
              {hiddenOptions.map((option) => (
                <li>
                  {option.label}
                  {option.type === 'CUSTOM' && (
                    <S.CustomLabelsWrapper>
                      <span>커스텀</span>
                      <span onClick={(e) => handleCustomListClick(e, option)}>수정</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCustomColDelete(option.id)
                        }}
                      >
                        삭제
                      </span>
                      <span
                        onClick={() => {
                          handleHiddenOptions(hiddenOptions.filter((item) => item.id !== option.id))
                          handleVisibileOptions([
                            ...visibleOptions,
                            { ...option, status: 'VISIBLE' },
                          ])
                        }}
                      >
                        <PlusIcon />
                      </span>
                    </S.CustomLabelsWrapper>
                  )}

                  {option.type === 'ORIGINAL' && (
                    <span
                      onClick={() => {
                        handleHiddenOptions(hiddenOptions.filter((item) => item.id !== option.id))
                        handleVisibileOptions([...visibleOptions, { ...option, status: 'VISIBLE' }])
                      }}
                    >
                      <PlusIcon />
                    </span>
                  )}
                </li>
              ))}
            </S.HiddenOptionsWrapper>
          </S.BodyRight>
        </S.ConfigBody>

        <S.ButtonsWrapper>
          <S.CancelButton onClick={() => setOpened(false)}>취소</S.CancelButton>
          <S.SubmitButton onClick={handleSave}>저장</S.SubmitButton>
        </S.ButtonsWrapper>
      </S.ConfigContainer>

      <CustomIndicatorModal
        visible={modalVisible}
        close={closeModal}
        initialModalState={initialModalState}
      />
    </>
  )
}
