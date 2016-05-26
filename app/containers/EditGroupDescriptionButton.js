import React from 'react'
import { connect } from 'react-redux'
import { openEditGroupDescriptionModal } from '../ducks/modal'

const EditGroupDescriptionButton = ({ user, group, openModal }) => {
    const open = group => () => openModal(group)

    return (
        <button
            onClick={open(group)}
            className='edit-group-description'
            type='button'>
            Redigera
        </button>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user }),
    // Dispatch to props
    dispatch => ({
        openModal: g => dispatch(openEditGroupDescriptionModal(g))
    })
)(EditGroupDescriptionButton)
