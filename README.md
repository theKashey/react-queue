<div align="center">
  <h1>React ⏳ Queue</h1>
  <br/>
  A declarative scheduler
  <br/>
    
  <a href="https://www.npmjs.com/package/react-queue">
   <img src="https://img.shields.io/npm/v/react-queue.svg?style=flat-square" />
  </a>
  
  <a href="https://codecov.io/github/theKashey/react-queue">
     <img src="https://img.shields.io/codecov/c/github/theKashey/react-queue.svg?style=flat-square" />
   </a>
   
   <a href="https://travis-ci.org/theKashey/react-queue">
     <img src="https://img.shields.io/travis/theKashey/react-queue/master.svg">
   </a>

  <br/>  
</div>  

To schedule events one-after another. To play _lazy_ animations in order, correlated with their position on the page.

# API
## Scheduler
- `Scheduler` - task scheduler. Collect tasks and execute them with `stepDelay` between in the `priority` order.
  - `stepDelay` - delay between two events
  - `[reverse]` - reverses the queue
  - `[source]` - priority calculation function
  - `[withSideEffect]` - indicates that Scheduler has  side effects, and enabled auto update(re-render) on task execution. __Affects performance__. 
  - `[observe]` - cache buster property. Scheduler sorts queue only on element change, in case of using `source` you might need "inform"
  - `[noInitialDelay]` - remove delay from the first task.
  - `[disabled]` - disables ticking
  it to resort queue.
  
  
```js
import {Scheduler} from 'react-queue';

<Scheduler stepDelay={1000} >
  {channel => .... }
</Scheduler>

// use source to create priority based on element position on the page
<Scheduler stepDelay={1000} source={ ({ref}) => ref.getBoundingClientRect().top} />
```
`channel` also provides `channel.reset()` function, to clear all `executed` bits, and start everything from the scratch.

## Queue
- `Queue` - queued event. It just got executed, nothing more. "When", in "when order" - that is the question.
  - `channel` - channel acquired from Scheduler
  - `callback` - callback to execute. In case if callback will return a number, or a promise resolving to number, it would be used to _shift_ delay to the next step.
  - `priority` - pririty in queue, where 0-s should be executed before 1-s.
  - [`disabled`] - holds queue execution (sets priority to Infitity).
  next tick will be moved by {number}ms. In case of just Promise - next tick will wait to for promise to be resolved.
  - [`children`] - any DOM node, Queue will pass as `ref` into scheduler's `source` 

```js
import {Scheduler, Queue} from 'react-queue';

<Scheduler stepDelay={1000} >
    {channel => 
      <Queue channel={channel} priority={1} callback={doSomething} />
      
      // this one will report `ref` to the scheduler
      <Queue channel={channel} callback={doSomething}>
        <div>42</div>
      </Queue>  
         
      <Queue channel={channel} callback={() => this.setState({x: 1})}>
        <div style={{position: 'absolute', top: 50}}> 1 {x == 1 && "selected!!"}</div>
      </Queue>

      <Queue channel={channel} callback={() => this.setState({x: 2})}>
        <div style={{position: 'absolute', top: 10}}> 2 {x == 2 && "selected!!"}</div>
      </Queue>

      <Queue channel={channel} callback={() => this.setState({x: 3})}>
        <div style={{position: 'absolute', top: 100}}> 3 {x == 3 && "selected!!"}</div>
      </Queue>
    }
</Scheduler>
```

## Promised
- `Promised` - promised event. Once it started it should all `done` when it's done. This is a more complex form of queue, with much stronger feedback.
  - `channel` - channel acquired from Scheduler
  - `children` - render function
  - [`autoexecuted`] - auto "done" the promised. boolean or number. If number - would be used to shift next step.
```js
import {Scheduler, Promised} from 'react-queue';
import {Trigger} from 'recondition';

<Scheduler stepDelay={1000} >
    {channel => 
      <Promised channel={channel} priority={1}>
      {({executed, active, done, forwardRed}) => (
        <div ref={forwardRed}>
          {executed && "task is done"}
          {active && "task is running"}
          // don't call anything in render
          <Trigger when={active} then={() => done(42/* make next step by 42ms later*/)}/>
        </div>
      )
      </Promised>      
    }
</Scheduler>

// this code has the same behavior
<Scheduler stepDelay={1000} >
    {channel => 
      <Promised channel={channel} priority={1} autoexecuted={42}>
      {({executed, active, done, forwardRed}) => (
        <div ref={forwardRed}>
          {executed && "task is done"}
          {active && "task is running"}          
        </div>
      )
      </Promised>      
    }
</Scheduler>
```  

For example - animation - it will execute one `Promised` after another, and triggering waterfall animation.
```js
import {Scheduler, Promised} from 'react-queue';
import {Trigger} from 'recondition';

<Scheduler stepDelay={300} >
    {channel => 
      <Promised channel={channel} autoexecuted>
      {({executed, active, fired}) => (<div style={styles[executed||active ? styleA : styleB}>Line1</div>)}
      </Promised>      
      
      <Promised channel={channel} autoexecuted>
      {({executed, active, fired}) => (<div style={styles[executed||active ? styleA : styleB}>Line2</div>)}
      </Promised>      

      <Promised channel={channel} autoexecuted>
      {({executed, active, fired}) => (<div style={styles[executed||active ? styleA : styleB}>Line3</div>)}
      </Promised>      

      <Promised channel={channel} autoexecuted>
      {({executed, active, fired}) => (<div style={styles[executed||active ? styleA : styleB}>Line4</div>)}
      </Promised>      
    }
</Scheduler>
```  

## Examples
[react-remock + react-queue](https://codesandbox.io/s/q89q2jm8qw) - simple and complex example - "jquery like" image lazy loading with queued execution.
[react-visibility-sensor + react-queue](https://codesandbox.io/s/6xvr42y6xr) - animate element appearance based on visibility check.

# Licence
 MIT
 
 
