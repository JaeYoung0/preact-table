export type ParamsType = Record<string, string>;

export const CigroAPI_V2 = (
  endpoint: string,
  config: {
    params: ParamsType;
    method: "GET" | "POST" | "PUT";
    body?: any;
  }
) => {
  const prefix = "https://dev.cigro.io/api/v2";

  let options: { method: string; body?: string } = {
    method: config.method,
  };
  console.log("@@config.params", config.params);
  endpoint += "?" + new URLSearchParams(config.params).toString();

  if (config.method !== "GET") {
    //  FIXME: stringify를 해야해?..
    options.body = JSON.stringify(config.body);
  }

  return fetch(prefix + endpoint, options).then((response) => response.json());
};
