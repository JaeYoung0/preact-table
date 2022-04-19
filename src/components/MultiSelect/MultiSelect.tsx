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

interface Props {}
export default function MultiSelect({}: Props) {
  // console.log("@@visibleOptions", options, visibleOptions);

  const [opened, setOpened] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const configContainerRef = useRef(null);
  // const { anotherClick } = useAnotherClick(configContainerRef);
  // console.log("@@anotherClick", anotherClick);

  const {
    visibleOptions,
    handleVisibileOptions,
    handleHiddenOptions,
    hiddenOptions,
  } = useOptions();

  console.log("@@hiddenOptions", hiddenOptions);

  const closeModal = () => setModalVisible(false);

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
          {visibleOptions.map((option) => (
            <li
              onClick={() => {
                handleVisibileOptions(
                  visibleOptions.filter((item) => item !== option)
                );
                handleHiddenOptions([...hiddenOptions, option]);
              }}
            >
              {option}
              <DeleteIcon />
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
              {option}
            </li>
          ))}
        </S.HiddenOptionsWrapper>
        <S.ButtonsWrapper>
          <S.CancelButton onClick={() => setOpened(false)}>취소</S.CancelButton>
          <S.SubmitButton
            onClick={async () => {
              // FIXME: put할때 body에 모든 데이터를 배열로 보내면 되는건가 ...
              // const result = await  CigroAPI_V2('/metrics/columns',{
              //   params:{
              //     user_id: "1625805300271x339648481160378400",
              //     metrics_type: "SALES",
              //   },
              //   method:'PUT'
              // })
              // console.log('@@result',result);
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
