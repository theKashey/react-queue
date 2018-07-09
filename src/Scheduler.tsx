import * as React from "react";
import {CB, IChannel, ISchedulerProps, Q} from "./Types";

export class Scheduler extends React.Component<ISchedulerProps, {
  recalculate: number;
}> {

  state = {
    recalculate: 0
  };

  private queue: Q[] = [];
  private timeout: number = 0;
  private sortOnQ: boolean = false;

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  componentDidUpdate(props: ISchedulerProps) {
    if (this.props.observe !== props.observe) {
      this.update();
    }
  }

  update() {
    this.sortOnQ = true;
    this.scheduleQ(this.props.stepDelay);
  }

  scheduleQ(when: number) {
    if (!this.timeout) {
      this.timeout = window.setTimeout(() => {
        this.timeout = 0;
        if (this.sortOnQ) {
          this.sortQ();
        }
        this.executeQ();
      }, when)
    }
  }

  add = (cb: CB, priority: number, ref: any) => {
    const q = {cb, priority, sortOrder: priority, ref, executed: false};
    this.queue.push(q);
    this.update();
    return q;
  };

  remove = (q: any) => {
    const index = this.queue.indexOf(q);
    if (index > 0) {
      this.queue.splice(index, 1);
    }
  };

  replace = (q: any, cb: CB, priority: number, ref: any) => {
    const changedPriority = q.priority !== priority;
    const changedRef = q.ref !== ref;
    q.cb = cb;
    q.priority = priority;
    q.ref = ref;
    if (changedPriority || changedRef) {
      this.update();
    }
    return q;
  };

  reset = () => {
    this.queue.forEach(q => q.executed = false);
    this.update();
  }

  channel: IChannel = {
    add: this.add,
    remove: this.remove,
    replace: this.replace,
    reset: this.reset,
  };

  sortQ() {
    if (this.props.source) {
      this.queue.forEach(q => q.sortOrder = this.props.source!(q));
    } else {
      this.queue.forEach(q => q.sortOrder = q.priority);
    }
    this.queue.sort((a, b) => a.sortOrder - b.sortOrder)
  }

  nextQ() {
    return this.queue.filter(
      ({executed, priority, sortOrder}) => !executed && sortOrder<Infinity && priority<Infinity
    )[0]
  }

  executeQ() {
    const q = this.nextQ();
    if (q) {
      q.executed = true;
      Promise.resolve(q.cb())
        .then(result => {
          const dt = (typeof result === "number" ? result : 0) || 0;
          const when = Math.max(0, this.props.stepDelay + dt);
          this.scheduleQ(when);
        })
    }
  }

  render() {
    return this.props.children(this.channel);
  }
}
