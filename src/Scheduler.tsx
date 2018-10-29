import * as React from "react";
import {CB, IChannel, IPriority, ISchedulerProps, Q} from "./Types";
import {diff} from "./utils";


export class Scheduler extends React.Component<ISchedulerProps, {
  recalculate: number;
  queue: Q[];
  current: { ref: Q }
}> {

  private queue: Q[] = [];
  private timeout: number = 0;
  private sortOnQ: boolean = false;
  private scheduledCallbacks: Map<any, CB> = new Map();

  state = {
    recalculate: 0,
    queue: this.queue,
    current: {ref: null as any}
  };

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
        const cbs = this.scheduledCallbacks;
        this.scheduledCallbacks = new Map();
        cbs.forEach(cb => cb());

        if (this.sortOnQ) {
          this.sortOnQ = false;
          this.sortQ();
        }
        this.executeQ();
      }, when)
    }
  }

  add = (cb: CB, {priority = 0xFFFFFF, shift = 0}: IPriority, ref: any) => {
    const q: Q = {
      cb,
      priority,
      shift,
      index: this.queue.length,
      sortIndex: 0,
      sortOrder: priority,
      ref,
      executed: false
    };
    q.sortIndex = q.index + q.shift;
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

  replace = (q: any, cb: CB, {priority = 0, shift = 0}: IPriority, ref: any) => {
    if (q) {
      const changedPriority = q.priority !== priority || q.shift !== shift;
      const changedRef = q.ref !== ref;
      q.cb = cb;
      q.priority = priority;
      q.shift = shift;
      q.sortIndex = q.index + q.shift;
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
  };

  schedule = (ref: any, cb: CB) => {
    this.scheduledCallbacks.set(ref, cb);
    this.update();
  };

  channel: IChannel = {
    add: this.add,
    remove: this.remove,
    replace: this.replace,
    reset: this.reset,
    schedule: this.schedule
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
    const left = this.queue.filter(
      ({executed, priority, sortOrder}) => !executed && sortOrder < Infinity && priority < Infinity
    );
    return left[0]
  }

  executeQ() {
    const q = this.nextQ();
    this.state.current.ref = { ...(q as any) };
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
    return !this.queue.find(x => x.executed);
  }

  render() {
    return this.props.children(this.channel);
  }
}
