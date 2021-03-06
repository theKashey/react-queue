import * as React from 'react';
import {IPromisedProps} from "./Types";

interface Deffered {
  p: Promise<any>;
  resolve: (a: any) => any;
  reject: (a: any) => any;
}

interface PromisedState {
  active: boolean,
  executed: boolean,
};

const deffered = () => {
  const d: Deffered = {} as any;
  d.p = new Promise((resolve, reject) => {
    d.resolve = resolve;
    d.reject = reject;
  });
  return d;
};

export class Promised extends React.Component<IPromisedProps, PromisedState> {
  state = {
    active: false,
    executed: false
  };

  private q: any;
  private ref: any;

  private promise = deffered();

  componentDidMount() {
    const {channel, priority = 0xFFFFFF, shift = 0, disabled} = this.props;
    if (!channel) {
      throw new Error('Queue: please provide a channel props');
    }
    this.q = channel.add(
      this.callback, {
        priority: disabled ? Infinity : (priority || 0),
        shift: shift
      },
      this.ref);
  }

  componentWillUnmount() {
    const {channel} = this.props;
    channel.remove(this.q);
  }

  componentDidUpdate() {
    const {channel, priority = 0xFFFFFF, shift = 0, disabled} = this.props;
    channel.replace(
      this.q,
      this.callback, {
        priority: disabled ? Infinity : (priority || 0),
        shift: shift
      },
      this.ref
    );
  }

  callback = () => {
    this.setState({
      active: true
    });
    const {autoexecuted} = this.props;
    if (autoexecuted) {
      this.fulfill(autoexecuted);
    }
    return this.promise.p;
  };

  forwardRef = (ref: any) => {
    this.ref = ref;
    this.componentDidUpdate();
  };

  fulfill = (a: any) => {
    if (this.state.active) {
      this.setState({
        executed: true,
        active: false,
      });
      this.promise.resolve(a);
    } else if (this.state.executed) {
      console.error('react-queue: trying to finish finished Promised')
      return false;
    } else {
      console.error('react-queue: trying to finish unstarted Promised')
      return false;
    }
    return true;
  };

  render() {
    const {active, executed} = this.state;
    return this.props.children({
      active,
      executed,
      fired: active || executed,
      done: this.fulfill,
      forwardRef: this.forwardRef
    }) || null
  }
}
