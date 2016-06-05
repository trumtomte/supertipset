import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { editUserPassword } from '../ducks/user'
import { errorNotification } from '../ducks/notification'
import Modal from './Modal'

const UserPasswordModal = ({ user, dispatch }) => {
    // Mutable form-data
    let data = {
        passwordOne: '',
        passwordTwo: ''
    }

    const submit = e => {
        e.preventDefault()

        if (data.passwordOne == '' || data.passwordOne !== data.passwordTwo) {
            dispatch(closeModal())
            dispatch(errorNotification('Lösenorden stämde inte - försök igen!'))
            return false
        }

        dispatch(editUserPassword(user.id, user.username, data.passwordOne))
        dispatch(closeModal())
    }

    const setData = e => data[e.target.name] = e.target.value
    const focus = r => r ? r.focus() : false

    return (
        <Modal submit={submit}>
            <h2 className='modal-title'>Redigera användare</h2>
            <p className='modal-description'>Fyll i ett nytt lösenord</p>
            <input
                onChange={setData}
                ref={focus} 
                type='password'
                name='passwordOne'
                placeholder='Lösenord' />
            <input
                onChange={setData}
                type='password'
                name='passwordTwo'
                placeholder='Upprepa lösenord' />
        </Modal>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user })
)(UserPasswordModal)
