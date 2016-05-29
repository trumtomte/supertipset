import fetch from 'isomorphic-fetch'
import { baseURL, assign } from './utils'

const REQUEST = 'supertipset/teams/REQUEST'
const RECEIVE = 'supertipset/teams/RECEIVE'

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
                data: action.teams
            })
        default:
            return state
    }
}

export function requestTeams() {
    return { type: REQUEST }
}

export function receiveTeams(teams) {
    return { type: RECEIVE, teams }
}

function shouldFetch(teams) {
    if (teams.isFetching) {
        return false
    } else if (teams.data.length == 0) {
        return true
    }
}

export function fetchTeams() {
    return (dispatch, getState) => {
        const { teams } = getState()

        if (!shouldFetch(teams)) {
            return Promise.resolve()
        }

        dispatch(requestTeams())

        const url = `${baseURL}/api/teams/`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveTeams(json)))
                } else {
                    // TODO error handling
                    console.log('unable to fetch teams')
                }
            })
    }
}
