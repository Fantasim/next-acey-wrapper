<p align="center" font-style="italic" >
  <a>
    <img alt="acey" src="https://siasky.net/NABkHZBkDxMom-KpBakYkmkMbWQWVcViZ1Fd-DwIXgdqOg" width="100%">
  </a>
Wrapper for NextJS apps with Acey.
</p>


## Get started
```
yarn add acey next-acey-wrapper
```

<br />

1. Create or update your `_app.js` file at the root of the folder `pages`
2. Update it this way :

```js
import React from 'react'
import Acey from 'acey'
import { withAcey } from 'next-acey-wrapper'

const MyApp = props => {
  const { Component, pageProps } = props
  return <Component {...pageProps} />
}

export default withAcey(MyApp, Acey)
```

<br />

## Features:
- You can now use Acey as you would use with a standard ReactJS app.
- You can update and dispatch your Model's and Collection's state to the store directly through nextJS server methods like
getInitialProps.

Example `./pages/index.js`: 
```js
import { useAcey, Model } from 'acey'

//declare a Counter Model
class CounterModel extends Model {
    constructor(data, options){
        super(data, options)
    }
    
    get = () => this.state.counter
}

//Counter initialized at 0
const Counter = new CounterModel({counter: 0}, {connected: true, key: 'counter'})

const Home = (props) => {
  useAcey([Counter])
  
  return <h1>{Counter.get()}<h1> //display 10 on client side
}

Home.getInitialProps = ({ query }) => {
  //Counter state updated on server side
  Counter.setState({counter: 10}).save()
}
```






