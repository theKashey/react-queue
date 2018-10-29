import * as React from 'react';
import {IQueueProps} from "./Types";

export class Queue extends React.Component<IQueueProps> {
  private q: any;
  private ref: any;

  componentDidMount() {
    const {channel, callback, priority = 0xFFFFFF, shift = 0, disabled} = this.props;
    if (!channel) {
      throw new Error('Queue: please provide a channel props');
    }
    this.q = channel.add(
      callback, {
        priority: disabled ? Infinity : (priority || 0),
        shift: shift
      }, this.ref);
  }

  componentWillUnmount() {
    const {channel} = this.props;
    channel.remove(this.q);
  }

  componentDidUpdate() {
    const {channel, callback, priority = 0xFFFFFF, shift = 0, disabled} = this.props;
    channel.replace(
      this.q,
      callback, {
        priority: disabled ? Infinity : (priority || 0),
        shift: shift
      },
      this.ref
    );
  }

  setRef = (ref: any) => this.ref = ref;

  render() {
    return this.props.children
      ? React.cloneElement(React.Children.only(this.props.children), {ref: this.setRef})
      : null;
  }
}
