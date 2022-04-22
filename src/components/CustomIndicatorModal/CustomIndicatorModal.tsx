import * as S from "./CustomIndicatorModal.style";
import { useState } from "preact/hooks";
import MenuItem from "@mui/material/MenuItem";

import TextField from "@mui/material/TextField";
import useCols from "@/hooks/useCols";
import { createCustomCol, createCustomColCommand } from "@/services/columns";

type FormValue = {
  name: string;
  description: string;
  format: "NUMBER" | "WON" | "PERCENT";
};

const formats = [
  {
    value: "NUMBER",
    label: "숫자",
  },
  {
    value: "WON",
    label: "통화(원)",
  },
  {
    value: "PERCENT",
    label: "백분율",
  },
];

interface Props {
  visible: boolean;
  close: () => void;
}

function CustomIndicatorModal({ visible, close }: Props) {
  const [state, setState] = useState<FormValue>({
    name: "",
    format: "NUMBER",
    description: "",
  });

  const [formula, setFormula] = useState<string[]>([]);
  console.log("@@formula", formula);

  const { ingredientCols, mutate } = useCols();
  console.log(
    "@@ingredientCols",
    ingredientCols,
    ingredientCols.map((col) => col.label)
  );

  console.log("@@state", state);

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
            value={state.name}
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

        <S.CalculatorBody>{formula.map(renderFormula)}</S.CalculatorBody>

        <S.OriginalIndicators>
          {ingredientCols.map((col) => (
            <span
              onClick={() => {
                setFormula([...formula, col.label]);
              }}
            >
              {col.label}
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
          <S.SubmitButton
            onClick={async () => {
              const command: createCustomColCommand = {
                label: state.name,
                display: state.format,
                description: state.description,
                formula: formula.join(" "),
                metrics_type: "SALES",
                type: "CUSTOM",
                status: "HIDDEN",
              };

              console.log("@@command", command);

              const res = await createCustomCol(command);
              if (res) {
                await mutate();
                // 토스트 띄우기
                close();
              }
              console.log("@@res", res);
            }}
          >
            저장
          </S.SubmitButton>
        </S.ButtonsWrapper>
      </S.ModalWrapper>
    </S.Container>
  );
}

export default CustomIndicatorModal;
