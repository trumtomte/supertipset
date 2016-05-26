import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { joinGroup } from '../ducks/group'
import Modal from './Modal'

const JoinGroupModal = ({ user, groups, dispatch }) => {
    // Mutable form-data
    let data = {
        name: '',
        password: ''
    }

    const submit = e => {
        e.preventDefault()

        if (data.name === '' || data.password === '') {
            // TODO error notification
            dispatch(closeModal())
            return false
        }

        // Check group names from groups of the current user
        const groupExists = groups.data.filter(g => g.name === data.name).length

        if (groupExists) {
            // TODO error notification
            dispatch(closeModal())
            return false
        }

        dispatch(joinGroup(user.id, data.name, data.password))
        dispatch(closeModal())
    }

    const setData = e => data[e.target.name] = e.target.value
    const focus = r => r ? r.focus() : false

    return (
        <Modal submit={submit}>
            <h2 className='modal-title'>Gå med i liga</h2>
            <p className='modal-description'>Fyll i ligans namn samt lösenord</p>
            <input
                onChange={setData}
                ref={focus}
                type='text'
                name='name'
                placeholder='Liga' />
            <input
                onChange={setData}
                type='password'
                name='password'
                placeholder='Lösenord' />
        </Modal>
    )
}

export default connect(
    // State to props
    state => ({
        user: state.user,
        groups: state.groups
    })
)(JoinGroupModal)
