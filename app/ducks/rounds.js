import fetch from 'isomorphic-fetch'
import { errorNotification } from './notification'
import { baseURL, assign } from './utils'

const INVALIDATE = 'supertipset/rounds/INVALIDATE'
const REQUEST = 'supertipset/rounds/REQUEST'
const RECEIVE = 'supertipset/rounds/RECEIVE'

const initialState = {
    isFetching: false,
    didInvalidate: false,
    data: []
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE:
            return assign(state, {
                didInvalidate: true
            })
        case REQUEST:
            return assign(state, {
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE:
            return assign(state, {
                isFetching: false,
                didInvalidate: false,
                data: action.rounds
            })
        default:
            return state
    }
}

export function invalidateRounds() {
    return { type: INVALIDATE }
}

export function requestRounds() {
    return { type: REQUEST }
}

export function receiveRounds(rounds) {
    return { type: RECEIVE, rounds }
}

function shouldFetch(rounds) {
    if (rounds.isFetching) {
        return false
    } else if (rounds.data.length == 0) {
        return true
    } else {
        return rounds.didInvalidate
    }
}

export function fetchRounds(tournament) {
    return (dispatch, getState) => {
        const { rounds } = getState()

        if (!shouldFetch(rounds)) {
            return Promise.resolve()
        }

        dispatch(requestRounds())

        const url = `${baseURL}/api/rounds/?tournament=${tournament}`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveRounds(json)))
                } else {
                    // console.log('unable to fetch rounds')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}
