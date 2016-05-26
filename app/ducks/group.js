import fetch from 'isomorphic-fetch'
import { successNotification } from './notification'
import { assign, preparePost, preparePut } from './utils'

const INVALIDATE = 'supertipset/group/INVALIDATE'
// Group
const REQUEST = 'supertipset/group/REQUEST'
const RECEIVE = 'supertipset/group/RECEIVE'
// Group description
const REQUEST_EDIT_DESCRIPTION = 'supertipset/group/REQUEST_EDIT_DESCRIPTION'
const RECEIVE_EDIT_DESCRIPTION = 'supertipset/group/RECEIVE_EDIT_DESCRIPTION'
// Group password
const REQUEST_EDIT_PASSWORD = 'supertipset/group/REQUEST_EDIT_PASSWORD'
const RECEIVE_EDIT_PASSWORD = 'supertipset/group/RECEIVE_EDIT_PASSWORD'

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
                data: action.group
            })
        case RECEIVE_EDIT_DESCRIPTION:
            return assign(state, {
                data: assign(state.data, {
                    description: action.group.description
                })
            })
        // TODO listen to other actions?
        default:
            return state
    }
}

export function invalidateGroup() {
    return { type: INVALIDATE }
}

export function requestGroup() {
    return { type: REQUEST }
}

export function receiveGroup(group) {
    return { type: RECEIVE, group } 
}

function shouldFetch(group, id) {
    if (group.isFetching) {
        return false
    } else if (!group.data.hasOwnProperty('id')) {
        return true    
    } else if (group.data.hasOwnProperty('id') && group.data.id !== id) {
        return true
    } else {
        return group.didInvalidate
    }
}

export function fetchGroup(id, tournament) {
    return (dispatch, getState) => {
        const { group } = getState()

        if (!shouldFetch(group, id)) {
            return Promise.resolve()
        }

        dispatch(requestGroup())

        return fetch(`http://127.0.0.1:8001/api/groups/${id}/detail/?tournament=${tournament}`)
            .then(res => {
                if (res.ok ) {
                    res.json().then(json => dispatch(receiveGroup(json)))
                } else {
                    // TODO error handling
                    console.log('could not fetch group')
                }
            })
    }
}

export function requestEditGroupDescription() {
    return { type: REQUEST_EDIT_DESCRIPTION }
}

export function receiveEditGroupDescription(group) {
    return { type: RECEIVE_EDIT_DESCRIPTION, group }
}

export function editGroupDescription(user, group, name, description) {
    return dispatch => {
        dispatch(requestEditGroupDescription())

        const payload = preparePut({
            user,
            name,
            description
        })

        const url = `http://127.0.0.1:8001/api/groups/${group}/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveEditGroupDescription(json))
                        // TODO change notification message?
                        dispatch(successNotification('Gruppen har redigerats!'))
                    })
                } else {
                    // TODO error handling
                    console.log('request edit group description not ok')
                }
            })
    }
}

export function requestEditGroupPassword() {
    return { type: REQUEST_EDIT_PASSWORD }
}

export function receiveEditGroupPassword(group) {
    return { type: RECEIVE_EDIT_PASSWORD, group }
}

export function editGroupPassword(user, group, name, password) {
    return dispatch => {
        dispatch(requestEditGroupDescription())

        const payload = preparePut({
            user,
            name,
            password
        })

        const url = `http://127.0.0.1:8001/api/groups/${group}/password/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveEditGroupPassword(json))
                        // TODO change notification message?
                        dispatch(successNotification('Gruppen har redigerats!'))
                    })
                } else {
                    // TODO error handling
                    console.log('request edit group password not ok')
                }
            })
    }
}
