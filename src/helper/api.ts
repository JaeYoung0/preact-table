export type ParamsType = Record<string, string>;

export const CigroAPI_V2 = (
  endpoint: string,
  config: {
    params: ParamsType;
    method: "GET" | "POST" | "PUT";
  }
) => {
  const prefix = "https://dev.cigro.io/api/v2";

  let options: { method: string; body?: string } = {
    method: config.method,
  };
  console.log("@@config.params", config.params);

  if (config.method === "GET") {
    endpoint += "?" + new URLSearchParams(config.params).toString();
  } else {
    options.body = JSON.stringify(config.params);
  }

  return fetch(prefix + endpoint, options)
    .then((response) => response.json())
    .then((res) => res.data);
};
