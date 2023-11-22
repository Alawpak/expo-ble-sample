export const INIT_BYTE_ARRAY: string[][][] = Array.from({ length: 8 }, () =>
  new Array(8).fill("").map(() => new Array(5).fill("").map(() => "0"))
);
