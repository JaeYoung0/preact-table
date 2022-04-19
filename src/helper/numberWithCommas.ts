const numberWithCommas = (target: number) => {
  if (typeof target !== "number") return target;
  return target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default numberWithCommas;
