// eslint-disable-next-line
import Worker from 'comlink-loader!./worker'; // inline loader

import LSystem, { Axiom } from "@bvk/lsystem";
import { LSProps } from "../utils";


export const createLSInWorker = async (lSystemProps: LSProps): Promise<LSystem> => {
  console.log("Creating new worker with props", lSystemProps);
  const instance = new Worker();
  const newLS = new LSystem(lSystemProps.axiom, lSystemProps.productions, lSystemProps.iterations);
  const allIterations : Axiom[] = await instance.createLSOffThread(lSystemProps);
  newLS.outputs = allIterations;
  return newLS
}

export default Worker