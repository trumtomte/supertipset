import React from 'react'
import { connect } from 'react-redux'
import { openEditUserPasswordModal } from '../ducks/modal'

const EditUserPasswordButton = ({ openModal }) => (
    <button
        onClick={openModal}
        className='edit-user-password'
        type='button'>
        Ändra lösenord
    </button>
)

export default connect(
    // State to props
    state => ({ user: state.user }),
    // Dispatch to props
    dispatch => ({
        openModal: () => dispatch(openEditUserPasswordModal())
    })
)(EditUserPasswordButton)
