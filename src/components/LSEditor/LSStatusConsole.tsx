import { LSStatus } from "../utils";
import React, {useState, useEffect} from "react"

interface LSConsoleProps {
  status?: LSStatus
}

const LSConsole : React.FunctionComponent<LSConsoleProps> = ( {status}) => {
  
  const [ statusLog, setStatusLog] = useState<JSX.Element[]>([]);
  const [ currentStatus, setCurrentStatus] = useState<JSX.Element>( statusToEl(status));

  useEffect(() => {
    const statusEl = statusToEl(status);
    setCurrentStatus(statusEl);
  }, [status])

  return currentStatus;
}

const statusToEl = (status: LSStatus | undefined) : JSX.Element => {
  if (!status) {
    return <div> No status available </div>
  }
  switch (status.state) {
    case "error":
      return <div> <span> Status has error</span> <ul> { status.errors && status.errors.map((err) => <li> {err.message} </li>)} </ul></div> 
    case "compiling":
      return <div> Compiling </div>
    case "compiled":
      return <div> Compiled </div>
    case "ready":
      return <div> About to compile... </div>
    default:
      return <div> idk lol </div>

  }
}

export default LSConsole;