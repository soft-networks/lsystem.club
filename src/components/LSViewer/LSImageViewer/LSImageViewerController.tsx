import React, {useCallback, useRef, useState} from "react";
import LSystem, { Axiom } from "@bvk/lsystem";
import { completeGfxProps, GFXProps, P5CanvasType, renderTypes } from "../../utils";
import LSImageViewer2D from "./LSImageViewer2D";
import LSImageViewer3D from "./LSImageViewer3D";
import { useEffect } from "react";
import { createImportSpecifier } from "typescript";


interface LSImageViewerControllerProps {
  lSystem: LSystem,
  gfxProps?: GFXProps,
  animationEnabled?: boolean,
  swaprenderStyleEnabled?: boolean
}

type ImageRenderTypes = "2d" | "3d";


const getViewerType = (lSystem: LSystem, gfxProps?: GFXProps) : ImageRenderTypes => {
  if (gfxProps && gfxProps.renderType) {
    if (gfxProps.renderType.includes("2d")) 
      return "2d"
    if (gfxProps.renderType.includes("3d")) 
      return "3d"
  }
  let iterationString = lSystem.getIterationAsString();
  if (iterationString.match(`.*[&^\\\/].*`)) {
    console.log("Is 3d");
    return "3d";
  } else {
    return "2d"
  }
}
const LSImageViewerController : React.FunctionComponent<LSImageViewerControllerProps> = (props) => {

  const [viewerType, setViewerType] = useState<ImageRenderTypes>( getViewerType(props.lSystem, props.gfxProps));
  const [currentAxiom, setCurrentAxiom] = useState<Axiom>(props.lSystem.getIterationAsObject())
  const [allCurrentAxioms, setAllCurrentAxioms] = useState<Axiom[]>(props.lSystem.getAllIterationsAsObject())
  const [currentIteration, setCurrentIteration] = useState<number>(props.lSystem.iterations);

  const currentlyAnimating = useRef<boolean>(false);
  const activeInterval = useRef<NodeJS.Timeout>();

  //Trigger re-render if the gxfProps, current axiom, or viewer type change
  const getViewer = useCallback(() => {
    const viewerProps = { gfxProps: completeGfxProps(props.gfxProps), axiom: currentAxiom}
    return viewerType === "3d" ? <LSImageViewer2D {...viewerProps} />: <LSImageViewer3D {...viewerProps} />
  }, [ props.gfxProps, currentAxiom, viewerType])

  //When the lsystem changes, cancel any anim timers and set current iterations + all current axioms
  useEffect( () => {
    if (activeInterval.current) clearTimeout(activeInterval.current);
    setCurrentIteration(props.lSystem.iterations);
    setAllCurrentAxioms(props.lSystem.getAllIterationsAsObject())
  }, [ props.lSystem, props.lSystem.iterations])

  //When the currentIteration or all current Axioms change, change current axiom (trigger-re-render)
  useEffect( () => {
    console.log("Changing axiom... should re-render")
    setCurrentAxiom(allCurrentAxioms[currentIteration]);
  }, [currentIteration, allCurrentAxioms])

  //If ls or gfx props change, viewer type may change
  useEffect(() => {
    const newViewerType = getViewerType(props.lSystem, props.gfxProps);
    setViewerType(newViewerType);
  }, [props.lSystem, props.gfxProps])


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



  return (
    <div>
      viewer: {viewerType} , iterations: {currentIteration}, animate:
      {currentlyAnimating.current === true ? (
        <span onClick={() => stopIterationAnimation()} className="clickable"> stop </span>
      ) : (
        <span onClick={() => startIterationAnimation()} className="clickable"> start </span>
      )}
      {getViewer()}
    </div>
  );
}

export default LSImageViewerController
// const viewerType = getViewerType(props.lSystem, props.gfxProps)
// const viewerProps = { gfxProps: completeGfxProps(props.gfxProps) , axiom: props.lSystem.getIterationAsObject()}

// return (
//   <div>
//     viewer: {viewerType}
//     iterations: { props.lSystem.iterations}
//     {viewerType === "3d" ? <LSImageViewer3D {...viewerProps} /> : <LSImageViewer2D {...viewerProps}/>  }

//   </div>
// )