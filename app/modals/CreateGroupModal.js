import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { createGroup } from '../ducks/groups'
import { errorNotification } from '../ducks/notification'
import Modal from './Modal'

const CreateGroupModal = ({ user, tournament, dispatch }) => {
    // Mutable form-data
    let data = {
        name: '',
        passwordOne: '',
        passwordTwo: ''
    }

    const submit = e => {
        e.preventDefault()

        if (data.name == ''
            || data.passwordOne == ''
            || data.passwordOne !== data.passwordTwo) {
            dispatch(closeModal())
            dispatch(errorNotification('Vänligen fyll i alla fält på ett korrekt vis!'))
            return false
        }

        dispatch(createGroup(
            user.id,
            data.name,
            data.passwordOne,
            tournament
        ))
        dispatch(closeModal())
    }

    const setData = e => data[e.target.name] = e.target.value
    const focus = r => r ? r.focus() : false

    return (
        <Modal submit={submit}>
            <h2 className='modal-title'>Skapa liga</h2>
            <p className='modal-description'>Fyll i ligans namn och lösenord</p>
            <input
                onChange={setData}
                ref={focus}
                type='text'
                max='48'
                name='name'
                placeholder='Namn' />
            <input
                onChange={setData}
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
    state => ({
        user: state.user, 
        tournament: state.tournament
    })
)(CreateGroupModal)
