import {useRef} from "react";
import isEqual from "react-fast-compare";

class ObjHistory {
  constructor(obj) {
    if (obj === undefined) this.history = [];
    else if (Array.isArray(obj)) this.history = [...obj];
    else this.history = [obj];

    this.index = this.history.length - 1;
    if (this.index < 0) this.index = undefined;
  }

  push(newObj, duplicate=false) {
    if (newObj === undefined) return undefined;

    if (!duplicate && isEqual(this.history[this.index], newObj)) return newObj;

    this.history = this.history.slice(0, this.index + 1)
    this.history.push(newObj);
    if (this.index === undefined) this.index = 0;
    else this.index++;

    return newObj;
  }

  step(numSteps=-1) {
    if (this.index === undefined) return undefined;

    const newIndex = this.index + numSteps;
    this.index = Math.min(this.history.length - 1, Math.max(newIndex, 0))
    return this.history[this.index];
  }

  check(first=true) {
    if (this.index === undefined) return true;
    if (first) return this.index === 0;
    else return this.index === this.history.length - 1;
  }
}

function useObjHistory(initObj) {
  const history = useRef(new ObjHistory(initObj));

  return [
    (newObj) => history.current.push(newObj),
    (numSteps) => history.current.step(numSteps),
    (first) => history.current.check(first),
  ];
}

export default useObjHistory;