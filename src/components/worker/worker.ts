/* ./worker/worker.ts */

import LSystem from "@bvk/lsystem";

export function processData(data: string): string {

  // Process the data without stalling the UI
  let ls = new LSystem("a", ["a:ba"], 10)
  let result = ls.iterate();
  return result;
}