import Table from "@/components/Table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { OptionsProvider } from "@/hooks/useOptions";
import { Global, css } from "@emotion/react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6713ef",
    },
    secondary: {
      main: "#636378",
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <OptionsProvider>
        <Global
          styles={css`
            html {
              font-family: "Noto Sans KR";
            }
          `}
        />
        <Table />
      </OptionsProvider>
    </ThemeProvider>
  );
}

// function uniqueID() {
// 	return Math.floor(Math.random() * Date.now())
// };
//  const wrapperId = `table-${uniqueID()}`
//  console.log('@@wrapperId',wrapperId)
//   const wrapper = document.createElement('div');
// wrapper.setAttribute('id',wrapperId);
//   instance.canvas.append(wrapper);
