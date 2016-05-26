import { browserHistory } from 'react-router'
import { invalidateGroup } from './group'
import { invalidateGroups } from './groups'
import { invalidateProfile } from './profile'
import { invalidateTopLists } from './toplists'
import { invalidateUser, fetchUser } from './user'
import { invalidateRounds, fetchRounds } from './rounds'

const CHANGE = 'supertipset/tournament/CHANGE'

const initialState = window.tournamentID

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE:
            return action.id
        default:
            return state
    }
}

export function change(id) {
    return { type: CHANGE, id }
}

export function changeTournament(id) {
    return (dispatch, getState) => {
        const { user } = getState()

        dispatch(change(id))

        dispatch(invalidateUser())
        dispatch(invalidateRounds())
        dispatch(invalidateProfile())
        dispatch(invalidateGroup())
        dispatch(invalidateGroups())
        dispatch(invalidateTopLists())
        dispatch(fetchRounds(id))
        dispatch(fetchUser(user.id, id))
        browserHistory.push('/s/bets')
    }
}
