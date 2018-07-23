import * as React from 'react';
import {mount} from 'enzyme';
import {Promised, Queue, Scheduler} from "../src";

describe('Queue', () => {
  it('Ordered Queue', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler stepDelay={1} onEmptyQueue={() => {
        expect(set).toEqual([1, 2, 3]);
        done();
      }}>
        {channel => (
          <div>
            <Queue channel={channel} callback={() => set.push(1)}/>
            <Queue channel={channel} callback={() => set.push(2)}/>
            <Queue channel={channel} callback={() => set.push(3)}/>
          </div>
        )}
      </Scheduler>
    );
  });

  it('Reverse Ordered Queue', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler stepDelay={1} reverse onEmptyQueue={() => {
        expect(set).toEqual([3, 2, 1]);
        done();
      }}>
        {channel => (
          <div>
            <Queue channel={channel} callback={() => set.push(1)}/>
            <Queue channel={channel} callback={() => set.push(2)}/>
            <Queue channel={channel} callback={() => set.push(3)}/>
          </div>
        )}
      </Scheduler>
    );
  });

  it('Nested Ordered Queue', (done) => {
    const set: number[] = [];
    const Render: React.SFC<{ children: () => React.ReactNode }> = ({children}) => <div>{children()}</div>
    const Q = ({channel}:{channel:any}) => <Queue channel={channel} callback={() => set.push(2)}/>
    const QQ = ({channel}:{channel:any}) => (
      <Render>
        { () => <Q channel={channel} />}
      </Render>
    );
    mount(
      <Scheduler stepDelay={1} onEmptyQueue={() => {
        expect(set).toEqual([1, 2, 3]);
        done();
      }}>
        {channel => (
          <div>
            <div>
              <div>
                <Queue channel={channel} callback={() => set.push(1)}/>
              </div>
            </div>
            <Render>
              {() =>
                <QQ channel={channel}/>
              }
            </Render>
            <Queue channel={channel} callback={() => set.push(3)}/>
          </div>
        )}
      </Scheduler>
    );
  });

  it('P-Ordered Queue', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler stepDelay={1} onEmptyQueue={() => {
        expect(set).toEqual([1, 3, 2]);
        done();
      }}>
        {channel => (
          <div>
            <Queue channel={channel} priority={1} callback={() => set.push(1)}/>
            <Queue channel={channel} priority={3} callback={() => set.push(2)}/>
            <Queue channel={channel} priority={2} callback={() => set.push(3)}/>
          </div>
        )}
      </Scheduler>
    );
  });

  it('Dynamic Ordered Queue', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler
        withSideEffect
        stepDelay={1}
        onEmptyQueue={() => {
          expect(set).toEqual([1, 2, 3, 4]);
          done();
        }}>
        {channel => (
          <div>
            <Queue channel={channel} priority={1} callback={() => set.push(1)}/>
            <Queue channel={channel} priority={set.length == 0 ? 30 : 1} callback={() => set.push(2)}/>
            <Queue channel={channel} priority={set.length == 0 ? 20 : 2} callback={() => set.push(3)}/>
            <Queue channel={channel} priority={set.length == 0 ? 10 : 3} callback={() => set.push(4)}/>
          </div>
        )}
      </Scheduler>
    );
  });

  it('No sideEffect Dynamic Ordered Queue', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler
        stepDelay={1}
        onEmptyQueue={() => {
          expect(set).toEqual([1, 4, 3, 2]);
          done();
        }}>
        {channel => (
          <div>
            <Queue channel={channel} priority={1} callback={() => set.push(1)}/>
            <Queue channel={channel} priority={set.length == 0 ? 30 : 1} callback={() => set.push(2)}/>
            <Queue channel={channel} priority={set.length == 0 ? 20 : 2} callback={() => set.push(3)}/>
            <Queue channel={channel} priority={set.length == 0 ? 10 : 3} callback={() => set.push(4)}/>
          </div>
        )}
      </Scheduler>
    );
  });

  it('N-Ordered Queue', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler stepDelay={1} onEmptyQueue={() => {
        expect(set).toEqual([1, 2, 3]);
        done();
      }}>
        {channel => (
          <div>
            <Queue channel={channel} priority={0} callback={() => set.push(1)}/>
            <Queue channel={channel} callback={() => set.push(2)}/>
            <Queue channel={channel} callback={() => set.push(3)}/>
          </div>
        )}
      </Scheduler>
    );
  });
});

describe('Promised', () => {
  it('Ordered Promise', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler stepDelay={1} onEmptyQueue={() => {
        expect(set).toEqual([1, 2, 3]);
        done();
      }}>
        {channel => (
          <div>
            <Promised autoexecuted channel={channel}>{({active}) => active && set.push(1)}</Promised>
            <Promised autoexecuted channel={channel}>{({active}) => active && set.push(2)}</Promised>
            <Promised autoexecuted channel={channel}>{({active}) => active && set.push(3)}</Promised>
          </div>
        )}
      </Scheduler>
    );
  });

  it('Side-effect Executed Promise', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler
        stepDelay={1}
        withSideEffect
        onEmptyQueue={() => {
          expect(set).toEqual([1, 1, 2, 1, 2, 3, 1, 2, 3]);
          done();
        }}>
        {channel => (
          <div>
            <Promised autoexecuted channel={channel}>{({executed}) => executed && set.push(1)}</Promised>
            <Promised autoexecuted channel={channel}>{({executed}) => executed && set.push(2)}</Promised>
            <Promised autoexecuted channel={channel}>{({executed}) => executed && set.push(3)}</Promised>
          </div>
        )}
      </Scheduler>
    );
  });

  it('Executed Promise', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler stepDelay={1} onEmptyQueue={() => {
        expect(set).toEqual([1, 2, 3]);
        done();
      }}>
        {channel => (
          <div>
            <Promised autoexecuted channel={channel}>{({executed}) => executed && set.push(1)}</Promised>
            <Promised autoexecuted channel={channel}>{({executed}) => executed && set.push(2)}</Promised>
            <Promised autoexecuted channel={channel}>{({executed}) => executed && set.push(3)}</Promised>
          </div>
        )}
      </Scheduler>
    );
  });

  it('Pri-Promise', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler
        withSideEffect
        stepDelay={1}
        onEmptyQueue={() => {
          expect(set).toEqual([1, 3, 2]);
          done();
        }}>
        {channel => (
          <div>
            <Promised autoexecuted priority={1} channel={channel}>{({active}) => active && set.push(1)}</Promised>
            <Promised autoexecuted priority={set.length == 0 ? 2 : 3}
                      channel={channel}>{({active}) => active && set.push(2)}</Promised>
            <Promised autoexecuted priority={set.length == 0 ? 3 : 2}
                      channel={channel}>{({active}) => active && set.push(3)}</Promised>
          </div>
        )}
      </Scheduler>
    );
  });

  it('Ordered Mixed Promise', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler stepDelay={1} onEmptyQueue={() => {
        expect(set).toEqual([1, 1, 2, 2, 3, 3]);
        done();
      }}>
        {channel => (
          <div>
            <Promised autoexecuted channel={channel}>{({fired}) => fired && set.push(1)}</Promised>
            <Promised autoexecuted channel={channel}>{({fired}) => fired && set.push(2)}</Promised>
            <Promised autoexecuted channel={channel}>{({fired}) => fired && set.push(3)}</Promised>
          </div>
        )}
      </Scheduler>
    );
  });

  it('sideEffect Ordered Mixed Promise', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler
        stepDelay={1}
        withSideEffect
        onEmptyQueue={() => {
          expect(set).toEqual([1, 1, 1, 2, 2, 1, 2, 3, 3, 1, 2, 3]);
          done();
        }}>
        {channel => (
          <div>
            <Promised autoexecuted channel={channel}>{({fired}) => fired && set.push(1)}</Promised>
            <Promised autoexecuted channel={channel}>{({fired}) => fired && set.push(2)}</Promised>
            <Promised autoexecuted channel={channel}>{({fired}) => fired && set.push(3)}</Promised>
          </div>
        )}
      </Scheduler>
    );
  });

  it('Call Promise', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler stepDelay={1} onEmptyQueue={() => {
        expect(set).toEqual([1, 2, 3]);
        done();
      }}>
        {channel => (
          <div>
            <Promised channel={channel}>{({active, done}) => active && done() && set.push(1)}</Promised>
            <Promised channel={channel}>{({active, done}) => active && done() && set.push(2)}</Promised>
            <Promised channel={channel}>{({active, done}) => active && done() && set.push(3)}</Promised>
          </div>
        )}
      </Scheduler>
    );
  });

  it('Call nested Promise', (done) => {
    const set: number[] = [];
    const Render: React.SFC<{ children: () => React.ReactNode }> = ({children}) => <div>{children()}</div>
    const Q = ({channel}:{channel:any}) => <Promised channel={channel}>{({active, done}) => active && done() && set.push(2)}</Promised>
    const QQ = ({channel}:{channel:any}) => (
      <Render>
        { () => <Q channel={channel} />}
      </Render>
    );
    mount(
      <Scheduler stepDelay={1} onEmptyQueue={() => {
        expect(set).toEqual([1, 2, 3]);
        done();
      }}>
        {channel => (
          <div>
            <Promised channel={channel}>{({active, done}) => active && done() && set.push(1)}</Promised>
            <QQ channel={channel}/>
            <Promised channel={channel}>{({active, done}) => active && done() && set.push(3)}</Promised>
          </div>
        )}
      </Scheduler>
    );
  });
});

describe("Observer Q", () => {
  it('div', (done) => {
    const set: number[] = [];
    mount(
      <Scheduler
        stepDelay={1}
        onEmptyQueue={() => {
          expect(set).toEqual([2, 1, 3]);
          done();
        }}
        source={({ref}) => +(ref!.getAttribute('data-p') || 0)}
      >
        {channel => (
          <div>
            <Queue channel={channel} callback={() => set.push(1)}>
              <div data-p={2}></div>
            </Queue>


            <Queue channel={channel} callback={() => set.push(3)}>
              <div data-p={3}></div>
            </Queue>
            <Promised channel={channel} autoexecuted>{({active, forwardRef}) => {
              active && set.push(2)
              return <div ref={forwardRef} data-p={1}/>
            }}</Promised>

          </div>
        )}
      </Scheduler>
    );
  })
})

