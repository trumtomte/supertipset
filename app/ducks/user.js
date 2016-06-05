import fetch from 'isomorphic-fetch'
import { successNotification, errorNotification } from './notification'
import { baseURL, assign, preparePut, preparePost } from './utils'
import { RECEIVE_LEAVE, RECEIVE_JOIN, RECEIVE_CREATE } from './groups'

const INVALIDATE = 'supertipset/user/INVALIDATE'
// User
const REQUEST = 'supertipset/user/REQUEST'
const RECEIVE = 'supertipset/user/RECEIVE'
// Place bet 
const REQUEST_BET = 'supertipset/user/REQUEST_BET'
const RECEIVE_BET = 'supertipset/user/RECEIVE_BET'
const UPDATE_BET = 'supertipset/user/UPDATE_BET'
// Place special bet
const REQUEST_SPECIAL_BET = 'supertipset/user/REQUEST_SPECIAL_BET'
export const RECEIVE_SPECIAL_BET = 'supertipset/user/RECEIVE_SPECIAL_BET'
export const UPDATE_SPECIAL_BET = 'supertipset/user/UPDATE_SPECIAL_BET'
// Change user password
const REQUEST_EDIT_PASSWORD = 'supertipset/user/REQUEST_EDIT_PASSWORD'
const RECEIVE_EDIT_PASSWORD = 'supertipset/user/RECEIVE_EDIT_PASSWORD'

const initialState = {
    isFetching: false,
    didInvalidate: false,
    id: window.userID,
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
                data: action.user
            })
        case RECEIVE_BET:
            return assign(state, {
                data: assign(state.data, {
                    bets: state.data.bets.concat(action.bet)
                })
            })
        case UPDATE_BET:
            return assign(state, {
                data: assign(state.data, {
                    bets: state.data.bets.map(b => b.id == action.bet.id ? action.bet : b)
                })
            })
        case RECEIVE_SPECIAL_BET:
            return assign(state, {
                data: assign(state.data, {
                    special_bets: state.data.special_bets.concat(action.specialBet)
                })
            })
        case UPDATE_SPECIAL_BET:
            return assign(state, {
                data: assign(state.data, {
                    special_bets: state.data.special_bets.map(b => b.id == action.specialBet.id ? action.specialBet : b)
                })
            })
        case RECEIVE_CREATE:
        case RECEIVE_JOIN:
            return assign(state, {
                data: assign(state.data, {
                    groups: state.data.groups.concat(action.group)
                })
            })
        case RECEIVE_LEAVE:
            return assign(state, {
                data: assign(state.data, {
                    groups: state.data.groups.filter(group => group.id !== action.group.id)
                })
            })
        // TODO listen to all actions?
        default:
            return state
    }
}

export function invalidateUser() {
    return { type: INVALIDATE }
}

export function requestUser() {
    return { type: REQUEST }
}

export function receiveUser(user) {
    return { type: RECEIVE, user }
}

function shouldFetch(user) {
    if (user.isFetching) {
        return false
    } else if (!user.data.hasOwnProperty('id')) {
        return true 
    } else {
        return user.didInvalidate
    }
}

export function fetchUser(id, tournament) {
    return (dispatch, getState) => {
        const { user } = getState()

        if (!shouldFetch(user)) {
            return Promise.resolve()
        }

        dispatch(requestUser())

        const url = `${baseURL}/api/users/${id}/detail/?tournament=${tournament}`

        return fetch(url)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => dispatch(receiveUser(json)))
                } else {
                    // console.log('unable to fetch user')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}

export function requestEditUserPassword() {
    return { type: REQUEST_EDIT_PASSWORD }
}

export function receiveEditUserPassword(user) {
    return { type: RECEIVE_EDIT_PASSWORD, user }
}

export function editUserPassword(id, username, password) {
    return dispatch => {
        dispatch(requestEditUserPassword())

        const payload = preparePut({
            id,
            username,
            password
        })

        const url = `${baseURL}/api/users/${id}/password/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveEditUserPassword(json))
                        dispatch(successNotification('Lösenord redigerat!'))
                    })
                } else {
                    // console.log('unable to change user password')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}

export function requestBet() {
    return { type: REQUEST_BET }
}

export function receiveBet(bet) {
    return { type: RECEIVE_BET, bet }
}

export function updateBet(bet) {
    return { type: UPDATE_BET, bet }
}

export function placeBet(user, game, betTeamOne, betTeamTwo) {
    return dispatch => {
        dispatch(requestBet())

        const payload = preparePost({
            user,
            game,
            team_1_bet: betTeamOne,
            team_2_bet: betTeamTwo
        })

        const url = `${baseURL}/api/bets/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveBet(json))
                        dispatch(successNotification('Tips sparat!'))
                    })
                } else {
                    // console.log('unable to place bet')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}

export function replaceBet(bet, betTeamOne, betTeamTwo) {
    return dispatch => {
        dispatch(requestBet())

        const payload = preparePut({
            team_1_bet: betTeamOne,
            team_2_bet: betTeamTwo
        })

        const url = `${baseURL}/api/bets/${bet}/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(updateBet(json))
                        dispatch(successNotification('Tips sparat!'))
                    })
                } else {
                    // console.log('unable to update bet')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}

export function requestSpecialBet() {
    return { type: REQUEST_SPECIAL_BET }
}

export function receiveSpecialBet(specialBet) {
    return { type: RECEIVE_SPECIAL_BET, specialBet }
}

export function updateSpecialBet(specialBet) {
    return { type: UPDATE_SPECIAL_BET, specialBet }
}

export function placeSpecialBet(user, player, goals, team, tournament) {
    return dispatch => {
        dispatch(requestSpecialBet())

        const payload = preparePost({
            user,
            team,
            player,
            tournament,
            player_goals: goals
        })

        const url = `${baseURL}/api/specialbets/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(receiveSpecialBet(json))
                        dispatch(successNotification('Specialtips sparat!'))
                    })
                } else {
                    // console.log('unable to place special bet')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}

export function replaceSpecialBet(bet, player, goals, team) {
    return dispatch => {
        dispatch(requestSpecialBet())

        const payload = preparePut({
            team,
            player,
            player_goals: goals
        })

        const url = `${baseURL}/api/specialbets/${bet}/`

        return fetch(url, payload)
            .then(res => {
                if (res.ok) {
                    res.json().then(json => {
                        dispatch(updateSpecialBet(json))
                        dispatch(successNotification('Specialtips uppdaterat!'))
                    })
                } else {
                    // console.log('unable to update special bet')
                    dispatch(errorNotification('Tekniskt fel! Vänligen försök igen.'))
                }
            })
    }
}
