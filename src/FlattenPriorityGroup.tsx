import * as React from "react";
import {CB, IChannel, IGroupProps, IPriority} from "./Types";
import {diff} from "./utils";

export class FlattenPriorityGroup extends React.Component<IGroupProps> {

  private queue: any[] = [];

  componentDidUpdate(oldProps: IGroupProps) {
    if (oldProps.disabled && !this.props.disabled) {
      this.update();
    }
  }

  add = (cb: CB, {priority = 0xFFFFFF, shift = 0}: IPriority, ref: any) => {
    const q: any = {
      cb,
      ref,
      priority,
      shift,
      index: this.queue.length,
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
      this.props.channel.remove(q.q);
    }
  };

  replace = (q: any, cb: CB, {priority = 0xFFFFFF, shift = 0}: IPriority, ref: any) => {
    if (q) {
      const changedPriority = q.priority !== priority || q.shift !== q.shift;
      const changedRef = q.ref !== ref;
      q.cb = cb;
      q.priority = priority;
      q.shift = shift;
      q.sortIndex = q.index + q.shift;
      q.ref = ref;
      if (changedPriority || changedRef) {
        q.update = true;
        this.update();
      }
    }
    return q;
  };

  reset = () => {
    this.props.channel.reset();
  };

  schedule = (ref: any, cb: any) => {
    this.props.channel.schedule(ref, cb);
  };

  channel: IChannel = {
    add: this.add,
    remove: this.remove,
    replace: this.replace,
    reset: this.reset,
    schedule: this.schedule,
  };

  update() {
    if (this.props.disabled) {
      return;
    }
    const {channel, shift = 0, priority: blockPriority} = this.props;
    channel.schedule(this, () => {
      this.sortQ();
      this.queue.forEach((q, index) => {
        if (q.index0 !== index || q.update || !q.q) {
          const {cb, index0, ref, priority: qPriority} = q;
          const priority = qPriority < Infinity ? blockPriority : qPriority;
          q.update = false;
          if (q.q) {
            channel.replace(q.q, cb, {priority, shift: index0 - index + shift}, ref);
          } else {
            q.q = channel.add(q.cb, {priority, shift: shift}, ref);
            q.index0 = index;
          }
        }
      });
    });
  }

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

  render() {
    return this.props.children(this.channel);
  }
}
