import * as React from "react";

export type CB = () => Promise<number> | any;

export type IChannel = {
  add: (cb: CB, priority: number, ref: any) => any;
  remove: (cb: CB) => void;
  replace: (q: any, cb: CB, priority: number, ref: any) => any;
  reset: () => any
}

export type IPromisedCallback = {
  executed: boolean,
  active: boolean,
  done:(timeShift?:number) => any,
  forwardRef: (ref: HTMLElement)=>any
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

  children: (props:IPromisedCallback) => React.ReactNode;
}

export interface Q {
  cb: CB;
  priority: number;
  sortOrder: number;
  ref?: HTMLElement;
  executed: boolean;
}

export interface ISchedulerProps {
  children: (channel: IChannel) => React.ReactNode;
  stepDelay: number;
  observe?: string | number | boolean;
  source?: (q: Q) => number;
}