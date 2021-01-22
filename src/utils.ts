import queryString from "query-string"

export interface GFXProps {
  length?: number;
  angle?: number;
  center?: number[];
  width?: number;
  height?: number;
  strokeWeight?: number;
  threeD?: boolean
}

export function flattenText(stringarr: string[], delimiter: string) {
  return stringarr.reduce((str, t) => str + delimiter + t, "")
}

export function decodeParams(paramString: string): {axiom?: string , productions?: string[], gfxProps?: GFXProps} {
  const parsed = queryString.parse(paramString);
  let returnDict : {axiom?: string , productions?: string[], gfxProps?: GFXProps}= {};
  if (parsed.a) returnDict.axiom = parsed.a as string;
  if (parsed.p) {
    let productions: string[];
    if (parsed.p instanceof Array) {
      productions = parsed.p as Array<string>
    } else {
      productions = [parsed.p as string]
    } 
    returnDict.productions = productions
  }
  let gfxProps : GFXProps = {};
  if (parsed.length || parsed.angle) {
    if (parsed.length) gfxProps.length = parseFloat(parsed.length as string);
    if (parsed.angle) gfxProps.angle = parseFloat(parsed.angle as string)
    returnDict.gfxProps = gfxProps;
  }
  return returnDict;
} 

export function encodeParams(axiom: string | undefined, productions: string[] | undefined, gfxProps?: GFXProps) {
  let productionString = productions ? productions.reduce((str, p) => str + "&p=" + encodeURIComponent(p), "") : "";
  let axiomString = axiom ? "a=" + encodeURIComponent(axiom) : "a=";
  let gfxPropsString = ""; 
  if (gfxProps) {
    if (gfxProps.length) {
      gfxPropsString += "&length=" + encodeURIComponent(gfxProps.length);
    }
    if (gfxProps.angle) {
      gfxPropsString += "&angle=" + encodeURIComponent(gfxProps.angle);
    }
  }
  let paramString =  "?" + axiomString + productionString + gfxPropsString;
  return paramString;
}