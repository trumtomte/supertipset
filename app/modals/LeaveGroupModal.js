import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { leaveGroup, removeGroup } from '../ducks/groups'
import Modal from './Modal'

// <option> for a user
const userOpt = (u, i) => <option key={i} value={u.id}>{u.username}</option>

const LeaveGroupModal = ({ user, group, dispatch }) => {
    // Mutable form-data
    let data = { admin: 0 }

    const isAdmin = user.id === group.admin.id

    const submit = e => {
        e.preventDefault()

        // If there is only one user left - remove the group
        if (isAdmin && group.users.length === 1) {
            dispatch(removeGroup(user.id, group.id))
            dispatch(closeModal())
            return false
        }

        dispatch(leaveGroup(user.id, group.id, data.admin))
        dispatch(closeModal())
    }

    // If a user isnt admin - just leave the group
    if (!isAdmin) {
        return (
            <Modal submit={submit}>
                <h2 className='modal-title'>Lämna</h2>
                <p className='modal-description'>Är du säker?</p>
            </Modal>
        )
    }

    // If a user is admin and there is no members left,
    // leave and then remove the group
    if (isAdmin && group.users.length === 1) {
        return (
            <Modal submit={submit}>
                <h2 className='modal-title'>Lämna</h2>
                <p className='modal-description'>Ligan kommer att raderas</p>
            </Modal>
        )
    }

    const setData = e => data[e.target.name] = Number(e.target.value)

    // Default new admin
    data.admin = group.users.filter(u => u.id !== user.id)[0].id

    // If a user is admin and there are more users left,
    // choose a new admin and then leave the group
    return (
        <Modal submit={submit}>
            <h2 className='modal-title'>Lämna</h2>
            <p className='modal-description'>Välj en ny medlem som admin</p>
            <select onChange={setData} name='admin'>
                {group.users.filter(u => u.id !== user.id).map(userOpt)}
            </select>
        </Modal>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user })
)(LeaveGroupModal)


