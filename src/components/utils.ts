
import qs from "qs";



export const defaultLSData = {
  axiom: "A",
  productionText: ["A:FA"],
  iterations: 10
}

export type P5CanvasType = "webgl" | "p2d"
export type renderTypes = "2d" | "3d" | "text" | "pixel";

export interface CompleteLSExample {
  lsProps: LSProps
  gfxProps?: GFXProps
  name?: string
}

export interface LSStatus {
  state : "compiling" | "compiled" | "error" | "ready",
  errors?: Error[]
}
export interface LSProps {
  axiom: string
  productions: string[]
  iterations: number
}

export interface GFXPropsComplete {
  renderType: renderTypes[]
  length: number
  angle: number
  center: number[]
  width: number
  height: number
  strokeWeight: number
  backgroundColor: string
  animationWaitTime: number,
  iterations: number
}

const defaultGFXProps: GFXPropsComplete = {
  renderType: ["2d"],
  length: 10,
  angle: 30,
  center: [0,0],
  width: 600,
  height: 600,
  strokeWeight: 1,
  backgroundColor:"#eee",
  animationWaitTime: 500,
  iterations: 1
}

export const completeGfxProps = (gfxProps: GFXProps | undefined) : GFXPropsComplete => {
  if ( gfxProps === undefined) return defaultGFXProps
  return {...defaultGFXProps, ...gfxProps};
}

export type GFXProps = Partial<GFXPropsComplete>


export function flattenLSProps(ls: LSProps, delimiter: string) {
  let stringArr = [ls.axiom, ...ls.productions];
  return stringArr.reduce((str, t) => str + t + delimiter, "")
}

function cleanParam(o: string | string[]): string {
  if (o instanceof Array) {
    return o[0] as string
  }
  else return o as string
}
export function decodeParams(paramString: string): { initCode?: string, gfxProps?: GFXProps} {
  const parsedDictionary = qs.parse(paramString, {ignoreQueryPrefix: true});
  console.log("Parsed from " + paramString , parsedDictionary)
  return {initCode: parsedDictionary.code as string, gfxProps: parsedDictionary.gfx}
} 

export function encodeParams(code?: string, gfxProps?: GFXProps) {
  const fullProps = { code: code, gfx: gfxProps}
  const urlString = "?" + qs.stringify(fullProps);
  console.log("Stringifying props into querystring" + urlString, fullProps);
  return urlString;
}

//temp solution
export function encodePropsParams(lsProps: LSProps, gfxProps?: GFXProps) {
  let code = lsProps.axiom + "\n";
  code = code + lsProps.productions.join("\n")

  let gfx =  {...gfxProps || {}, iterations: lsProps.iterations};
  return encodeParams(code, gfx);
}