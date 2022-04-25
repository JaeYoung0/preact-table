import Config from "@/icons/Config";
import * as S from "./MultiSelect.style";
import { useState } from "preact/hooks";
import RoundedPlus from "@/icons/RoundedPlus";
import CustomIndicatorModal from "../CustomIndicatorModal";
import useOptions from "@/hooks/useOptions";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import { CustomColType } from "@/hooks/useCols";
import { IndicatorModalValue } from "../CustomIndicatorModal/CustomIndicatorModal";
import {
  deleteCustomCol,
  updateCols,
  updateColsCommand,
} from "@/services/columns";

export default function MultiSelect() {
  const [opened, setOpened] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  console.log("@@modalVisible", modalVisible);

  const initialValues: IndicatorModalValue = {
    label: "",
    description: "",
    display: "NUMBER",
    formula: [],
    id: null,
  };
  const [initialModalState, setInitialModalState] =
    useState<IndicatorModalValue>(initialValues);
  console.log("@@initialModalState", initialModalState.formula);
  const splitRegex = /[\+\-\*\/\(\)]/g;

  const parseFormula = (formula: string[]) => {
    console.log("@@formula 1", formula);

    return formula?.[0]
      ?.replace(/\s/g, "")
      .replace(splitRegex, (matched) => `#${matched}#`)
      .split("#");
  };

  const {
    visibleOptions,
    handleVisibileOptions,
    handleHiddenOptions,
    hiddenOptions,
    mutate,
  } = useOptions();

  const openModal = (payload: IndicatorModalValue) => {
    setModalVisible(true);
    setInitialModalState({
      ...payload,
      formula: parseFormula(payload.formula),
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleSettings = () => setOpened(!opened);
  const closeSettings = () => setOpened(false);

  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    setDraggingIdx(idx);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.borderBottom = "2px solid #6713ef";
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    (e.target as HTMLLIElement).style.borderBottom = "initial";
  };

  const handleDragDrop = (
    e: React.DragEvent<HTMLLIElement>,
    targetIdx: number
  ) => {
    (e.target as HTMLLIElement).style.borderBottom = "initial";

    if (draggingIdx === null) return;

    const newList = [...visibleOptions];
    const draggingItem = newList[draggingIdx];

    // draggingItem 삭제하기
    newList.splice(draggingIdx, 1);

    // draggingItem 옮기기
    newList.splice(
      targetIdx > draggingIdx ? targetIdx : targetIdx + 1,
      0,
      draggingItem
    );

    handleVisibileOptions(newList);
  };

  const handleCustomListClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    option: CustomColType
  ) => {
    e.stopPropagation();
    const { label, description, display, formula, id } = option;

    openModal({
      label,
      description,
      display,
      formula: [formula],
      id,
    });
  };

  const handleSave = async () => {
    const visibleOptionsPayload = visibleOptions.map((option, idx) => ({
      type: option.type,
      status: "VISIBLE",
      order: idx + 1,
      id: option.id,
    }));

    const hiddenOptionsPayload = hiddenOptions.map((option) => ({
      type: option.type,
      status: "HIDDEN",
      order: null,
      id: option.id,
    }));

    const command: updateColsCommand = [
      ...visibleOptionsPayload,
      ...hiddenOptionsPayload,
    ];

    await updateCols(command);
    await mutate();
    closeSettings();
    alert("열 설정이 저장되었습니다.");
  };

  const handleCustomColDelete = async (id: number) => {
    const isConfirmed = confirm("삭제하시겠습니까?");
    if (isConfirmed) {
      await deleteCustomCol({ id });
      await mutate();
      alert("삭제를 완료했습니다.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <S.ConfigButton onClick={() => toggleSettings()}>
        설정
        <Config />
      </S.ConfigButton>
      <S.ConfigContainer opened={opened}>
        <S.Title>열설정</S.Title>
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
              <span
                onClick={() => {
                  handleVisibileOptions(
                    visibleOptions.filter((item) => item.label !== option.label)
                  );
                  handleHiddenOptions([...hiddenOptions, option]);
                }}
              >
                <VisibilityOffIcon />
              </span>
            </li>
          ))}
        </S.VisibleOptionsWrapper>

        <S.SubTitle>
          지표
          <S.OpenModalButton onClick={() => openModal(initialValues)}>
            <RoundedPlus />
          </S.OpenModalButton>
        </S.SubTitle>
        <S.HiddenOptionsWrapper>
          {hiddenOptions.map((option) => (
            <li
              onClick={() => {
                handleHiddenOptions(
                  hiddenOptions.filter((item) => item !== option)
                );
                handleVisibileOptions([...visibleOptions, option]);
              }}
            >
              {option.label}
              {option.type === "CUSTOM" && (
                <div>
                  <span onClick={(e) => handleCustomListClick(e, option)}>
                    <EditIcon />
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomColDelete(option.id);
                    }}
                  >
                    <DeleteIcon />
                  </span>
                </div>
              )}
            </li>
          ))}
        </S.HiddenOptionsWrapper>
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
    </div>
  );
}
