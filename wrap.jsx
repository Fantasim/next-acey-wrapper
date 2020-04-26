import React from 'react'
import _ from 'lodash'
import * as Cookies from 'es-cookie'

const STORE_KEY = '_aceyStore'

export const withAcey = (STORE, App) => {

    return class Wrap extends React.Component {
        
        constructor(props){
            super(props)
            
            !this.isServer() && STORE.addPendingHydration(props.pageProps[STORE_KEY]) 
        }
  
        static getInitialProps = async ({ Component, router, ctx }) => {
            let pageProps = {}
  
            if (!ctx) throw new Error('No page context');
            const prevInitialPropsFunction = Component.getInitialProps
  
            if (ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
                STORE.hydrateCookies(Cookies.parse(ctx.req.headers.cookie))
            }
            
            if (Component.getInitialProps)
                pageProps = await Component.getInitialProps(ctx)
            
            Component.getInitialProps = (ctx) => pageProps
            Component.getInitialProps = prevInitialPropsFunction
  
            const ret = { 
                pageProps: { ...pageProps }
            }
            ret.pageProps[STORE_KEY] = STORE.store()
            return ret
        }
  
        isServer = () => typeof window === 'undefined'
        getClearedProps = () => {
            let newProps = {}
            for (let key in this.props){
                if (key === 'pageProps'){
                    const copy = _.cloneDeep(this.props[key])
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