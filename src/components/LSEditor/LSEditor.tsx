

import LSystem, {  parseAxiom, parseProduction } from "@bvk/lsystem"
import React, { useCallback, useState } from "react"
import { useEffect } from "react";
import {completeGfxProps, decodeParams, encodeParams, GFXProps, GFXPropsComplete, LSProps, LSStatus} from "../utils"
import { createLSInWorker } from "../worker";
import LSConsole from "./LSStatusConsole";
import LSCodeEditor from "./LSCodeEditor";
import { GFXPropsCustomizer } from "./LSGFXEditor";
import { useRef } from "react";
import { lineIsComment, splitLines } from "./codeSyntax";
import copy from "copy-to-clipboard"

interface LSEditorProps {
  onLSReset(LS: LSystem): void;
  onLSIterated(LS: LSystem): void;
  onGFXPropsUpdate(gfxProps: GFXProps): void;
  initCode?: string
  initGFXProps?: GFXProps
}


export const LSEditor: React.FunctionComponent<LSEditorProps> = ({
  onLSReset,
  onLSIterated,
  onGFXPropsUpdate,
  initCode,
  initGFXProps,
}) => {
  const [lSystem, setLSystem] = useState<LSystem>();
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [status, setStatus] = useState<LSStatus>();
  const [gfxProps, setGFXProps] = useState<GFXPropsComplete>(completeGfxProps(initGFXProps));
  const [currentCode, setCurrentCode] = useState<string>(initCode || "");

  const lSystemNeedsReset = useRef<boolean>(true);
  const gfxPropsNeedsReset = useRef<boolean>(true);

  useEffect(() => {
    if (lSystem)
      onLSReset(lSystem);
  }, [lSystem, onLSReset])

  const updateCurrentCode = useCallback((newCode: string) => {
    setCurrentCode(newCode);
    
    let lines = splitLines(newCode);
    const relevantLines = lines.filter((line) => !lineIsComment(line) && line !== "\n");
    const linesNoWhitespace = relevantLines.map((line) => line.replace(/\s/g, ""))

    setCurrentLines((prev) => {
      lSystemNeedsReset.current = true; 
      return linesNoWhitespace;
    });

  }, [setCurrentCode, setCurrentLines])
  

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

  const runLS = () => {
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
  }

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

  const parseLinesAndCreateLSystem = () => {
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
  }

  const copyCurrentCode = useCallback( () => {
    let copyString = window.location.origin + "/edit" + encodeParams(currentCode, gfxProps);
    console.log("COPYING CURRENT CODE AND GFXPROPS to " + copyString, currentCode, gfxProps);
    copy(copyString); 
    alert("Copied");
  }, [currentCode, gfxProps])

  return (
    <div>
      <div>
        <span className="clickable" onClick={() => runLS()}>
          Run LS
        </span>
        <span className="clickable" onClick={() => copyCurrentCode()}> Share </span>
      </div>
      <LSCodeEditor initialCode={initCode} onCodeWasEdited={updateCurrentCode} className="black-border" />
      <GFXPropsCustomizer
        gfxProps={completeGfxProps(initGFXProps)}
        GFXPropsUpdated={updateCurrentGFXProps}
      />
      <LSConsole status={status} />
    </div>
  );
};
