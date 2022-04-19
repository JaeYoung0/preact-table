import { useMemo } from "preact/hooks";
import { GridColumns, GridRowModel } from "@mui/x-data-grid";
import useSWR from "swr";

const fetcher = (endpoint: string) =>
  fetch(`https://dev.cigro.io/api/v2${endpoint}`)
    .then((res) => res.json())
    .then((res) => res.data);

const numberWithCommas = (target: number) => {
  if (typeof target !== "number") return target;
  return target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function useMetrics() {
  const { data, error, mutate } = useSWR<Record<string, unknown>[]>(
    "/metrics?user_id=1625805300271x339648481160378400&start=1618833417&end=1650369417",
    fetcher,
    { dedupingInterval: 2000, errorRetryCount: 3 }
  );
  console.log("@@data", data);

  // FIXME: visible, hidden 구분하기. 그러면 useOptions랑 통합할 수 있을지도.
  const cols: GridColumns = useMemo(() => {
    if (!data) return [];
    return Object.keys(data[0]).map((item) => ({
      field: item,
      headerName: item,
      width: 150,
      headerAlign: "center",
      align: "center",
    }));
  }, [data]);

  const rows: GridRowModel[] = useMemo(() => {
    if (!data) return [];
    // const colKeys = Object.keys(data[0]);
    // console.log("@@colKeys", colKeys);

    return data.map((row, idx) => ({ ...row, id: idx }));
  }, [data]);

  const visibleOptions = useMemo(() => {
    if (!data) return [];
    return Object.keys(data[0]);
  }, [data]);

  console.log("@@data", data);
  console.log("@@cols", cols, data);
  console.log("@@rows", rows);
  console.log("@@visibleOptions", visibleOptions);

  return {
    rows,
    cols,
    mutate,
    error,
    visibleOptions,
  };
}

export default useMetrics;
