import { assign } from './utils'

// open / close
const OPEN = 'supertipset/modal/OPEN'
const CLOSE = 'supertipset/modal/CLOSE'
// different modal types
const BET = 'supertipset/modal/BET'
const SPECIAL_BET = 'supertipset/modal/SPECIAL_BET'
const JOIN_GROUP = 'supertipset/modal/JOIN_GROUP'
const CREATE_GROUP = 'supertipset/modal/CREATE_GROUP'
const LEAVE_GROUP = 'supertipset/modal/LEAVE_GROUP'
const EDIT_GROUP_DESCRIPTION = 'supertipset/modal/EDIT_GROUP_DESCRIPTION'
const EDIT_GROUP_PASSWORD = 'supertipset/modal/EDIT_GROUP_PASSWORD'
const EDIT_USER_PASSWORD = 'supertipset/modal/EDIT_USER_PASSWORD'
const CHANGE_TOURNAMENT = 'supertipset/modal/CHANGE_TOURNAMENT'

const initialState = {
    modalType: undefined,
    modalProps: {}
}

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case OPEN:
            return assign(state, {
                modalType: action.modalType,
                modalProps: action.modalProps
            })
        case CLOSE:
            return assign(state, initialState)
        default:
            return state
    }
}

export function closeModal() {
    return { type: CLOSE }
}

export function openBetModal(game) {
    return {
        type: OPEN,
        modalType: BET,
        modalProps: { game }
    }
}

export function openSpecialBetModal() {
    return {
        type: OPEN,
        modalType: SPECIAL_BET,
        modalProps: {}
    }
}

export function openJoinGroupModal() {
    return {
        type: OPEN,
        modalType: JOIN_GROUP,
        modalProps: {}
    }
}

export function openCreateGroupModal() {
    return {
        type: OPEN,
        modalType: CREATE_GROUP,
        modalProps: {}
    }
}

export function openLeaveGroupModal(group) {
    return {
        type: OPEN,
        modalType: LEAVE_GROUP,
        modalProps: { group }
    }
}

export function openEditGroupDescriptionModal(group) {
    return {
        type: OPEN,
        modalType: EDIT_GROUP_DESCRIPTION,
        modalProps: { group }
    }
}

export function openEditGroupPasswordModal(group) {
    return {
        type: OPEN,
        modalType: EDIT_GROUP_PASSWORD,
        modalProps: { group }
    }
}

export function openEditUserPasswordModal(user) {
    return {
        type: OPEN,
        modalType: EDIT_USER_PASSWORD,
        modalProps: { user }
    }
}

export function openChangeTournamentModal() {
    return {
        type: OPEN,
        modalType: CHANGE_TOURNAMENT,
        modalProps: {}
    }
}
