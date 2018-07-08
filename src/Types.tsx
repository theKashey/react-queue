import * as React from "react";

export type CB = () => Promise<number> | any;

export type IChannel = {
  add: (cb: CB, priority: number, ref: any) => any;
  remove: (cb: CB) => void;
  replace: (q: any, cb: CB, priority: number, ref: any) => any;
  reset: () => any
}

export interface IQueueProps {
  priority?: number;
  channel: IChannel;
  callback: CB;
  children?: React.ReactElement<any>;
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