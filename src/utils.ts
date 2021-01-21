export function flattenText(stringarr: string[], delimiter: string) {
  return stringarr.reduce((str, t) => str + delimiter + t, "")
}

export interface GFXProps {
  length?: number;
  angle?: number;
  center?: number[];
  width?: number;
  height?: number;
  strokeWeight?: number;
  threeD?: boolean
}