import * as React from "react";

export type CB = () => Promise<number> | any;

export type IChannel = {
  add: (cb: CB, priority: number, ref: any) => any;
  remove: (cb: CB) => void;
  replace: (q: any, cb: CB, priority: number, ref: any) => any;
  reset: () => any;
}

export type IPromisedCallback = {
  executed: boolean;
  active: boolean;
  fired: boolean;
  done: (timeShift?: number) => boolean;
  forwardRef: React.Ref<any>;
};

export interface IQueueProps {
  priority?: number;
  channel: IChannel;
  callback: CB;
  children?: React.ReactElement<any>;
  disabled?: boolean;
}

export interface IPromisedProps {
  priority?: number;
  channel: IChannel;
  disabled?: boolean;
  autoexecuted?: boolean | number;

  children: (props: IPromisedCallback) => React.ReactNode;
}

export interface Q {
  cb: CB;
  index: number;
  priority: number;
  sortOrder: number;
  ref?: HTMLElement;
  executed: boolean;
}

export interface ISchedulerProps {
  children: (channel: IChannel) => React.ReactNode;
  stepDelay: number;
  reverse?: boolean;
  observe?: string | number | boolean;
  withSideEffect?: boolean;
  source?: (q: Q) => number;
  onEmptyQueue?: () => any;
  noInitialDelay?: boolean;
  disabled?: boolean;
}