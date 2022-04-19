import useSWR from "swr";
import { CigroAPI_V2 } from "@/helper/api";
import { useMemo } from "preact/hooks";

type ColData = {
  metrics_type: "SALES";
  label: string;
  display: "TEXT" | "WON" | "PERCENT";
  order: 1;
  formula: null;
  company_id: 3;
  type: "ORIGINAL" | "CUSTOM";
  status: "VISIBLE" | "HIDDEN";
  description: string;
  id: number;
};

function useCols() {
  const { data, error, mutate } = useSWR<ColData[]>(
    "/metrics/columns",
    (key) =>
      CigroAPI_V2(key, {
        method: "GET",
        params: {
          user_id: "1625805300271x339648481160378400",
          metrics_type: "SALES",
        },
      }),
    { dedupingInterval: 2000, errorRetryCount: 3 }
  );

  console.log("@@useCols data", data);

  const visibleCols = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => item.status === "VISIBLE");
  }, [data]);

  const hiddenCols = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => item.status === "HIDDEN");
  }, [data]);

  return { visibleCols, hiddenCols };
}

export default useCols;
