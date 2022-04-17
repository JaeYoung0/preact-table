import Config from "@/icons/Config";
import * as S from "./MultiSelect.style";
import { useState } from "preact/hooks";
import RoundedPlus from "@/icons/RoundedPlus";
import CustomIndicatorModal from "../CustomIndicatorModal";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props {
  options: string[];
  selectedOptions: string[];
}
export default function MultiSelect({ options, selectedOptions }: Props) {
  console.log("@@selectedOptions", options, selectedOptions);

  const [opened, setOpened] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

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
          {selectedOptions.map((option) => (
            <li>{option}</li>
          ))}
        </S.VisibleOptionsWrapper>

        <S.SubTitle>
          지표
          <S.OpenModalButton onClick={() => setModalVisible(true)}>
            <RoundedPlus />
          </S.OpenModalButton>
        </S.SubTitle>
        <S.HiddenOptionsWrapper>
          {selectedOptions.map((option) => (
            <li>{option}</li>
          ))}
        </S.HiddenOptionsWrapper>
        <S.ButtonsWrapper>
          <S.CancelButton>취소</S.CancelButton>
          <S.SubmitButton>저장</S.SubmitButton>
        </S.ButtonsWrapper>
      </S.ConfigContainer>

      <CustomIndicatorModal visible={modalVisible} close={closeModal} />
    </div>
  );
}
