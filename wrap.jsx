import React from 'react'
import _ from 'lodash'

const STORE_KEY = '_asceyStore'

export const withAscey = (STORE, App) => {

    return class Wrap extends React.Component {
        
        constructor(props){
            super(props)
            
            this.isServer() && process.env.NODE_ENV === 'development' && STORE.clearModels()
            !this.isServer() && STORE.addPendingHydration(props.pageProps[STORE_KEY]) 
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
            ret.pageProps[STORE_KEY] = STORE.getState()

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