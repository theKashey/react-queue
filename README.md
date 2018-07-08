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
  
```js
import {Scheduler} from 'react-queue';

<Scheduler stepDelay={1000} >
{channel => .... }
</Scheduler>

<Scheduler stepDelay={1000} source={ ({ref}) => ref.getBoundingClientRect().top} />
```
`channel` also provides `channel.reset()` function, to clear all `executed` bits, and start everything from the scratch.

- `Queue` - queued event
  - `channel` - channel acquired from Scheduler
  - `callback` - callback to execute. In case of callback will return a number, or a promise resolving to number,
  next tick will be moved by {number}ms. In case of just Promise - next tick will wait to for promise to be resolved.
  - `children` - any DOM node, Queue will pass as `ref` into scheduler's `source` 

```js
import {Scheduler, Queue} from 'react-queue';

<Scheduler stepDelay={1000} >
{channel => 
  <Queue channel={channel} priority={1} callback={doSomething} />
}
</Scheduler>
```

# Licence
 MIT
 
 
