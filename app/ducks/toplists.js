import fetch from 'isomorphic-fetch'
import { errorNotification } from './notification'
import { baseURL, assign } from './utils'

const INVALIDATE = 'supsertipset/toplists/INVALIDATE'
const REQUEST_USERS = 'supsertipset/toplists/REQUEST_USERS'
const RECEIVE_USERS = 'supsertipset/toplists/RECEIVE_USERS'
const REQUEST_GROUPS = 'supsertipset/toplists/REQUEST_GROUPS'
const RECEIVE_GROUPS = 'supsertipset/toplists/RECEIVE_GROUPS'

const initialState = {
    users: {
        isFetching: false,
        didInvalidate: false,
        data: []
    },
    groups: {
        isFetching: false,
        didInvalidate: false,
        data: []
    }
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE:
            return assign(state, {
                users: assign(state.users, { didInvalidate: true }),
                groups: assign(state.groups, { didInvalidate: true })
            })
        case REQUEST_USERS:
            return assign(state, {
                users: assign(state.users, {
                    isFetching: true,
                    didInvalidate: false
                })
            })
        case RECEIVE_USERS:
            return assign(state, {
                users: assign(state.users, {
                    isFetching: false,
                    didInvalidate: false,
                    data: action.users
                })
            })
        case REQUEST_GROUPS:
            return assign(state, {
                groups: assign(state.groups, {
                    isFetching: true,
                    didInvalidate: false
                })
            })
        case RECEIVE_GROUPS:
            return assign(state, {
                groups: assign(state.grous, {
                    isFetching: false,
                    didInvalidate: false,
                    data: action.groups
                })
            })
        default:
            return state
    }
}

export function invalidateTopLists() {
    return { type: INVALIDATE }
}

export function requestUsersForTopLists() {
    return { type: REQUEST_USERS }
}

export function receiveUsersForTopLists(users) {
    return { type: RECEIVE_USERS, users }
}

function shouldFetchUsers(toplists) {
    if (toplists.users.isFetching) {
        return false
    } else if (toplists.users.data.length == 0) {
        return true
    } else {
        return toplists.users.didInvalidate
    }
}

export function fetchUsersForTopLists(tournament) {
    return (dispatch, getState) => {
        const { toplists } = getState()

        if (!shouldFetchUsers(toplists)) {
            return Promise.resolve()
        }

        dispatch(requestUsersForTopLists())

        const url = `${baseURL}/api/users/deep/?tournament=${tournament}`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveUsersForTopLists(json)))
                } else {
                    // console.log('unable to fetch users for top lists')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}

export function requestGroupsForTopLists() {
    return { type: REQUEST_GROUPS }
}

export function receiveGroupsForTopLists(groups) {
    return { type: RECEIVE_GROUPS, groups }
}

function shouldFetchGroups(toplists) {
    if (toplists.groups.isFetching) {
        return false
    } else if (toplists.groups.data.length == 0) {
        return true
    } else {
        return toplists.groups.didInvalidate
    }
}

export function fetchGroupsForTopLists(tournament) {
    return (dispatch, getState) => {
        const { toplists } = getState()

        if (!shouldFetchGroups(toplists)) {
            return Promise.resolve()
        }

        dispatch(requestGroupsForTopLists())

        const url = `${baseURL}/api/groups/deep/?tournament=${tournament}`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveGroupsForTopLists(json)))
                } else {
                    // console.log('unable to fetch groups for top lists')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}
