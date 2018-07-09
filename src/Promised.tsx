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
    const {channel, priority, disabled} = this.props;
    this.q = channel.add(this.callback, disabled ? Infinity : (priority || 0), this.ref);
  }

  componentWillUnmount() {
    const {channel} = this.props;
    channel.remove(this.q);
  }

  componentDidUpdate() {
    const {channel, priority, disabled} = this.props;
    channel.replace(this.q, this.callback, disabled ? Infinity : (priority || 0), this.ref);
  }

  callback = () => {
    this.setState({
      active: true
    });
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
    } else {
      console.error('react-queue: trying to finish unstarted Promised')
    }
  }

  render() {
    const {active, executed} = this.state;
    return this.props.children({
      active,
      executed,
      done: this.fulfill,
      forwardRef: this.forwardRef
    })
  }
}
