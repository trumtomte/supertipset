import fetch from 'isomorphic-fetch'
import { baseURL, assign } from './utils'
import { RECEIVE_LEAVE } from './groups'

const INVALIDATE = 'supertipset/profile/INVALIDATE'
const REQUEST = 'supertipset/profile/REQUEST'
const RECEIVE = 'supertipset/profile/RECEIVE'

const initialState = {
    isFetching: false,
    didInvalidate: false,
    data: {}
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
                data: action.profile
            })
        // If user leaves a group from the profile page
        case RECEIVE_LEAVE:
            if (!state.data.hasOwnProperty('id')) {
                return state
            }

            return assign(state, {
                data: assign(state.data, {
                    groups: state.data.groups.filter(group => group.id !== action.group.id)
                })
            })
        default:
            return state
    }
}

export function invalidateProfile() {
    return { type: INVALIDATE }
}

export function requestProfile() {
    return { type: REQUEST }
}

export function receiveProfile(profile) {
    return { type: RECEIVE, profile }
}

function shouldFetch(profile, id) {
    if (profile.isFetching) {
        return false
    } else if (!profile.data.hasOwnProperty('id')) {
        return true
    } else if (profile.data.hasOwnProperty('id') && profile.data.id !== id) {
        return true 
    } else {
        return profile.didInvalidate
    }
}

export function fetchProfile(id, tournament) {
    return (dispatch, getState) => {
        const { profile, user } = getState()

        if (!shouldFetch(profile, id)) {
            return Promise.resolve()
        }

        if (user.data.hasOwnProperty('id') && user.id == id) {
            dispatch(receiveProfile(user.data))
            return Promise.resolve()
        }

        dispatch(requestProfile())

        const url = `${baseURL}/api/users/${id}/detail/?tournament=${tournament}`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveProfile(json)))
                } else {
                    // TODO error handling
                    console.log('unable to fetch profile')
                }
            })
    }
}
