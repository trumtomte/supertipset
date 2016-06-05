import fetch from 'isomorphic-fetch'
import { successNotification, errorNotification } from './notification'
import { baseURL, assign, preparePost, preparePut } from './utils'

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

        return fetch(`${baseURL}/api/groups/${id}/detail/?tournament=${tournament}`)
            .then(res => {
                if (res.ok ) {
                    res.json().then(json => dispatch(receiveGroup(json)))
                } else {
                    // console.log('could not fetch group')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
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

        const url = `${baseURL}/api/groups/${group}/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveEditGroupDescription(json))
                        dispatch(successNotification('Gruppens beskrivning har redigerats!'))
                    })
                } else {
                    // console.log('request edit group description not ok')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
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

        const url = `${baseURL}/api/groups/${group}/password/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveEditGroupPassword(json))
                        dispatch(successNotification('Gruppens lösenord har redigerats!'))
                    })
                } else {
                    // console.log('request edit group password not ok')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}
