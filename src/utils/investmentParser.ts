interface Investment {
  min: number;
  max: number;
  range: string;
}

export function parseInvestment(value: string): Investment {
  const text = value.toLowerCase().replace(/,/g, "").trim();

  if (text.includes("cr")) {
    const number = parseFloat(text);

    return {
      min: number * 10000000,
      max: number * 10000000,
      range:
        number >= 100
          ? "100cr+"
          : `${number}cr`,
    };
  }

  if (text.includes("l")) {
    const number = parseFloat(text);

    return {
      min: number * 100000,
      max: number * 100000,
      range:
        number >= 50
          ? "50l-1cr"
          : "upto50l",
    };
  }

  return {
    min: 0,
    max: 0,
    range: "",
  };
}