import * as React from 'react';
import {Component} from 'react';
import {AppWrapper} from './styled';
import {Scheduler} from "../src/Scheduler";
import {FlattenPriorityGroup, Promised, Queue} from "../src";

export interface AppState {
  x: number
}

const AppN0 = (function() {
  const Render: React.SFC<{ children: () => React.ReactNode }> = ({children}) => <div>{children()}</div>

  return class AppN0 extends Component <{}, AppState> {
    state: AppState = {
      x: 0
    }

    render() {
      const {x} = this.state;
      return (
        <AppWrapper>
          --{this.state.x}--
          <Scheduler stepDelay={500}>
            {channel => (
              <div>
                <Render>{() =>
                  <Render>{() =>
                    <Promised autoexecuted channel={channel} disabled={x===0}>{({active}) => {
                      active && x !== 1 && this.setState({x: 1});
                      return "1"
                    }}</Promised>
                  }</Render>
                }</Render>
                <Promised autoexecuted channel={channel}>{ ({active}) => { active && x!==2 && console.log('P1') && this.setState({x:2}); return "2"}}</Promised>
                <Promised autoexecuted channel={channel}>{ ({active}) => { active && x!==3 && console.log('P2')&& this.setState({x:3})&& console.log('P2');; return "3"}}</Promised>
                <Promised autoexecuted channel={channel} shift={-1}>{ ({active}) => { active && x!==4 && console.log('P3')&& this.setState({x:4})&& console.log('P3');; return "4"}}</Promised>
                <Promised priority={1} autoexecuted channel={channel}>{ ({active}) => { active && console.log('P0'); return "3"}}</Promised>
                <FlattenPriorityGroup channel={channel} shift={-4} priority={1}>
                  {
                    pchannel => (
                    <React.Fragment>
                      <Promised priority={2} channel={pchannel} autoexecuted>{ ({active}) => { active && console.log('P11'); return "1"}}</Promised>
                      <Promised priority={1} channel={pchannel} autoexecuted>{ ({active}) => { active && console.log('P12'); return "2"}}</Promised>
                      <Promised priority={3} channel={pchannel} autoexecuted>{ ({active}) => { active && console.log('P13'); return "3"}}</Promised>
                      <Promised priority={0} channel={pchannel} autoexecuted>{ ({active}) => { active && console.log('P00'); return "0"}}</Promised>
                    </React.Fragment>
                    )}
                </FlattenPriorityGroup>
              </div>
            )}
          </Scheduler>
          Example!
        </AppWrapper>
      )
    }
  }
})();

class App0 extends Component <{}, AppState> {
  state: AppState = {
    x: 0
  }

  render() {
    return (
      <AppWrapper>
        --{this.state.x}--
        <Scheduler stepDelay={5000} noInitialDelay>
          {channel => (
            <div>
              <Queue channel={channel} callback={() => this.setState({x: 1})}/>
              <Queue channel={channel} callback={() => this.setState({x: 2})}/>
              <Queue channel={channel} callback={() => this.setState({x: 1})}/>
            </div>
          )}
        </Scheduler>
        Example!
      </AppWrapper>
    )
  }
}

class App1 extends Component <{}, AppState> {
  state: AppState = {
    x: 0
  }

  render() {
    return (
      <AppWrapper>
        --{this.state.x}--
        <Scheduler stepDelay={1000}>
          {channel => (
            <div>
              <Queue channel={channel} callback={() => this.setState({x: 1})}/>
              <Queue channel={channel} callback={() => this.setState({x: 2})}/>
              <Queue channel={channel} callback={() => this.setState({x: 3})}/>
            </div>
          )}
        </Scheduler>
        Example!
      </AppWrapper>
    )
  }
}

class App1_1 extends Component <{}, AppState> {
  state: AppState = {
    x: 0
  }

  render() {
    const {x} = this.state;
    return (
      <AppWrapper>
        --{this.state.x}--
        <Scheduler stepDelay={1000}>
          {channel => (
            <div>
              {x == 0 && <Queue channel={channel} callback={() => this.setState({x: 1})}/>}
              {x == 1 && <Queue channel={channel} callback={() => this.setState({x: 2})}/>}
              {x == 2 && <Queue channel={channel} callback={() => this.setState({x: 3})}/>}
            </div>
          )}
        </Scheduler>
        Example!
      </AppWrapper>
    )
  }
}

class App2 extends Component <{}, AppState> {
  state: AppState = {
    x: 0
  }

  render() {
    return (
      <AppWrapper>
        --{this.state.x}--
        <Scheduler stepDelay={1000}>
          {channel => (
            <div>
              <Queue channel={channel} priority={1} callback={() => this.setState({x: 1})}/>
              <Queue channel={channel} priority={0} callback={() => this.setState({x: 2})}/>
              <Queue channel={channel} priority={2} callback={() => this.setState({x: 3})}/>
            </div>
          )}
        </Scheduler>
        Example!
      </AppWrapper>
    )
  }
}

class App2_1 extends Component <{}, AppState> {
  state: AppState = {
    x: 0
  }

  render() {
    const {x} = this.state;
    return (
      <AppWrapper>
        --{this.state.x}--
        <Scheduler stepDelay={1000}>
          {channel => (
            <div>
              <Queue channel={channel} priority={0} callback={() => this.setState({x: 1})}/>
              <Queue channel={channel} priority={x === 0 ? 1 : 2} callback={() => this.setState({x: 2})}/>
              <Queue channel={channel} priority={x === 0 ? 2 : 1} callback={() => {
                this.setState({x: 3});
                return -900
              }}/>

              <Queue channel={channel} priority={100} callback={() => this.setState({x: 0}, channel.reset)}/>
            </div>
          )}
        </Scheduler>
        Example!
      </AppWrapper>
    )
  }
}

class App3 extends Component <{}, AppState> {
  state: AppState = {
    x: 0
  }

  render() {
    const {x} = this.state;
    return (
      <AppWrapper>
        --{this.state.x}--
        <Scheduler stepDelay={1000} source={({ref}) => ref ? ref.getBoundingClientRect().top : 1000}>
          {channel => (
            <div style={{position: 'absolute'}}>
              <Queue channel={channel} callback={() => this.setState({x: 1})}>
                <div style={{position: 'absolute', top: 50}}> 1 {x == 1 && "selected!!"}</div>
              </Queue>

              <Queue channel={channel} callback={() => this.setState({x: 2})}>
                <div style={{position: 'absolute', top: 10}}> 2 {x == 2 && "selected!!"}</div>
              </Queue>

              <Queue channel={channel} callback={() => this.setState({x: 3})}>
                <div style={{position: 'absolute', top: 100}}> 3 {x == 3 && "selected!!"}</div>
              </Queue>


              <Queue channel={channel} callback={() => this.setState({x: 0}, channel.reset)}/>
            </div>
          )}
        </Scheduler>
        Example!
      </AppWrapper>
    )
  }
}

class App4 extends Component <{}, AppState> {
  state: AppState = {
    x: 0
  };

  render() {

    return (
      <AppWrapper>

        <Scheduler stepDelay={1000}>
          {channel => (
            <div>

              <Promised channel={channel}>
                {({active, executed, done}) => (
                  <div>
                    {executed && "task done"}
                    {active && "task is running"}
                    <button onClick={() => done(0)}>action!</button>
                  </div>
                )}
              </Promised>
              <Promised channel={channel}>
                {({active, executed, done}) => (
                  <div>
                    {executed && "task done"}
                    {active && "task is running"}
                    <button onClick={() => done(0)}>action!</button>
                  </div>
                )}
              </Promised>
              <Promised channel={channel}>
                {({active, executed, done}) => (
                  <div>
                    {executed && "task done"}
                    {active && "task is running"}
                    <button onClick={() => done(0)}>action!</button>
                  </div>
                )}
              </Promised>
              <button onClick={() => this.setState({x: 0}, channel.reset)}>reset</button>
            </div>
          )}
        </Scheduler>
        Example!
      </AppWrapper>
    )
  }
}

const App = () => (
  <div>
    <AppN0 />
    {/*<App0 />*/}
    {/*<App4/>*/}

    {/*<App1/>*/}
    {/*<App1_1/>*/}
    {/*<App2/>*/}
    {/*<App2_1/>*/}
    {/*<App3/>*/}

  </div>
)

export default App;