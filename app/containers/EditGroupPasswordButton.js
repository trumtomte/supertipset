import React from 'react'
import { connect } from 'react-redux'
import { openEditGroupPasswordModal } from '../ducks/modal'

const EditGroupPasswordButton = ({ user, group, openModal }) => {
    const open = group => () => openModal(group)

    return (
        <button
            onClick={open(group)}
            className='edit-group-password'
            type='button'>
            Ändra lösenord
        </button>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user }),
    // Dispatch to props
    dispatch => ({
        openModal: g => dispatch(openEditGroupPasswordModal(g))
    })
)(EditGroupPasswordButton)
