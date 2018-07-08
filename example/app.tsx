import * as React from 'react';
import {Component} from 'react';
import {AppWrapper} from './styled';
import {Scheduler} from "../src/Scheduler";
import {Queue} from "../src";

export interface AppState {
  x: number
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
              <Queue channel={channel} priority={x === 0 ? 2 : 1} callback={() => {this.setState({x: 3}); return -900}}/>

              <Queue channel={channel} priority={100} callback={() => this.setState({x: 0},channel.reset)}/>
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
        <Scheduler stepDelay={1000} source={ ({ref}) => ref ? ref.getBoundingClientRect().top : 1000} >
          {channel => (
            <div style={{position:'absolute'}}>
              <Queue channel={channel} callback={() => this.setState({x: 1})}>
                <div style={{position:'absolute', top: 50}}> 1 {x==1 && "selected!!"}</div>
              </Queue>

              <Queue channel={channel} callback={() => this.setState({x: 2})}>
                <div style={{position:'absolute', top: 10}}> 2 {x==2 && "selected!!"}</div>
              </Queue>

              <Queue channel={channel} callback={() => this.setState({x: 3})}>
                <div style={{position:'absolute', top: 100}}> 3 {x==3 && "selected!!"}</div>
              </Queue>


              <Queue channel={channel} callback={() => this.setState({x: 0},channel.reset)}/>
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
    <App1/>
    <App1_1/>
    <App2/>
    <App2_1/>
    <App3/>
  </div>
)

export default App;