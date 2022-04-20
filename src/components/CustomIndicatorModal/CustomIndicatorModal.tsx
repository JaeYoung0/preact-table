import React from "react";
import * as S from "./CustomIndicatorModal.style";
import Select from "@mui/material/Select";
import { useState } from "preact/hooks";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

const formats = [
  {
    value: "number",
    label: "숫자",
  },
  {
    value: "won",
    label: "통화(원)",
  },
  {
    value: "percent",
    label: "백분율",
  },
];

interface Props {
  visible: boolean;
  close: () => void;
}

const originalIndicators = [
  "지출 금액",
  "노출",
  "도달 수",
  "빈도",
  "링크 클릭",
  "CPC",
  "CPM",
  "CTR",
  "지출 금액",
  "노출",
  "도달 수",
  "빈도",
  "링크 클릭",
  "CPC",
  "CPM",
  "CTR",
];

function CustomIndicatorModal({ visible, close }: Props) {
  console.log("@@visible", visible);

  const [state, setState] = useState({
    name: "",
    format: "number",
    description: "",
  });

  const [formula, setFormula] = useState<string[]>([]);

  // console.log("@@payload", { ...state, formula });

  console.log("@@state", state);
  console.log("@@formula", formula);

  const handleChange = (event: any) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleReset = () => setFormula([]);

  const handleBackspace = () =>
    setFormula([...formula.slice(0, formula.length - 1)]);

  const renderFormula = (item: string) => {
    if (item === "*") return <S.FormulaItem>x</S.FormulaItem>;
    else if (item === "/") return <S.FormulaItem>&divide;</S.FormulaItem>;
    else return <S.FormulaItem>{item}</S.FormulaItem>;
  };

  return (
    <S.Container visible={visible}>
      <S.Backdrop />

      <S.ModalWrapper>
        <S.Title>맞춤 지표 만들기</S.Title>

        <S.Row>
          <TextField
            id='custom-name'
            name='name'
            label='이름'
            variant='outlined'
            onChange={handleChange}
          />

          <TextField
            id='custom-format'
            name='format'
            select
            label='형식'
            value={state.format}
            sx={{ m: 1, width: "10ch" }}
            onChange={handleChange}
            // helperText='Please select your currency'
          >
            {formats.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </S.Row>
        <S.Row>
          <TextField
            id='custom-description'
            name='description'
            value={state.description}
            label='설명-선택사항'
            variant='outlined'
            sx={{ width: "100%" }}
            onChange={handleChange}
          />
        </S.Row>

        <S.Row
          style={{ justifyContent: "space-between", marginBottom: "10px" }}
        >
          <S.CaculatorName>수식</S.CaculatorName>
          <div>
            <S.Reset onClick={handleReset}>reset</S.Reset>
            <S.Backspace onClick={handleBackspace}>Backspace</S.Backspace>
          </div>
        </S.Row>
        <S.CalculatorHeader
          onClick={(e) => {
            const value = (e.target as HTMLElement).dataset.value as string;
            setFormula([...formula, value]);
          }}
        >
          <span data-value='+'>+</span>
          <span data-value='-'>-</span>
          <span data-value='*'>x</span>
          <span data-value='/'>&divide;</span>
          <span data-value='('>{`(`}</span>
          <span data-value=')'>{`)`}</span>
        </S.CalculatorHeader>

        <S.CalculatorBody>
          {/* <TextField
          id='custom-formula'
          // label={<span></span>}
          // variant='outlined'
          value={formula}
          // onChange={handleformulaChange}
          sx={{ width: "100%", border: "none" }}
        /> */}
          {formula.map(renderFormula)}
        </S.CalculatorBody>

        <S.OriginalIndicators>
          {originalIndicators.map((item) => (
            <span
              onClick={() => {
                setFormula([...formula, item]);
              }}
            >
              {item}
            </span>
          ))}
        </S.OriginalIndicators>

        <S.ButtonsWrapper>
          <S.CancelButton
            onClick={() => {
              close();
            }}
          >
            취소
          </S.CancelButton>
          <S.SubmitButton>저장</S.SubmitButton>
        </S.ButtonsWrapper>
      </S.ModalWrapper>
    </S.Container>
  );
}

export default CustomIndicatorModal;
