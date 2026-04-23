import { useRef } from 'react';
import isEqual from 'react-fast-compare';

class ObjHistory<T> {
  history: T[];

  index: number | undefined;

  constructor(obj?: T | T[]) {
    if (obj === undefined) this.history = [];
    else if (Array.isArray(obj)) this.history = [...obj];
    else this.history = [obj];

    this.index = this.history.length - 1;
    if (this.index < 0) this.index = undefined;
  }

  push(newObj: T | undefined, duplicate = false): T | undefined {
    if (newObj === undefined) return undefined;

    if (!duplicate && isEqual(this.history[this.index ?? 0], newObj)) return newObj;

    this.history = this.history.slice(0, (this.index ?? -1) + 1);
    this.history.push(newObj);
    if (this.index === undefined) this.index = 0;
    else this.index++;

    return newObj;
  }

  step(numSteps = -1): T | undefined {
    if (this.index === undefined) return undefined;

    const newIndex = this.index + numSteps;
    this.index = Math.min(this.history.length - 1, Math.max(newIndex, 0));
    return this.history[this.index];
  }

  check(first = true): boolean {
    if (this.index === undefined) return true;
    if (first) return this.index === 0;
    return this.index === this.history.length - 1;
  }
}

function useObjHistory<T>(initObj?: T | T[]): [(newObj: T | undefined) => T | undefined, (numSteps?: number) => T | undefined, (first?: boolean) => boolean] {
  const history = useRef(new ObjHistory(initObj));

  return [
    (newObj: T | undefined) => history.current.push(newObj),
    (numSteps?: number) => history.current.step(numSteps),
    (first?: boolean) => history.current.check(first),
  ];
}

export default useObjHistory;
