import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { editGroupDescription } from '../ducks/group'
import Modal from './Modal'

const GroupDescriptionModal = ({ group, user, dispatch }) => {
    // Mutable form-data
    let data = { description: '' }

    const submit = e => {
        e.preventDefault()
        dispatch(editGroupDescription(
            user.id,
            group.id,
            group.name,
            data.description
        ))
        dispatch(closeModal())
    }

    const setData = e => data[e.target.name] = e.target.value
    const focus = r => r ? r.focus() : false

    return (
        <Modal submit={submit}>
            <h2 className='modal-title'>Redigera liga</h2>
            <p className='modal-description'>Fyll i en beskrivning</p>
            <textarea
                onChange={setData}
                defaultValue={group.description}
                ref={focus}
                name='description'>
            </textarea>
        </Modal>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user })
)(GroupDescriptionModal)
