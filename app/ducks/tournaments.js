import fetch from 'isomorphic-fetch'
import { errorNotification } from './notification'
import { baseURL, assign } from './utils'

const REQUEST = 'supertipset/tournaments/REQUEST'
const RECEIVE = 'supertipset/tournaments/RECEIVE'

const initialState = {
    isFetching: false,
    data: []
}

export default function tournaments(state = initialState, action) {
    switch (action.type) {
        case REQUEST:
            return assign(state, {
                isFetching: true
            })
        case RECEIVE:
            return assign(state, {
                isFetching: false,
                data: action.tournaments
            })
        default:
            return state
    }
}

export function requestTournaments() {
    return { type: REQUEST }
}

export function receiveTournaments(tournaments) {
    return { type: RECEIVE, tournaments }
}

function shouldFetch(tournaments) {
    if (tournaments.isFetching) {
        return false
    } else if (tournaments.data.length == 0) {
        return true
    }
}

export function fetchTournaments() {
    return (dispatch, getState) => {
        const { tournaments } = getState()

        if (!shouldFetch(tournaments)) {
            return Promise.resolve()
        }

        dispatch(requestTournaments())

        const url = `${baseURL}/api/tournaments/`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveTournaments(json)))
                } else {
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E114)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to fetch tournaments', res)
                    }
                }
            })
    }
}
