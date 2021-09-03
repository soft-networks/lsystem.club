

import LSystem, { Axiom, parseAxiom, parseProduction, Production } from "@bvk/lsystem"
import React, { useCallback, useState } from "react"
import { useEffect } from "react";
import {completeGfxProps, GFXProps, GFXPropsComplete, LSProps, LSStatus} from "../utils"
import { createLSInWorker } from "../worker";
import LSConsole from "./LSStatusConsole";
import LSCodeEditor from "./LSCodeEditor";
import { GFXPropsCustomizer } from "./LSGFXEditor";

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

  const runCurrentLSystem = useCallback((lsProps) => {
    console.log("Gonna run current LS");
    try {
      setStatus({ state: "compiling" });
      createLSInWorker(lsProps).then((updatedLS) => {
        setLSystem(updatedLS);
        setStatus({ state: "compiled" });
      });
    } catch (e) {
      setStatus({ state: "error", errors: [e] });
    }
  }, []);

  useEffect(() => {
    if (lSystem)
      onLSReset(lSystem);
  }, [lSystem])

  const runLS = () => {
    if (currentLines.length < 1) {
      const noAxiomError = new Error("An LSystem needs at least one axiom and a production"); 
      setStatus({ state: "error", errors: [ noAxiomError] })
    } else {
      
      let errors = []; 
      let status = "ready";

      let axiomLine = currentLines[0];
      try {
        parseAxiom(axiomLine);
      } catch (e) {
        status = "error"
        errors.push(e);
      }
      let productionLines = currentLines.slice(1);
      productionLines.forEach((productionLine) => {
        try {
          parseProduction(productionLine);
        } catch (e) {
          status = "error"
          errors.push(e);
        }
      })
      if (status === "error") {
        setStatus({state: status, errors: errors })
      } else {
        // @ts-ignore: Ignoring let error.
        setStatus({state: "ready"});
        runCurrentLSystem({axiom: axiomLine, productions: productionLines, iterations: gfxProps.iterations}); 
      }
    }
  }

  return (
    <div>
      <div>
        <span className="clickable" onClick={() => runLS()}>
          Run LS
        </span>
      </div>
      <LSCodeEditor initialCode={initCode} onCodeWasEdited={setCurrentLines} />
      <LSConsole status={status} />
      <GFXPropsCustomizer
        gfxProps={completeGfxProps(initGFXProps)}
        GFXPropsUpdated={(gfxProps) => setGFXProps(completeGfxProps(gfxProps))}
      />
    </div>
  );
};
