import { useMemo } from "preact/hooks";
import { GridColumns, GridRowModel } from "@mui/x-data-grid";
import useSWR from "swr";
import { CigroAPI_V2 } from "@/helper/api";

function useMetrics() {
  const { data, error, mutate } = useSWR<Record<string, unknown>[]>(
    "/metrics",
    (key) =>
      CigroAPI_V2(key, {
        method: "GET",
        params: {
          user_id: "1625805300271x339648481160378400",
          start: "1618833417",
          end: "1650369417",
          metrics_type: "SALES",
          per_page: "10",
          page: "1",
        },
      }),
    { dedupingInterval: 2000, errorRetryCount: 3 }
  );
  console.log("@@useMetrics data", data);

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
