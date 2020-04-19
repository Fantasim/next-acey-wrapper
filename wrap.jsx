import React from 'react'
import _ from 'lodash'

const STORE_KEY = '_asceyStore'

export const withAscey = (STORE, App) => {

    return class Wrap extends React.Component {
        
        newProps = {}

        constructor(props){
            super(props)
            
            this.isServer() && STORE.clearModels()
            !this.isServer() && STORE.addPendingHydration(props.pageProps[STORE_KEY]) 
            this.initClearedProps()
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
        getClearedProps = () => this.newProps

        initClearedProps = () => {
            this.newProps = {}
            for (let key in this.props){
                if (key === 'pageProps'){
                    const copy = _.cloneDeep(this.props[key])
                    delete copy[STORE_KEY]
                    copy['isServer'] = this.isServer()
                    this.newProps[key] = copy
                } else {
                    this.newProps[key] = this.props[key]
                }
            }
        }

        render = () => <App {...this.getClearedProps()} />
    }
}