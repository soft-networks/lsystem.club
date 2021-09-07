export const tokenColors = {
  comment: "gray",
  symbol: "black",
  letterColor: (n: number) => `hsl(${n * 20 % 360},50%,50%)`
}

export const splitLines = ( rawCode: string) => {
  return rawCode.split("\n").map((line) => line + "\n");
}

export const lineIsComment = (line: string) => {
  const lineNoWhitespace = line.replace(/\s/g, "");
  return lineNoWhitespace[0] === "*"
}
