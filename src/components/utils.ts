
import qs from "qs";
import { lineIsComment, splitLines } from "./LSEditor/codeSyntax";



export const defaultLSData = {
  axiom: "A",
  productionText: ["A:FA"],
  iterations: 10
}

export type P5CanvasType = "webgl" | "p2d"
export type renderTypes = "auto"  | "2d" | "3d" | "text" | "pixel";

export interface CompleteLSExample {
  lsProps: LSProps
  gfxProps?: GFXProps
  name?: string
}

export interface LSError {
  lineNum: "global" | number,
  error: Error
}
export interface LSStatus {
  state : "compiling" | "compiled" | "error" | "ready" | "redrawing"
  errors?: LSError[],
  message?: string
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
  renderType: ["auto"],
  length: 10,
  angle: 30,
  center: [0,0],
  width: 600,
  height: 600,
  strokeWeight: 1,
  backgroundColor:"#eee",
  animationWaitTime: 500,
  iterations: 3
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
  //console.log("Parsed from " + paramString , parsedDictionary)
  return {initCode: parsedDictionary.code as string, gfxProps: parsedDictionary.gfx}
} 

export function encodeParams(code?: string, gfxProps?: GFXProps) {
  const fullProps = { code: code, gfx: gfxProps}
  const urlString = "?" + qs.stringify(fullProps);
  //console.log("Stringifying props into querystring" + urlString, fullProps);
  return urlString;
}

//temp solution
export function encodePropsParams(lsProps: LSProps, gfxProps?: GFXProps) {
  let code = lsProps.axiom + "\n";
  code = code + lsProps.productions.join("\n")

  let gfx =  {...gfxProps || {}, iterations: lsProps.iterations};
  return encodeParams(code, gfx);
}

export function encodeCodeParams(code: string, gfxProps?: GFXProps) {
  return encodeParams(code, gfxProps || {});
}

export function createFave(code?: string, gfxProps?: GFXProps) {
  return {code: code, gfx: gfxProps};
}

export function getFave(fave: any) {
  if (fave && fave.code) {
    console.log("Getting fave", fave);
    return {code: fave.code, gfx: fave.gfx}
  }
  return undefined;
}

export function propsToCode(lsProps: LSProps) : string  {
  return lsProps.axiom + "\n" + lsProps.productions.join("\n");
}

export function codeToProps(code: string): LSProps {
  let lines = code.split("\n")
  lines = lines.filter(line => !lineIsComment(line));
  lines = lines.filter(line => line.trim() !== "");
  return {
    axiom: lines[0],
    productions: lines.slice(1),
    iterations: 1
  }
}