import React from 'react'
import _ from 'lodash'
import * as Cookies from 'es-cookie'
import { config } from 'acey'

const STORE_KEY = '_aceyStore'
config.setEnvAsNextJS()

export const withAcey = (store, App) => {

    return class Wrap extends React.Component {
        
        constructor(props){
            super(props)
            
            !this.isServer() && store.addPendingHydration(props.pageProps[STORE_KEY]) 
        }
  
        static getInitialProps = async ({ Component, router, ctx }) => {
            let pageProps = {}
  
            if (!ctx) throw new Error('No page context');
            const prevInitialPropsFunction = Component.getInitialProps
  
            if (ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
                const cookies = {}
                const gotCookies = Cookies.parse(ctx.req.headers.cookie)
                for (let key in gotCookies){
                    if (store.exist(key))
                        cookies[key] = JSON.parse(gotCookies[key])
                }
                store.hydrateCookies(cookies)
            }
            
            if (Component.getInitialProps)
                pageProps = await Component.getInitialProps(ctx)
            
            Component.getInitialProps = (ctx) => pageProps
            Component.getInitialProps = prevInitialPropsFunction
  
            const ret = { 
                pageProps: { ...pageProps }
            }
            ret.pageProps[STORE_KEY] = store.store()
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