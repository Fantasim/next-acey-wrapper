import React from 'react'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

import { manager, config } from 'acey'

export const withAcey = (App) => {
    
    config.setEnvAsNextJS()
    config.done()
    const STORE_KEY = '_aceyStore'
  
    return class Wrap extends React.Component {
          
          constructor(props){
              super(props)
              this.init()
          }

          init = () => {
            if (!this.isServer()){
              const store = this.props.pageProps[STORE_KEY]
              for (const key in store)
                isEqual(manager.models().node(key).super().defaultState, store[key]) && delete store[key]
              manager.pendingHydrationStore().set(store)
              manager.pendingHydrationStore().execute()
            }
          }

          static getInitialProps = async ({ Component, router, ctx }) => {
            let pageProps = {}

            if (!ctx) throw new Error('No page context');
            const prevInitialPropsFunction = Component.getInitialProps
                  
            if (Component.getInitialProps)
                pageProps = await Component.getInitialProps(ctx)
            
            Component.getInitialProps = (ctx) => pageProps
            Component.getInitialProps = prevInitialPropsFunction
  
            const ret = { 
                pageProps: { ...pageProps }
            }
            ret.pageProps[STORE_KEY] = manager.store().get()
            return ret
          }
    
          isServer = () => typeof window === 'undefined'
          
          getClearedProps = () => {
              let newProps = {}
              for (let key in this.props){
                  if (key === 'pageProps'){
                      const copy = cloneDeep(this.props[key])
                      delete copy[STORE_KEY]
                      copy['isServer'] = this.isServer()
                      newProps[key] = copy
                  } else {
                      newProps[key] = this.props[key]
                  }
              }
              return newProps
          }
          render = () => <App {...this.getClearedProps()} />
      }
}
