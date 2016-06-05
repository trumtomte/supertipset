import fetch from 'isomorphic-fetch'
import { errorNotification } from './notification'
import { baseURL, assign } from './utils'

const REQUEST = 'supertipset/players/REQUEST'
const RECEIVE = 'supertipset/players/RECEIVE'

const initialState = {
    isFetching: false,
    data: []
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST:
            return assign(state, {
                isFetching: true
            })
        case RECEIVE:
            return assign(state, {
                isFetching: false,
                data: action.players
            })
        default:
            return state
    }
}

export function requestPlayers() {
    return { type: REQUEST }
}

export function receivePlayers(players) {
    return { type: RECEIVE, players }
}

function shouldFetch(players) {
    if (players.isFetching) {
        return false
    } else if (players.data.length == 0) {
        return true
    }
}

export function fetchPlayers() {
    return (dispatch, getState) => {
        const { players } = getState()

        if (!shouldFetch(players)) {
            return Promise.resolve()
        }

        dispatch(requestPlayers())

        const url = `${baseURL}/api/players/`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receivePlayers(json)))
                } else {
                    // console.log('unable to fetch players')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}
