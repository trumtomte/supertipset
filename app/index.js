import React from 'react'
import { render } from 'react-dom'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { syncHistoryWithStore } from 'react-router-redux'
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import {
    Router,
    Route,
    IndexRoute,
    browserHistory
} from 'react-router'

import {
    App,
    Bets,
    Group,
    Groups,
    TopLists,
    UserProfile,
    VisitorProfile,
    Modals,
    Notifications
} from './containers'

import * as reducers from './ducks/index'

const rootReducer = combineReducers(
    Object.assign({}, reducers, { routing: routerReducer })
)

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunk,
        createLogger()
    )
)

const history = syncHistoryWithStore(browserHistory, store)

render(
    <Provider store={store}>
        <div>
            <Router history={history}>
                <Route path="/s" component={App}>
                    <IndexRoute component={Bets} />
                    <Route path="bets" component={Bets} />
                    <Route path="groups" component={Groups} />
                    <Route path="groups/:id" component={Group} />
                    <Route path="toplists" component={TopLists} />
                    <Route path="profile" component={UserProfile} />
                    <Route path="profile/:id" component={VisitorProfile} />
                </Route>
            </Router>
            <Modals />
            <Notifications />
        </div>
    </Provider>,
    document.getElementById('mount')
)
