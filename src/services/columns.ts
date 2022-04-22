import { CigroAPI_V2 } from "@/helper/api";

export type createCustomColCommand = {
  label: string;
  display: "NUMBER" | "PERCENT" | "WON";
  description?: string;
  formula: string;
  metrics_type: "SALES";
  type: "CUSTOM";
  status: "HIDDEN";
};

export const createCustomCol = async (command: createCustomColCommand) => {
  const result = await CigroAPI_V2("/metrics/columns", {
    params: {
      user_id: "1625805300271x339648481160378400",
    },
    method: "POST",
    body: command,
  });
  return result;
};
