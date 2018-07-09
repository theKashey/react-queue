<div align="center">
  <h1>React⏳Queue</h1>
  <br/>
  A declarative scheduler
  <br/>
    
  <a href="https://www.npmjs.com/package/react-queue">
   <img src="https://img.shields.io/npm/v/react-queue.svg?style=flat-square" />
  </a>

  <br/>  
</div>  

To schedule events one-after another. To play _lazy_ animations in order, correlated with their position on the page.

# API
- `Scheduler` - task scheduler. Collect tasks and execute them with `stepDelay` between in the `priority` order.
  - stepDelay - delay between two events
  - source - priority calculation function
  - observe - cache buster property. Scheduler sorts queue only on element change, in case of using `source` you might need "inform"
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

- `Queue` - queued event
  - `channel` - channel acquired from Scheduler
  - `callback` - callback to execute. In case of callback will return a number, or a promise resolving to number,
  - `priority` - pririty in queue, where 0-s should be executed before 1-s.
  - `disabled` - holds queue execution (sets priority to Infitity).
  next tick will be moved by {number}ms. In case of just Promise - next tick will wait to for promise to be resolved.
  - `children` - any DOM node, Queue will pass as `ref` into scheduler's `source` 

```js
import {Scheduler, Queue} from 'react-queue';

<Scheduler stepDelay={1000} >
    {channel => 
      <Queue channel={channel} priority={1} callback={doSomething} />
      
      // this one will report `ref` to the scheduler
      <Queue channel={channel} callback={doSomething}>
        <div>42</div>
      </Queue>  
    }
</Scheduler>
```

- `Promised` - promised event. Once it started it should all `done` when it's done.
  - `channel` - channel acquired from Scheduler
  - `children` - render function
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
          <Trigger when={active} then={() => done(42)}/>
        </div>
      )
      </Promised>      
    }
</Scheduler>
```  

# Licence
 MIT
 
 
