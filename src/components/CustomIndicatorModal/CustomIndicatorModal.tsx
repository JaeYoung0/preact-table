import * as S from "./CustomIndicatorModal.style";
import { useEffect, useState } from "preact/hooks";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import useCols from "@/hooks/useCols";
import { createCustomCol, createCustomColCommand } from "@/services/columns";

export type IndicatorModalValue = {
  label: string;
  description: string;
  display: "NUMBER" | "WON" | "PERCENT";
  formula: string[];
};

const displays = [
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
  initialModalState: IndicatorModalValue;
}

function CustomIndicatorModal({ visible, close, initialModalState }: Props) {
  const [modalState, setModalState] = useState<IndicatorModalValue>(
    initialModalState
  );

  useEffect(() => {
    setModalState(initialModalState);
  }, [initialModalState]);

  console.log("@@modalState", modalState);

  // const [formula, setFormula] = useState<string[]>([]);
  console.log("@@formula modalState", modalState.formula);

  const { ingredientCols, mutate } = useCols();
  console.log(
    "@@ingredientCols",
    ingredientCols,
    ingredientCols.map((col) => col.label)
  );

  console.log("@@modalState", modalState);

  const handleChange = (event: any) => {
    setModalState({
      ...modalState,
      [event.target.name]: event.target.value,
    });
  };

  const handleReset = () => setModalState({ ...modalState, formula: [] });

  const handleBackspace = () =>
    setModalState({
      ...modalState,
      formula: [...modalState.formula.slice(0, modalState.formula.length - 1)],
    });

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
            id="custom-label"
            name="label"
            label="이름"
            value={modalState.label}
            variant="outlined"
            onChange={handleChange}
          />

          <TextField
            id="custom-display"
            name="display"
            select
            label="형식"
            value={modalState.display}
            sx={{ m: 1, width: "10ch" }}
            onChange={handleChange}
            // helperText='Please select your currency'
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
            label="설명-선택사항"
            variant="outlined"
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
            setModalState({
              ...modalState,
              formula: [...modalState.formula, value],
            });
          }}
        >
          <span data-value="+">+</span>
          <span data-value="-">-</span>
          <span data-value="*">x</span>
          <span data-value="/">&divide;</span>
          <span data-value="(">{`(`}</span>
          <span data-value=")">{`)`}</span>
        </S.CalculatorHeader>

        <S.CalculatorBody>
          {modalState.formula.map(renderFormula)}
        </S.CalculatorBody>

        <S.OriginalIndicators>
          {ingredientCols.map((col) => (
            <span
              onClick={() => {
                setModalState({
                  ...modalState,
                  formula: [...modalState.formula, col.label],
                });
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
                label: modalState.label,
                display: modalState.display,
                description: modalState.description,
                formula: modalState.formula.join(" "),
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
