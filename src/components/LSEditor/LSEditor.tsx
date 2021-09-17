

import LSystem, {  parseAxiom, parseProduction } from "@bvk/lsystem"
import React, { useCallback, useState } from "react"
import { useEffect } from "react";
import {completeGfxProps, createFave, decodeParams, encodeParams, GFXProps, GFXPropsComplete, LSProps, LSStatus} from "../utils"
import { createLSInWorker } from "../worker";
import LSConsole from "./LSStatusConsole";
import LSCodeEditor from "./LSCodeEditor";
import { GFXPropsCustomizer } from "./LSGFXEditor";
import { useRef } from "react";
import { lineIsComment, splitLines } from "./codeSyntax";
import copy from "copy-to-clipboard"
import base64 from "base-64";

interface LSEditorProps {
  onLSReset(LS: LSystem): void;
  onLSIterated(LS: LSystem): void;
  onGFXPropsUpdate(gfxProps: GFXProps): void;
  initCode?: string
  initGFXProps?: GFXProps
  saveToLocalStorage?: string,
  className?: string
}

const defaultCode = "* Simple Spiral \n\n* Axiom: Start with A A\nA\n\n* Production: A becomes: F (forward), + (turn), A (repeat)\nA:F+A"

export const LSEditor: React.FunctionComponent<LSEditorProps> = ({
  onLSReset,
  onLSIterated,
  onGFXPropsUpdate,
  initCode,
  initGFXProps,
  saveToLocalStorage,
  className
}) => {
  const [lSystem, setLSystem] = useState<LSystem>();
  const [status, setStatus] = useState<LSStatus>();
  const [gfxProps, setGFXProps] = useState<GFXPropsComplete>(completeGfxProps(initGFXProps));
  const firstRun = useRef<boolean>(true);
  const initializeCode = (): string => {
    if (initCode !== undefined) return initCode;
    if (saveToLocalStorage !== undefined) {
      let storedVal = localStorage.getItem(saveToLocalStorage);
      if (storedVal !== undefined && storedVal !== "") {
        return storedVal as string;
      }
    }
    return defaultCode
  };
  const [currentCode, setCurrentCode] = useState<string>(initializeCode);



  const lSystemNeedsReset = useRef<boolean>(true);
  const gfxPropsNeedsReset = useRef<boolean>(true);


  useEffect(() => {
    if (lSystem)
      onLSReset(lSystem);
  }, [lSystem, onLSReset])



  //TODO: Move line login into refresh function to optimize


  useEffect(() => {
    if (saveToLocalStorage && currentCode !== undefined) {
      //console.log("Local storage key exists setting", currentCode);
      localStorage.setItem(saveToLocalStorage, currentCode);
    }
  }, [currentCode, saveToLocalStorage])
  

  const createLSystem = useCallback((lsProps) => {
    // console.log("Gonna run current LS");
    try {
      setStatus({ state: "compiling" });
      createLSInWorker(lsProps).then((updatedLS) => {
        setLSystem(updatedLS);
        setStatus({ state: "compiled" });
      });
    } catch (e) {
      setStatus({ state: "error", errors: [e as Error] });
    }
  }, [setStatus]);



  const updateCurrentGFXProps = useCallback((gfxPropUpdate: GFXProps) => {
    // console.log("Gfx props updated"); 
    setGFXProps((prevProps) => {
      if (gfxPropUpdate.iterations !== undefined && gfxPropUpdate.iterations !== prevProps.iterations) {
        lSystemNeedsReset.current = true;
      } else {
        gfxPropsNeedsReset.current = true;
      }
      return {...prevProps, ...gfxPropUpdate}
    })
  }, [setGFXProps])

  const parseLinesAndCreateLSystem = useCallback(() => {
      
    let lines = splitLines(currentCode);
    const relevantLines = lines.filter((line) => !lineIsComment(line) && line !== "\n");
    const linesNoWhitespace = relevantLines.map((line) => line.replace(/\s/g, ""))
    const currentLines = linesNoWhitespace;

    if (currentLines.length < 1) { 
      console.log(currentLines);
      const noAxiomError = new Error("An LSystem needs at least one axiom"); 
      setStatus({ state: "error", errors: [ noAxiomError] })
    } else {
      
      let errors: Error[] = []; 
      let status = "ready";

      let axiomLine = currentLines[0];
      try {
        parseAxiom(axiomLine);
      } catch (e) {
        status = "error"
        errors.push(e as Error);
      }
      let productionLines = currentLines.slice(1);
      productionLines.forEach((productionLine) => {
        try {
          parseProduction(productionLine);
        } catch (e) {
          status = "error"
          errors.push(e as Error);
        }
      })
      if (status === "error") {
        setStatus({state: status, errors: errors })
      } else {
        // @ts-ignore: Ignoring let error.
        setStatus({state: "ready"});
        createLSystem({axiom: axiomLine, productions: productionLines, iterations: gfxProps.iterations}); 
      }
    }
  }, [createLSystem, currentCode, gfxProps.iterations])
  
  const runLS = useCallback(() => {
    // console.log("Time to run L-System");
    if (lSystemNeedsReset.current) {
      // console.log("recreating LS");
      parseLinesAndCreateLSystem();
      lSystemNeedsReset.current = false;
    }
    if (gfxPropsNeedsReset.current) {
      // console.log("recreating GFX");
      onGFXPropsUpdate(gfxProps);
      gfxPropsNeedsReset.current = false;
    }
  }, [gfxProps, onGFXPropsUpdate, parseLinesAndCreateLSystem])

  const updateCurrentCode = useCallback((newCode: string) => {
    setCurrentCode(newCode);
    lSystemNeedsReset.current = true; 
    if (firstRun.current) {
      firstRun.current = false;
      runLS();
    }
  }, [setCurrentCode, runLS])



  const copyCurrentCode = useCallback( () => {
    let copyString = window.location.origin + "/edit" + encodeParams(currentCode, gfxProps);
    //console.log("COPYING CURRENT CODE AND GFXPROPS to " + copyString, currentCode, gfxProps);
    copy(copyString); 
    alert("Copied");
  }, [currentCode, gfxProps])

  const saveCurrentCodeLocally = useCallback(() => {
    const currentFavoriteString = localStorage.getItem("favorites");
    const currentFavorites = currentFavoriteString ? JSON.parse(currentFavoriteString) : {};
    currentFavorites[Date.now() + ''] = createFave(currentCode, gfxProps);
    localStorage.setItem("favorites", JSON.stringify(currentFavorites));
  }, [currentCode, gfxProps]); 

  return (
    <div className={`stack no-gap ${className}`}>
      <div className="horizontal-stack edit-surface toolbar border-bottom">
        <span className="clickable" onClick={() => runLS()}>
          Run LS
        </span>
        <span className="clickable" onClick={() => copyCurrentCode()}>
          Share
        </span>
        <span className="clickable" onClick={() => saveCurrentCodeLocally()}>
          Save to favorites
        </span>
      </div>
      <LSCodeEditor style={{flex: 2}} initialCode={currentCode} onCodeWasEdited={updateCurrentCode} className="edit-surface-light-tone border-bottom padded"/>
      <GFXPropsCustomizer gfxProps={completeGfxProps(initGFXProps)} GFXPropsUpdated={updateCurrentGFXProps} className="edit-surface-light-tone border-bottom padded" />
      <LSConsole status={status} className={"edit-surface-gray-tone padded console-height"} />
    </div>
  );
};
