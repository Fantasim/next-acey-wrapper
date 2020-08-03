# NextJS Wrapper for Acey.

## Get started
```
yarn add next-acey-wrapper
```

<br />

1. Create or update your `_app.js` file at the root of the folder `pages`
2. Update it this way :

```js
import React from 'react'
import { withAcey } from 'next-acey-wrapper'

const MyApp = props => {
  const { Component, pageProps } = props
  return <Component {...pageProps} />
}

export default withAcey(MyApp)
```

<br />

## Quickstart

You can received your Model and Collection's state on the client side as it is on the server side.

Example `./pages/index.js`: 
```js
import { useAcey, Model } from 'acey'

//declare a Counter Model
class CounterModel extends Model {
    constructor(initialState, options){
        super(initialState, options)
    }
    
    get = () => this.state.counter
}

//Counter initialized at 0
const Counter = new CounterModel({counter: 0}, {connected: true, key: 'counter'})

const Home = (props) => {
  useAcey([ Counter ])
  
  return <h1>{Counter.get()}<h1> //display 10 on client side
}

Home.getStaticProps = ({ query }) => {
  Counter.setState({counter: 10}).save() //Counter's state updated on server side
  return {}
}
```
