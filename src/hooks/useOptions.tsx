import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import React from "react";
import { columns as DATA_COLS } from "../data";
import useMetrics from "./useMetrics";

const FIELD_NAMES = DATA_COLS.map((col) => col.field);

type OptionsContextType = {
  visibleOptions: string[];
  hiddenOptions: string[];
  handleVisibileOptions: (newOptions: string[]) => void;
  handleHiddenOptions: (newOptions: string[]) => void;
};

const Options = createContext<OptionsContextType>({
  visibleOptions: [],
  hiddenOptions: [],
  handleVisibileOptions: () => 0,
  handleHiddenOptions: () => 0,
});

export function OptionsProvider({ children }: { children: React.ReactNode }) {
  const [visibleOptions, setVisibleOptions] = useState<string[]>([]);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);

  const handleVisibileOptions = (newOptions: string[]) => {
    setVisibleOptions([...newOptions]);
  };

  const handleHiddenOptions = (newOptions: string[]) => {
    setHiddenOptions([...newOptions]);
  };

  const { visibleOptions: wow } = useMetrics();

  useEffect(() => {
    // FIXME: API call
    setVisibleOptions(wow);
  }, [wow]);

  return (
    <Options.Provider
      value={{
        visibleOptions,
        hiddenOptions,
        handleVisibileOptions,
        handleHiddenOptions,
      }}
    >
      {children}
    </Options.Provider>
  );
}

function useOptions() {
  const options = useContext(Options);
  const {
    visibleOptions,
    hiddenOptions,
    handleVisibileOptions,
    handleHiddenOptions,
  } = options;
  return {
    visibleOptions,
    hiddenOptions,
    handleVisibileOptions,
    handleHiddenOptions,
  };
}

export default useOptions;
