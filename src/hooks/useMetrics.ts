import { useMemo } from "preact/hooks";
import { GridRowModel } from "@mui/x-data-grid";
import useSWR from "swr";
import { CigroAPI_V2 } from "@/helper/api";

function useMetrics() {
  const { data = [], error, mutate } = useSWR<Record<string, unknown>[]>(
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

  /**
   * FIXME: data가 {detail: 'column formula error: 옳지 않은 식입니다. [상품가격 * 상품 할인가]'}로 들어오기도 한다. 이때 error가 undefined인게 이상함
   */
  console.log("@@error", error);

  const rows: GridRowModel[] = useMemo(() => {
    if (!data) return [];

    return data?.map((row, idx) => ({ ...row, id: idx }));
  }, [data]);

  console.log("@@rows", rows);

  return {
    rows,

    mutate,
    error,
  };
}

export default useMetrics;
