import * as React from "react";
import {CB, IChannel, ISchedulerProps, Q} from "./Types";

const diff = (a: Q, b: Q): number => {
  const pd = a.sortOrder - b.sortOrder;
  if (pd) {
    return pd;
  }
  return a.index - b.index;
};

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
    if (
      this.props.observe !== props.observe ||
      this.props.reverse !== props.reverse ||
      this.props.disabled !== props.disabled
    ) {
      this.update();
    }
  }

  update() {
    this.sortOnQ = true;
    this.scheduleQ(
      this.props.noInitialDelay && this.noExecutedTask()
        ? 0
        : this.props.stepDelay
    );
  }

  scheduleQ(when: number) {
    if (!this.timeout && !this.props.disabled) {
      this.timeout = window.setTimeout(() => {
        this.timeout = 0;
        if (this.sortOnQ) {
          this.sortOnQ = false;
          this.sortQ();
        }
        this.executeQ();
      }, when)
    }
  }

  add = (cb: CB, priority: number, ref: any) => {
    const q = {
      cb,
      priority,
      index: this.queue.length,
      sortOrder: priority,
      ref,
      executed: false
    };
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
    if (q) {
      const changedPriority = q.priority !== priority;
      const changedRef = q.ref !== ref;
      q.cb = cb;
      q.priority = priority;
      q.ref = ref;
      if (changedPriority || changedRef) {
        this.update();
      }
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
      this.queue.forEach(q => q.sortOrder = q.priority < Infinity ? this.props.source!(q) : q.priority);
    } else {
      this.queue.forEach(q => q.sortOrder = q.priority);
    }
    if (this.props.reverse) {
      this.queue.sort((a, b) => diff(b, a))
    } else {
      this.queue.sort((a, b) => diff(a, b))
    }
  }

  nextQ() {
    return this.queue.filter(
      ({executed, priority, sortOrder}) => !executed && sortOrder < Infinity && priority < Infinity
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
          if (this.props.withSideEffect) {
            this.setState({
              recalculate: 1
            })
          }
        })
    } else {
      this.props.onEmptyQueue && this.props.onEmptyQueue()
    }
  }

  noExecutedTask() {
    return !this.queue.find( x => x.executed);
  }

  render() {
    return this.props.children(this.channel);
  }
}
