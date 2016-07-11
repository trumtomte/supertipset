import fetch from 'isomorphic-fetch'
import { browserHistory } from 'react-router'
import { successNotification, errorNotification } from './notification'
import { baseURL, assign, preparePost, preparePut } from './utils'

const INVALIDATE = 'supertipset/groups/INVALIDATE'
// Group
const REQUEST = 'supertipset/groups/REQUEST'
const RECEIVE = 'supertipset/groups/RECEIVE'
// Create group
const REQUEST_CREATE = 'supertipset/groups/REQUEST_CREATE'
export const RECEIVE_CREATE = 'supertipset/groups/RECEIVE_CREATE'
// Join group
const REQUEST_JOIN = 'supertipset/groups/REQUEST_JOIN'
export const RECEIVE_JOIN = 'supertipset/groups/RECEIVE_JOIN'
// Leave group
const REQUEST_LEAVE = 'supertipset/groups/REQUEST_LEAVE'
export const RECEIVE_LEAVE = 'supertipset/groups/RECEIVE_LEAVE'
// Remove group
const REQUEST_REMOVE = 'supertipset/groups/REQUEST_REMOVE'
const RECEIVE_REMOVE = 'supertipset/groups/RECEIVE_REMOVE'

const initialState = {
    isFetching: false,
    didInvalidate: false,
    data: []
}

export default function reducer(state = initialState, action) {
    switch(action.type) {
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
                data: action.groups
            })
        case RECEIVE_LEAVE:
            return assign(state, {
                data: state.data.filter(group => group.id !== action.group.id)
            })
        // TODO listen to other actions?
        default:
            return state
    }
}

export function invalidateGroups() {
    return { type: INVALIDATE }
}

export function requestGroups() {
    return { type: REQUEST }
}

export function receiveGroups(groups) {
    return { type: RECEIVE, groups }
}

function shouldFetch(groups) {
    if (groups.isFetching) {
        return false
    } else if (groups.data.length == 0) {
        return true
    } else {
        return groups.didInvalidate
    }
}

export function fetchGroups(user, tournament) {
    return (dispatch, getState) => {
        const { groups } = getState()

        if (!shouldFetch(groups)) {
            return Promise.resolve()
        }

        dispatch(requestGroups())

        const url = `${baseURL}/api/groups/list/?users=${user}&tournament=${tournament}`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveGroups(json)))
                } else {
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E103)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to fetch groups', res)
                    }
                }
            })
    }
}

export function requestCreateGroup() {
    return { type: REQUEST_CREATE }
}

export function receiveCreateGroup(group) {
    return { type: RECEIVE_CREATE, group }
}

export function createGroup(user, name, password, tournament) {
    return (dispatch, getState) => {
        dispatch(requestCreateGroup())

        const payload = preparePost({
            user,
            name,
            password,
            tournament
        })

        const url = `${baseURL}/api/groups/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveCreateGroup(json))
                        dispatch(invalidateGroups())
                        browserHistory.push(`/s/groups/${json.id}`)
                        dispatch(successNotification('Liga skapad!'))
                    })
                } else {
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E104)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to create group', res)
                    }
                }
            })
    }
}

export function requestJoinGroup() {
    return { type: REQUEST_JOIN }
}

export function receiveJoinGroup(group) {
    return { type: RECEIVE_JOIN, group }
}

export function joinGroup(user, name, password) {
    return dispatch => {
        dispatch(requestJoinGroup())

        const payload = preparePost({
            user,
            name,
            password
        })

        const url = `${baseURL}/api/users/${user}/group/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveJoinGroup(json))
                        dispatch(invalidateGroups())
                        browserHistory.push(`/s/groups/${json.id}`)
                        dispatch(successNotification('Du har gått med i ligan!'))
                    })
                } else {
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E105)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to join group', res)
                    }
                }
            })
    }
}

export function requestLeaveGroup() {
    return { type: REQUEST_LEAVE }
}

export function receiveLeaveGroup(group) {
    return { type: RECEIVE_LEAVE, group }
}

export function leaveGroup(user, group, admin) {
    return dispatch => {
        dispatch(requestLeaveGroup())

        const payload = preparePut({
            user,
            group,
            admin
        })

        const url = `${baseURL}/api/groups/${group}/leave/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveLeaveGroup(json))
                        dispatch(successNotification('Du har lämnat ligan!'))
                    })
                } else {
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E106)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to leave group', res)
                    }
                }
            })
    }
}

export function requestRemoveGroup() {
    return { type: REQUEST_REMOVE }
}

export function receiveRemoveGroup(group) {
    return { type: RECEIVE_REMOVE, group }
}

export function removeGroup(user, group) {
    return dispatch => {
        dispatch(requestRemoveGroup())

        const payload = { method: 'DELETE' }
        const url = `${baseURL}/api/groups/${group}/`

        return fetch(url, payload)
            .then(res => { 
                if (res.ok) {
                    dispatch(receiveRemoveGroup(group))
                    // NOTE remove from redux state tree
                    dispatch(receiveLeaveGroup({ id: group }))
                } else {
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen. (E107)'))

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('unable to remove group', res)
                    }
                }
            })
    }
}
