import LSystem from "@bvk/lsystem"
import React from "react"
import P5Turtle3D from "../LSDraw/P5Turtle3D"
import { CompleteLSExample, GFXProps } from "../utils"

const lilacData : CompleteLSExample = {
  name: "lilac",
  lsProps: {
    axiom: " -(180) f(120) +(180) #(120) !(2) A∼K",
    productions: ["A: [-/∼K][+/∼K]I(0)/(rnd(0,90))A", "I(t) {t!=2}: FI(t+1)", "I(t) {t==2}: I(t+1)[-FFA][+FFA]","K: [#(300) !(0.9) F E(10,300)]"],
    iterations: 15
  },
  gfxProps: {
    length: 3, renderType: ["3d"]
  }
}

export default function Lilac() {
  let ls =  new LSystem(lilacData.lsProps.axiom, lilacData.lsProps.productions, lilacData.lsProps.iterations);
  let gfxProps = lilacData.gfxProps; 

  return (<P5Turtle3D LSystem={ls} GFXProps={gfxProps}/>)
}