import Config from "@/icons/Config";
import * as S from "./MultiSelect.style";
import { useRef, useState } from "preact/hooks";
import RoundedPlus from "@/icons/RoundedPlus";
import CustomIndicatorModal from "../CustomIndicatorModal";
import useOptions from "@/hooks/useOptions";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import useAnotherClick from "@/hooks/useAnotherClick";
import { CigroAPI_V2 } from "@/helper/api";
import useCols, { ColData } from "@/hooks/useCols";
import { IndicatorModalValue } from "../CustomIndicatorModal/CustomIndicatorModal";

export default function MultiSelect() {
  const [opened, setOpened] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const initialValues: IndicatorModalValue = {
    label: "",
    description: "",
    display: "NUMBER",
    formula: [],
  };
  const [
    initialModalState,
    setInitialModalState,
  ] = useState<IndicatorModalValue>(initialValues);
  console.log("@@initialModalState", initialModalState);

  const {
    visibleOptions,
    handleVisibileOptions,
    handleHiddenOptions,
    hiddenOptions,
    mutate,
  } = useOptions();

  const openModal = (payload: IndicatorModalValue) => {
    setModalVisible(true);
    setInitialModalState({ ...payload, formula: payload.formula });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

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
    const targetItem = newList[targetIdx];

    console.log(
      "@@drag",
      draggingIdx,
      "옮기는 중...",
      targetIdx,
      "부터 하나도 없애지 않고",
      draggingItem,
      "을 ",
      targetItem,
      "뒤에 삽입한 결과",
      newList
    );

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
    option: ColData
  ) => {
    e.stopPropagation();
    const { label, description, display, formula } = option;

    console.log("@@wow", {
      label,
      description,
      display,
      formula: [formula],
    });

    openModal({
      label,
      description,
      display,
      formula: [formula],
    });

    console.log("@@formula", formula);
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
      // order: option.order,
      order: null,
      id: option.id,
    }));

    const payload = [...visibleOptionsPayload, ...hiddenOptionsPayload];

    console.log("@@payload SubmitButton", payload);

    // FIXME: put할때 body에 모든 데이터를 배열로 보내면 되는건가 ...
    const result = await CigroAPI_V2("/metrics/columns", {
      params: {
        user_id: "1625805300271x339648481160378400",
      },
      method: "PUT",
      body: payload,
    });

    await mutate();
    console.log("@@result", result);
  };

  return (
    <div style={{ position: "relative" }}>
      <S.ConfigButton onClick={() => setOpened(!opened)}>
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
          <S.OpenModalButton onClick={() => setModalVisible(true)}>
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
                <>
                  <span onClick={(e) => handleCustomListClick(e, option)}>
                    <EditIcon />
                  </span>
                  <span onClick={() => alert("Delete Custom Col")}>
                    <DeleteIcon />
                  </span>
                </>
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
