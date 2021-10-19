import { LSStatus } from "../../lib/utils";
import React, {useState, useEffect, useCallback, useRef} from "react"

interface LSConsoleProps {
  status?: LSStatus,
  className?: string
}

interface StatusLog {
  timecode: string,
  status: LSStatus
}

const getNow = (): string => {
  return new Date().toLocaleTimeString(undefined, {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}


const LSConsole : React.FunctionComponent<LSConsoleProps> = ( {status, className}) => {
  
  const [ statusLog, setStatusLog] = useState<StatusLog[]>([]);
  //const [ currentStatus, setCurrentStatus] = useState<JSX.Element>( statusToEl(status));

  useEffect(() => {
    if (status) {
      //const statusEl = statusToEl(status);
      //setCurrentStatus(statusEl);

      if (status.state === "compiling") {
        setStatusLog([{timecode: getNow(), status}])
      } else {
        setStatusLog((prev) => [...prev, { timecode: getNow(), status }]);
      }
      
    }
  }, [status])

  return <div className={className}> {statusLog.map((logStatus) => statusToEl(logStatus.status, logStatus.timecode, statusLog[statusLog.length - 1]) )} </div>
}

const statusToEl = (status: LSStatus | undefined, timecode: string, currentStatus: StatusLog) : JSX.Element => {
  let stringEl;
  
  if (!status) {
    stringEl = <div> No status available </div>
  } else {
  switch (status.state) {
    case "error":
      stringEl = (
        <div>
          <span className="red"> Whoops, we have an error!</span>
          <ul>
            {status.errors &&
              status.errors.map((err, i) => (
                <li key={`error-${i}`} >
                  <span>{err.lineNum === "global" ? "" : "Error parsing line: " + err.lineNum}</span>
                  <span>{err.error.message}</span>
                </li>
              ))}
          </ul>
        </div>
      ); 
      break;
    case "compiling":
      stringEl = <div> Generating L-System {currentStatus.status.state === "compiling" ? <ScrollingDots/> : ""} </div>
      break;
    case "compiled":
      stringEl = <div> L-System generated {status.message} </div>
      break;
    case "ready":
      stringEl = <div> Ready to compile </div>
      break;
    case "redrawing":
      stringEl = <div> No changes to L-System, just redrawing </div>
      break;
    default:
      stringEl = <div> idk lol </div>
      break;
  }}
let timecodeEl = timecode ? <span className="gray"> {timecode} </span> : "";
  return <div className="horizontal-stack" > {timecodeEl} {stringEl} </div>
}

const ScrollingDots : React.FunctionComponent = ({}) => {
  const [numDots, setNumDots] = useState<number>(3);

  const incrementDots = useCallback(() => {
    setNumDots((n) => n > 3 ? 0 : n + 1);
  }, [setNumDots])
    
  useEffect(() => {
    const interval  = setInterval(incrementDots, 500);
    return () => {clearInterval(interval)}
  }, [incrementDots])

  const getDots = useCallback(() => {
    let str = "";
    for (var i=0; i <numDots; i++){
      str += "."
    };
    return str;
  }, [numDots]) 

  return (<span> {getDots()}</span>)
}


export default LSConsole;