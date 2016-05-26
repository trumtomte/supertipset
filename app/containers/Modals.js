import React from 'react'
import { connect } from 'react-redux'
import {
    PlaceBetModal,
    PlaceSpecialBetModal,
    JoinGroupModal,
    CreateGroupModal,
    LeaveGroupModal,
    GroupDescriptionModal,
    GroupPasswordModal,
    UserPasswordModal,
    ChangeTournamentModal
} from '../modals'

// Map action type to component
const MODALS = {
    'supertipset/modal/BET': PlaceBetModal,
    'supertipset/modal/SPECIAL_BET': PlaceSpecialBetModal,
    'supertipset/modal/JOIN_GROUP': JoinGroupModal,
    'supertipset/modal/CREATE_GROUP': CreateGroupModal,
    'supertipset/modal/LEAVE_GROUP': LeaveGroupModal,
    'supertipset/modal/EDIT_GROUP_DESCRIPTION': GroupDescriptionModal,
    'supertipset/modal/EDIT_GROUP_PASSWORD': GroupPasswordModal,
    'supertipset/modal/EDIT_USER_PASSWORD': UserPasswordModal,
    'supertipset/modal/CHANGE_TOURNAMENT': ChangeTournamentModal
}

const Modals = ({ modal }) => {
    const { modalType, modalProps } = modal

    if (typeof modalType === 'undefined') {
        return null
    }

    const Modal = MODALS[modalType]

    return <Modal {...modalProps} />
}

export default connect(
    // State to props
    state => ({ modal: state.modal })
)(Modals)

