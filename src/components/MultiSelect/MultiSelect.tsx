import Config from "@/icons/Config";
import * as S from "./MultiSelect.style";
import { useEffect, useRef, useState } from "preact/hooks";
import RoundedPlus from "@/icons/RoundedPlus";
import CustomIndicatorModal from "../CustomIndicatorModal";
import useOptions from "@/hooks/useOptions";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
import DeleteIcon from "@mui/icons-material/Delete";
import useAnotherClick from "@/hooks/useAnotherClick";
import { CigroAPI_V2 } from "@/helper/api";
import useCols from "@/hooks/useCols";

interface Props {}
export default function MultiSelect({}: Props) {
  // console.log("@@visibleOptions", options, visibleOptions);

  const [opened, setOpened] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const configContainerRef = useRef(null);
  // const { anotherClick } = useAnotherClick(configContainerRef);
  // console.log("@@anotherClick", anotherClick);

  const { visibleCols: enhancedCols } = useCols();

  const {
    visibleOptions,
    handleVisibileOptions,
    handleHiddenOptions,
    hiddenOptions,
    mutate,
  } = useOptions();

  const closeModal = () => setModalVisible(false);
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

  return (
    <div style={{ position: "relative" }}>
      <S.ConfigButton onClick={() => setOpened(!opened)}>
        설정
        <Config />
      </S.ConfigButton>
      <S.ConfigContainer opened={opened} ref={configContainerRef}>
        <S.Title>열설정</S.Title>

        <S.SubTitle>표시</S.SubTitle>
        <S.VisibleOptionsWrapper>
          {visibleOptions.map((option, idx) => (
            <li
              draggable
              key={idx}
              onDragStart={() => {
                handleDragStart(idx);
              }}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                handleDragDrop(e, idx);
              }}
              // onClick={}
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
                <DeleteIcon />
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
            </li>
          ))}
        </S.HiddenOptionsWrapper>
        <S.ButtonsWrapper>
          <S.CancelButton onClick={() => setOpened(false)}>취소</S.CancelButton>
          <S.SubmitButton
            onClick={async () => {
              const payload = visibleOptions.map((option) => ({
                type: option.type,
                status: option.status,
                order: option.order,
                id: option.id,
              }));
              console.log("@@payload SubmitButton", payload);

              // FIXME: put할때 body에 모든 데이터를 배열로 보내면 되는건가 ...
              const result = await CigroAPI_V2("/metrics/columns", {
                params: {
                  user_id: "1625805300271x339648481160378400",
                  // metrics_type: "SALES",
                },
                method: "PUT",
                body: payload,
              });

              await mutate();
              console.log("@@result", result);
            }}
          >
            저장
          </S.SubmitButton>
        </S.ButtonsWrapper>
      </S.ConfigContainer>

      <CustomIndicatorModal visible={modalVisible} close={closeModal} />
    </div>
  );
}
