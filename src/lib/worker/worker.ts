/* ./worker/worker.ts */

import LSystem, { Axiom } from "@bvk/lsystem";
import { LSProps } from "../../lib/utils";


//Just a simple test function
export function processData(data: string): string {

  // Process the data without stalling the UI
  let ls = new LSystem("a", ["a:ba"], 10)
  let result = ls.iterate();
  return result;
}

export function createLSOffThread(data: LSProps): Axiom[] {
  let ls = new LSystem(data.axiom, data.productions, data.iterations)
  ls.iterate();
  return ls.getAllIterationsAsObject()
}

export function iterateLSOffThread(ls: LSystem): Axiom {
  ls.iterate();
  const result = ls.getIterationAsObject();
  return result;
}