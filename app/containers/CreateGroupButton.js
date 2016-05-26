import React from 'react'
import { connect } from 'react-redux'
import { openCreateGroupModal } from '../ducks/modal'

const CreateGroup = ({ openModal }) => {
    return (
        <button
            onClick={openModal}
            className='create-group'
            type='button'>
            Skapa liga
        </button>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user }),
    // Dispatch to props
    dispatch => ({
        openModal: () => dispatch(openCreateGroupModal())
    })
)(CreateGroup)
