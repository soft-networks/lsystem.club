import React, {useCallback, useRef, useState} from "react";
import LSystem, { Axiom } from "@bvk/lsystem";
import { completeGfxProps, GFXProps, renderTypes } from "../utils";
import LSImageViewer2D from "./LSImageViewer/LSImageViewer2D";
import LSImageViewer3D from "./LSImageViewer/LSImageViewer3D";
import { useEffect } from "react";
import { LSTextViewer } from ".";
import ReactDropdown from "react-dropdown";
import {Range} from "react-range"

interface LSViewerControllerProps {
  lSystem: LSystem,
  gfxProps?: GFXProps,
  autoResize?: boolean,
  changeViewerControls?: boolean
  changeIterationsControls?: boolean
}


const viewerTypeDropdownOptions : {value: renderTypes, label: string}[] = [
  {value: "auto", label: "Image: Auto"},
  {value: "2d", label: "Image: 2D"},
  {value: "3d", label: "Image: 3D"},
  {value: "text", label: "Text"}
]

/**
 * Component to manage viewing an LSystem as an image.
 * NOTE: IF the Lsystem has not been "iterated", this component will iterate it on the main thread. It is recommended to iterate before initializing component
 * @param props 
 * @returns 
 */
const LSViewerController : React.FunctionComponent<LSViewerControllerProps> = (props) => {

  //State to  update renderers
  const [viewerType, setViewerType] = useState<renderTypes>( extractViewerTypeFromProps(props.gfxProps));
  const [currentAxiom, setCurrentAxiom] = useState<Axiom>();
  const [allCurrentAxioms, setAllCurrentAxioms] = useState<Axiom[]>();
  const [currentIteration, setCurrentIteration] = useState<number>(props.lSystem.iterations);
  const [currentGFXProps, setCurrentGFXProps] = useState<GFXProps>(props.gfxProps || {});


  //State to update animations 
  const currentlyAnimating = useRef<boolean>(false);
  const activeInterval = useRef<NodeJS.Timeout>();
  const viewerContainerEl = useRef<HTMLDivElement | null>(null);

  //Controller states
  const [viewerControlsAreVisible, setViewerControlsAreVisible] = useState<boolean>();

  //Trigger re-render if the gxfProps, current axiom, or viewer type change
  const getViewer = useCallback(() => {
    if (currentAxiom) {
      const viewerProps = { gfxProps: completeGfxProps(currentGFXProps), axiom: currentAxiom };
      switch (viewerType) {
        case "2d": 
          return <LSImageViewer2D {...viewerProps} key="controller-viewer-2d" />
        case "3d":
          return <LSImageViewer3D {...viewerProps} key="controller-viewer-3d" />
        case "text": 
          const axiomsAsText = props.lSystem.getAllIterationsAsString();
          return LSTextViewer(axiomsAsText) 
        case "auto":
          const autoViewerType = getAutoViewerType(props.lSystem);
          if (autoViewerType === "3d") {
            return <LSImageViewer3D {...viewerProps} key="controller-viewer-3d" />
          } else {
            return <LSImageViewer2D {...viewerProps} key="controller-viewer-2d" />
          }
      }
    }
  }, [ currentGFXProps, currentAxiom, viewerType, props.lSystem])

  useEffect( () => {
    if (props.autoResize) {
      window.addEventListener("resize", resizeGFXProps);
      resizeGFXProps();
    }
    return () => { window.removeEventListener("resize", resizeGFXProps)}
  }, [props.autoResize])

  //When the lsystem changes, cancel any anim timers and set current iterations + all current axioms
  useEffect( () => {
    console.log("🏠🏠 i am alive")
    if (activeInterval.current) clearTimeout(activeInterval.current);
    setCurrentIteration(props.lSystem.iterations);
    setAllCurrentAxioms(props.lSystem.getAllIterationsAsObject())
  }, [ props.lSystem, props.lSystem.iterations])

  //When the currentIteration or all current Axioms change, change current axiom (trigger-re-render)
  useEffect( () => {
    console.log("🏠🏠🏠🏠🏠🏠🏠🏠🏠🏠 Changing axiom... should re-render")
    if (allCurrentAxioms)
      setCurrentAxiom(allCurrentAxioms[currentIteration]);
  }, [currentIteration, allCurrentAxioms])

  //If ls or gfx props change, viewer type may change
  useEffect(() => {
    const newViewerType = extractViewerTypeFromProps(props.gfxProps) ;
    setViewerType(newViewerType);
  }, [props.gfxProps])

  //Helper functions for animations
  const stopIterationAnimation = () => {
    console.log("Anim stop", currentIteration);
    currentlyAnimating.current = false;
  }
  const startIterationAnimation = () => {
    console.log("Anim start");
    currentlyAnimating.current = true;
    setCurrentIteration(0);
  }
  //Animation is just powered by changes to currentIteration.
  //The currentIteration changes itself every x seconds.
  //STOP IF:  the LS changes the iters set to the stopping point OR forced stop 
  useEffect(() => {
    console.log("Current iteration changed", currentIteration);
    
    if (currentIteration === props.lSystem.iterations || currentlyAnimating.current === false) {
      stopIterationAnimation();
    } else {
      activeInterval.current = setTimeout(() => setCurrentIteration(currentIteration +1), props.gfxProps?.animationWaitTime || completeGfxProps(undefined).animationWaitTime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIteration])

  //Keep canvas size in sync with its container
  const resizeGFXProps = () => {
    if (viewerContainerEl.current) {
      const w = viewerContainerEl.current.offsetWidth;
      const h =  viewerContainerEl.current.offsetHeight;
      const newGfxProps : GFXProps = {...currentGFXProps, width: w, height: h - 12}
      console.log(newGfxProps);
      setCurrentGFXProps(newGfxProps);
    }
  }



  return (
    <div className="stack no-gap" style={{ position: "relative", alignItems: "stretch" }}>
      <div className="toolbar horizontal-stack edit-surface border-bottom visible-overflow">
        {props.changeViewerControls && (
          <div>
            <span className="label"> viewer </span>
            <ReactDropdown
              options={viewerTypeDropdownOptions}
              value={viewerType}
              disabled={!props.changeViewerControls}
              onChange={(opt) => setViewerType(opt.value as renderTypes)}
              arrowClosed={props.changeViewerControls && <span>▾</span>}
              arrowOpen={props.changeViewerControls && <span>▾</span>}
              controlClassName={"horizontal-stack smaller clickable"}
              menuClassName={"border floating padded edit-surface-light-tone clickable stack"}
            />
          </div>
        )}
        {props.changeIterationsControls && (
          <div className="horizontal-stack ">
            <span className="label">iterations</span>
            {currentIteration}
            <Range
              min={0}
              max={props.lSystem.iterations}
              values={[currentIteration]}
              onChange={(value) => {
                stopIterationAnimation();
                setCurrentIteration(value[0]);
              }}
              renderTrack={({ props, children }) => (
                <div {...props} className="input-track edit-surface-gray-tone border">
                  {children}
                </div>
              )}
              renderThumb={({ props }) => <div {...props} className="input-thumb header-surface border" />}
            />
          </div>
        )}
        {currentlyAnimating.current === true ? (
          <div onClick={() => stopIterationAnimation()} className="clickable">
            <span className="label"> animation </span>
            stop
          </div>
        ) : (
          <div onClick={() => startIterationAnimation()} className="clickable">
            <span className="label"> animation </span>
            start
          </div>
        )}
      </div>
      <div ref={(divEl) => (viewerContainerEl.current = divEl)} className={"hide-overflow full-size"}>
        {getViewer()}
      </div>
    </div>
  );
}

export default LSViewerController




// Helper functions to automatically choose character
function charIs3D(l: string) {  
  let is3D = l == "&" || l == "^" || l == "/" || l == "\\";
  return is3D;
}
function extractViewerTypeFromProps(gfxProps?: GFXProps) : renderTypes {
  if (gfxProps && gfxProps.renderType && ! gfxProps.renderType.includes("auto")) {
    if (gfxProps.renderType.includes("text")) 
      return "text"
    if (gfxProps.renderType.includes("2d")) 
      return "2d"
    if (gfxProps.renderType.includes("3d")) 
      return "3d"
  }
  return "auto"
}

function getAutoViewerType(lSystem: LSystem) : renderTypes {
  for (let i =0; i<lSystem.axiom.length; i++) {
    if (charIs3D(lSystem.axiom[i].symbol)) {
      return "3d"
    }
  }
  for (let i =0; i<lSystem.productions.length; i++) {
    let p = lSystem.productions[i];
    let successors = Array.isArray(p.successor) ? p.successor : [p.successor]; 
    for (let j = 0; j<successors.length; j++) {
      let s = successors[j];
      for (let k = 0; k<s.letters.length; k++) {
        if (charIs3D(s.letters[k].symbol)) {
          return "3d"
        }
      }
    }
  }
  return "2d"  
}