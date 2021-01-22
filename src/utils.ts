import queryString from "query-string"

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

export function decodeParams(paramString: string): {axiom: string | undefined, productions: string[] | undefined} {
  const parsed = queryString.parse(paramString);
  let axiom = parsed.a as string | undefined;
  let productionInput = parsed.p;
  let productions: string[] | undefined;
  if (productionInput == null) {
    productions = undefined;
  } else if (productionInput instanceof Array) {
    productions = productionInput as Array<string>
  } else {
    productions = [productionInput as string]
  }

  return {axiom: axiom, productions: productions}
} 

export function encodeParams(axiom: string | undefined, productions: string[] | undefined) {
  if (!axiom && !productions) {
    return ""
  }
  let productionString = productions ? productions.reduce((str, p) => str + "&p=" + encodeURIComponent(p), "") : "";
  let axiomString = axiom ? "a=" + encodeURIComponent(axiom) : "";
  let paramString =  "?" + axiomString + productionString;
  return paramString;
}