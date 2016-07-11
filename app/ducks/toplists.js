import fetch from 'isomorphic-fetch'
import { errorNotification } from './notification'
import { baseURL, assign } from './utils'

const INVALIDATE = 'supsertipset/toplists/INVALIDATE'
// Points
const REQUEST_TOP_10_POINTS = 'supertipset/toplists/REQUEST_TOP_10_POINTS'
const RECEIVE_TOP_10_POINTS = 'supertipset/toplists/RECEIVE_TOP_10_POINTS'
// Bets
const REQUEST_TOP_10_BETS = 'supertipset/toplists/REQUEST_TOP_10_BETS'
const RECEIVE_TOP_10_BETS = 'supertipset/toplists/RECEIVE_TOP_10_BETS'
// Average
const REQUEST_TOP_10_AVERAGE = 'supertipset/toplists/REQUEST_TOP_10_AVERAGE'
const RECEIVE_TOP_10_AVERAGE = 'supertipset/toplists/RECEIVE_TOP_10_AVERAGE'
// Members
const REQUEST_TOP_10_MEMBERS = 'supertipset/toplists/REQUEST_TOP_10_MEMBERS'
const RECEIVE_TOP_10_MEMBERS = 'supertipset/toplists/RECEIVE_TOP_10_MEMBERS'

const initialState = {
    top10points: {
        isFetching: false,
        didInvalidate: false,
        data: []
    },
    top10bets: {
        isFetching: false,
        didInvalidate: false,
        data: []
    },
    top10average: {
        isFetching: false,
        didInvalidate: false,
        data: []
    },
    top10members: {
        isFetching: false,
        didInvalidate: false,
        data: []
    }
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE:
            return assign(state, {
                top10points: assign(state.top10points, { didInvalidate: true }),
                top10bets: assign(state.top10bets, { didInvalidate: true }),
                top10average: assign(state.top10average, { didInvalidate: true }),
                top10members: assign(state.top10members, { didInvalidate: true })
            })
        case REQUEST_TOP_10_POINTS:
            return assign(state, {
                top10points: assign(state.top10points, {
                    isFetching: true,
                    didInvalidate: false
                })
            })
        case RECEIVE_TOP_10_POINTS:
            return assign(state, {
                top10points: assign(state.top10points, {
                    isFetching: false,
                    didInvalidate: false,
                    data: action.top10points
                })
            })
        case REQUEST_TOP_10_BETS:
            return assign(state, {
                top10bets: assign(state.top10bets, {
                    isFetching: true,
                    didInvalidate: false
                })
            })
        case RECEIVE_TOP_10_BETS:
            return assign(state, {
                top10bets: assign(state.top10bets, {
                    isFetching: false,
                    didInvalidate: false,
                    data: action.top10bets
                })
            })
        case REQUEST_TOP_10_AVERAGE:
            return assign(state, {
                top10average: assign(state.top10average, {
                    isFetching: true,
                    didInvalidate: false
                })
            })
        case RECEIVE_TOP_10_AVERAGE:
            return assign(state, {
                top10average: assign(state.top10average, {
                    isFetching: false,
                    didInvalidate: false,
                    data: action.top10average
                })
            })
        case REQUEST_TOP_10_MEMBERS:
            return assign(state, {
                top10members: assign(state.top10members, {
                    isFetching: true,
                    didInvalidate: false
                })
            })
        case RECEIVE_TOP_10_MEMBERS:
            return assign(state, {
                top10members: assign(state.top10members, {
                    isFetching: false,
                    didInvalidate: false,
                    data: action.top10members
                })
            })
        default:
            return state
    }
}

export function invalidateTopLists() {
    return { type: INVALIDATE }
}

// Points
export function requestTop10Points() {
    return { type: REQUEST_TOP_10_POINTS }
}

export function receiveTop10Points(top10points) {
    return { type: RECEIVE_TOP_10_POINTS, top10points }
}

function shouldFetchTop10Points(toplists) {
    if (toplists.top10points.isFetching) {
        return false
    } else if (toplists.top10points.data.length == 0) {
        return true
    } else {
        return toplists.top10points.didInvalidate
    }
}

export function fetchTop10Points(tournament) {
    return (dispatch, getState) => {
        const { toplists } = getState()

        if (!shouldFetchTop10Points(toplists)) {
            return Promise.resolve()
        }

        dispatch(requestTop10Points())

        const url = `${baseURL}/api/users/top_10_points/?tournament=${tournament}`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveTop10Points(json)))
                } else {
                    // TODO error code
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E112)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to fetch top 10 points', res)
                    }
                }
            })
    }
}

// Bets
export function requestTop10Bets() {
    return { type: REQUEST_TOP_10_BETS }
}

export function receiveTop10Bets(top10bets) {
    return { type: RECEIVE_TOP_10_BETS, top10bets }
}

function shouldFetchTop10Bets(toplists) {
    if (toplists.top10bets.isFetching) {
        return false
    } else if (toplists.top10bets.data.length == 0) {
        return true
    } else {
        return toplists.top10bets.didInvalidate
    }
}

export function fetchTop10Bets(tournament) {
    return (dispatch, getState) => {
        const { toplists } = getState()

        if (!shouldFetchTop10Bets(toplists)) {
            return Promise.resolve()
        }

        dispatch(requestTop10Bets())

        const url = `${baseURL}/api/users/top_10_bets/?tournament=${tournament}`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveTop10Bets(json)))
                } else {
                    // TODO error code
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E112)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to fetch top 10 bets', res)
                    }
                }
            })
    }
}

// Average
export function requestTop10Average() {
    return { type: REQUEST_TOP_10_AVERAGE }
}

export function receiveTop10Average(top10average) {
    return { type: RECEIVE_TOP_10_AVERAGE, top10average }
}

function shouldFetchTop10Average(toplists) {
    if (toplists.top10average.isFetching) {
        return false
    } else if (toplists.top10average.data.length == 0) {
        return true
    } else {
        return toplists.top10average.didInvalidate
    }
}

export function fetchTop10Average(tournament) {
    return (dispatch, getState) => {
        const { toplists } = getState()

        if (!shouldFetchTop10Average(toplists)) {
            return Promise.resolve()
        }

        dispatch(requestTop10Average())

        const url = `${baseURL}/api/groups/top_10_average/?tournament=${tournament}`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveTop10Average(json)))
                } else {
                    // TODO error code
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E112)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to fetch top 10 average', res)
                    }
                }
            })
    }
}

// Members
export function requestTop10Members() {
    return { type: REQUEST_TOP_10_MEMBERS }
}

export function receiveTop10Members(top10members) {
    return { type: RECEIVE_TOP_10_MEMBERS, top10members }
}

function shouldFetchTop10Members(toplists) {
    if (toplists.top10members.isFetching) {
        return false
    } else if (toplists.top10members.data.length == 0) {
        return true
    } else {
        return toplists.top10members.didInvalidate
    }
}

export function fetchTop10Members() {
    return (dispatch, getState) => {
        const { toplists } = getState()

        if (!shouldFetchTop10Members(toplists)) {
            return Promise.resolve()
        }

        dispatch(requestTop10Members())

        const url = `${baseURL}/api/groups/top_10_members/`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveTop10Members(json)))
                } else {
                    // TODO error code
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E112)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to fetch top 10 members', res)
                    }
                }
            })
    }
}
