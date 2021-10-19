import React, { CSSProperties, useCallback, useMemo, useRef, useState } from "react";
import LSystem, { Axiom } from "@bvk/lsystem";
import { completeGfxProps, GFXProps, renderTypes } from "../../lib/utils";
import LSImageViewer2D from "./LSImageViewer/LSImageViewer2D";
import LSImageViewer3D from "./LSImageViewer/LSImageViewer3D";
import { useEffect } from "react";
import { LSTextViewer } from ".";
import ReactDropdown from "react-dropdown";
import RangeSlider from "../ui/RangeSlider";
import { useHotkeys } from "react-hotkeys-hook";
import useMeasure from "react-use-measure";

interface LSViewerControllerProps {
  lSystem: LSystem;
  gfxProps?: GFXProps;
  autoResize?: boolean;
  className?: string
  style?: CSSProperties
  hideControls?: boolean
}

const viewerTypeDropdownOptions: { value: renderTypes; label: string }[] = [
  { value: "auto", label: "Image: Auto" },
  { value: "2d", label: "Image: 2D" },
  { value: "3d", label: "Image: 3D" },
  { value: "text", label: "Text" },
];

/**
 * Component to manage viewing an LSystem as an image.
 * NOTE: IF the Lsystem has not been "iterated", this component will iterate it on the main thread. It is recommended to iterate before initializing component
 * @param props
 * @returns
 */
const LSViewerController: React.FunctionComponent<LSViewerControllerProps> = (props) => {
  //State to  update renderers
  const [viewerType, setViewerType] = useState<renderTypes>(extractViewerTypeFromProps(props.gfxProps));
  const [currentAxiom, setCurrentAxiom] = useState<Axiom>();
  const [allCurrentAxioms, setAllCurrentAxioms] = useState<Axiom[]>();
  const [currentIteration, setCurrentIteration] = useState<number>(props.lSystem.iterations);
  const [currentGFXProps, setCurrentGFXProps] = useState<GFXProps>(props.gfxProps || {});
  useHotkeys("ctrl+/, command+/", () => { currentlyAnimating.current ? stopIterationAnimation() : startIterationAnimation(); return false});

  //State to update animations
  const currentlyAnimating = useRef<boolean>(false);
  const activeInterval = useRef<NodeJS.Timeout>();
  const [measureRef, bounds] = useMeasure({debounce: 200})

  //Trigger re-render if the gxfProps, current axiom, or viewer type change
  const currentContainerSize = useMemo(() => {
    if (props.autoResize) {
      return {width: bounds.width, height: bounds.height}
    } else {
      return {}
    }
  }, [props.autoResize, bounds.width, bounds.height])
  const getViewer = useCallback(() => {
    if (currentAxiom) {
      const viewerProps = { gfxProps: completeGfxProps({...currentGFXProps, ...currentContainerSize}), axiom: currentAxiom };
      switch (viewerType) {
        case "2d":
          return <LSImageViewer2D {...viewerProps} key="controller-viewer-2d" />;
        case "3d":
          return <LSImageViewer3D {...viewerProps} key="controller-viewer-3d" />;
        case "text":
          const axiomsAsText = props.lSystem.getAllIterationsAsString();
          return LSTextViewer(axiomsAsText);
        case "auto":
          const autoViewerType = getAutoViewerType(props.lSystem);
          if (autoViewerType === "3d") {
            return <LSImageViewer3D {...viewerProps} key="controller-viewer-3d" />;
          } else {
            return <LSImageViewer2D {...viewerProps} key="controller-viewer-2d" />;
          }
      }
    }
  }, [currentAxiom, currentGFXProps, currentContainerSize, viewerType, props.lSystem]);

  //When the lsystem changes, cancel any anim timers and set current iterations + all current axioms
  useEffect(() => {
    if (activeInterval.current) clearTimeout(activeInterval.current);
    setCurrentIteration(props.lSystem.iterations);
    setAllCurrentAxioms(props.lSystem.getAllIterationsAsObject());
  }, [props.lSystem, props.lSystem.iterations]);

  //When the currentIteration or all current Axioms change, change current axiom (trigger-re-render)
  useEffect(() => {
    if (allCurrentAxioms) setCurrentAxiom(allCurrentAxioms[currentIteration]);
  }, [currentIteration, allCurrentAxioms]);

  //If ls or gfx props change, viewer type may change
  useEffect(() => {
    if (props.gfxProps) {
      const newViewerType = extractViewerTypeFromProps(props.gfxProps);
      setViewerType(newViewerType);
      setCurrentGFXProps(props.gfxProps);
    }
  }, [props.gfxProps]);

  //Helper functions for animations
  const stopIterationAnimation = () => {
    console.log("Anim stop", currentIteration);
    currentlyAnimating.current = false;
  };
  const startIterationAnimation = () => {
    console.log("Anim start");
    currentlyAnimating.current = true;
    setCurrentIteration(0);
  };
  //Animation is just powered by changes to currentIteration.
  //The currentIteration changes itself every x seconds.
  //STOP IF:  the LS changes the iters set to the stopping point OR forced stop
  useEffect(() => {
    if (currentIteration === props.lSystem.iterations || currentlyAnimating.current === false) {
      stopIterationAnimation();
    } else {
      activeInterval.current = setTimeout(
        () => setCurrentIteration(currentIteration + 1),
        props.gfxProps?.animationWaitTime || completeGfxProps(undefined).animationWaitTime
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIteration]);



  return (
    <div className="stack no-gap">
      {!props.hideControls && (
        <div className="toolbar horizontal-stack small edit-surface border-bottom visible-overflow">
          <div>
            <ReactDropdown
              options={viewerTypeDropdownOptions}
              value={viewerType}
              onChange={(opt) => setViewerType(opt.value as renderTypes)}
              arrowClosed={<span>▾</span>}
              arrowOpen={<span>▾</span>}
              controlClassName={"horizontal-stack smaller clickable"}
              menuClassName={"border floating padded edit-surface-light-tone clickable stack"}
            />
          </div>
          <div className="horizontal-stack padded:right ">
            Iteration
            <span style={{ width: "2.2ch", textAlign: "right", display: "inline-block" }}> {currentIteration} </span>
            <div style={{ width: "10ch" }}>
              <RangeSlider
                min={0}
                max={props.lSystem.iterations}
                onChange={(n: number) => {
                  stopIterationAnimation();
                  setCurrentIteration(n);
                }}
                currentValue={currentIteration}
              />
            </div>
          </div>
          <div
            onClick={() => (currentlyAnimating.current ? stopIterationAnimation() : startIterationAnimation())}
            className="clickable minwidth"
          >
            {currentlyAnimating.current ? "stop" : "animate"}{" "}
            <div className="gray subtext padded:left:smallest">(⌘+/)</div>
          </div>
        </div>
      )}
      <div ref={measureRef} className={props.className} style={props.style}>
        {getViewer()}
      </div>
    </div>
  );
};

export default LSViewerController;

// Helper functions to automatically choose character
function charIs3D(l: string) {
  let is3D = l == "&" || l == "^" || l == "/" || l == "\\";
  return is3D;
}
function extractViewerTypeFromProps(gfxProps?: GFXProps): renderTypes {
  if (gfxProps && gfxProps.renderType && !gfxProps.renderType.includes("auto")) {
    if (gfxProps.renderType.includes("text")) return "text";
    if (gfxProps.renderType.includes("2d")) return "2d";
    if (gfxProps.renderType.includes("3d")) return "3d";
  }
  return "auto";
}

function getAutoViewerType(lSystem: LSystem): renderTypes {
  for (let i = 0; i < lSystem.axiom.length; i++) {
    if (charIs3D(lSystem.axiom[i].symbol)) {
      return "3d";
    }
  }
  for (let i = 0; i < lSystem.productions.length; i++) {
    let p = lSystem.productions[i];
    let successors = Array.isArray(p.successor) ? p.successor : [p.successor];
    for (let j = 0; j < successors.length; j++) {
      let s = successors[j];
      for (let k = 0; k < s.letters.length; k++) {
        if (charIs3D(s.letters[k].symbol)) {
          return "3d";
        }
      }
    }
  }
  return "2d";
}
