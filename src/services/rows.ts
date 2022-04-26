import { CigroAPI_V2 } from "@/helper/api";

type getMetricsCommand = {
  user_id: string;
  start: string;
  end: string;
  metrics_type: string;
  per_page: number;
  page: number;
};

export const fetchMetrics = async (payload: getMetricsCommand) => {
  const result = await CigroAPI_V2("/metrics", {
    method: "GET",
    params: payload,
  });
  return result;
};
