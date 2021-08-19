import React, {createRef, useEffect, useRef} from "react";
import LSystem, { Axiom } from "@bvk/lsystem"
import { GFXProps, GFXPropsComplete, P5CanvasType, completeGfxProps } from "../utils";
import p5 from "p5"
import { useState } from "react";
import { useCallback } from "react";

interface LSImageViewerParentProps {
  LSystem: LSystem | undefined
  drawCommand: Axiom | undefined
  initGFXProps?: GFXProps
}



const LSImageViewerParent: React.FunctionComponent<LSImageViewerParentProps> = ({
  LSystem = undefined,
  initGFXProps: GFXProps = undefined,
  drawCommand = undefined
}) => {

  const p5Context = useRef<p5>();
  const containerNode = createRef<HTMLDivElement>();
  const renderer = useRef<p5.Renderer>();
  const canvasTypeString = useRef<P5CanvasType>("p2d");
  const canvasID = useRef<string>("CANVAS-P52D");
  
  const [currentGFXProps, setCurrentGFXProps] = useState<GFXPropsComplete>( completeGfxProps(GFXProps));
  
  //🔺 Helper functions to draw. Can be overriden by children
  const defaultSetup = useCallback((p : p5) => {
      renderer.current = p.createCanvas(currentGFXProps.width, currentGFXProps.height, canvasTypeString.current);
      renderer.current.id(canvasID.current);
      p.angleMode(p.DEGREES);
      p.colorMode(p.HSB);
      p.noLoop();
      p.textFont("monospace ", 12);
      p.strokeCap("butt")
    },
    [currentGFXProps.width, currentGFXProps.height, canvasTypeString],
  );
  const preload = useCallback((p:p5) => {
    //Do nothing by default
  }, [])
  const clearCanvas = useCallback((p : p5) => {
    p.clear();
    p.background(currentGFXProps.backgroundColor);
  }, [currentGFXProps.backgroundColor]);
  const moveToCanvasCenter = (p: p5) => {
    if (!p) return
    p.translate(p.width / 2, p.height / 2);
  }
  const rotateToUp = (p : p5) => {
    if (p) p.rotate(-90);
  }
  const drawCurrentCommand = useCallback((p: p5) => {
    console.log("Re-drawing draw command");
    p.push() 
    moveToCanvasCenter(p);
    p.translate(currentGFXProps.center[0], currentGFXProps.center[1], 0);
    rotateToUp(p);
    const csd = drawCommand;
    p.fill(Math.random() * 360,100,100);
    p.ellipse(0,0,100,100);
    p.pop()
  }, [currentGFXProps.center, drawCommand])

  const redraw = useCallback(() => {
    if (p5Context.current !== undefined) {
      clearCanvas(p5Context.current)
      drawCurrentCommand(p5Context.current);
    } else {
      console.warn("Couldn't redraw in the canvas, context is", p5Context.current)
    }
  }, [clearCanvas, drawCurrentCommand])

  //🛠 🎨 P5 Sketch - shouldn't need to be overriden.=
  const sketch = useCallback((p: p5) => {
    p.setup = () => {
      console.log("Setting up now");
      defaultSetup(p);
      preload(p);
      p5Context.current = p;
      redraw();
    }
    p.draw = () => {
      //We don't use draw, just draw in Setup
    }
  }, [defaultSetup, redraw, preload])

 
  //Effects

  //Mount
  useEffect(() => {
    console.log("Initial mount", containerNode)
    if (containerNode.current && !p5Context.current) 
       p5Context.current = new p5(sketch, containerNode.current)
  }, [])

  //Unmount
  useEffect( () => () => {
    p5Context.current?.remove();
    p5Context.current = undefined;
  }, [])

  useEffect(()=> {
    setCurrentGFXProps(completeGfxProps(GFXProps))
    redraw();
  }, [GFXProps, redraw])
  
  useEffect(() => {
    redraw();
  }, [redraw, drawCommand])

  return <div ref={containerNode}></div>
  
}

export default LSImageViewerParent;