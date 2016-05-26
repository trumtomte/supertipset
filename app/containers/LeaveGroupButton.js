import React from 'react'
import { connect } from 'react-redux'
import { openLeaveGroupModal } from '../ducks/modal'

const LeaveGroupButton = ({ user, group, openModal }) => {
    const leave = group => () => openModal(group)

    return (
        <button
            onClick={leave(group)}
            className='leave-group'
            type='button'>
            Lämna
        </button>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user }),
    // Dispatch to props
    dispatch => ({
        openModal: group => dispatch(openLeaveGroupModal(group))
    })
)(LeaveGroupButton)
