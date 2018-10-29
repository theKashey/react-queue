import * as React from "react";

export type CB = () => Promise<number> | any;

export interface IPriority {
  priority?: number;
  shift?: number,
}

export type IChannel = {
  add: (cb: CB, priority: IPriority, ref: any) => any;
  remove: (cb: CB) => void;
  replace: (q: any, cb: CB, priority: IPriority, ref: any) => any;
  reset: () => any;
  schedule: (ref: any, cb: () => any) => any;
}

export type IPromisedCallback = {
  executed: boolean;
  active: boolean;
  fired: boolean;
  done: (timeShift?: number) => boolean;
  forwardRef: React.Ref<any>;
};

export interface IQueueProps extends IPriority {
  channel: IChannel;
  callback: CB;
  children?: React.ReactElement<any>;
  disabled?: boolean;
}

export interface IPromisedProps extends IPriority {
  channel: IChannel;
  disabled?: boolean;
  autoexecuted?: boolean | number;

  children: (props: IPromisedCallback) => React.ReactNode;
}

export interface Q {
  cb: CB;
  index: number;
  priority: number;
  shift: number;
  sortIndex: number;
  sortOrder: number;
  ref?: HTMLElement;
  executed: boolean;
}

export interface IGroupProps extends IPriority{
  channel: IChannel;
  disabled?: boolean;
  source?: (q: Q) => number;
  reverse?: boolean;
  children: (channel: IChannel) => React.ReactNode;
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