import React from 'react'
import { connect } from 'react-redux'
import { openJoinGroupModal } from '../ducks/modal'

const JoinGroupButton = ({ openModal }) => (
    <button
        onClick={openModal}
        className='join-group'
        type='button' >
        Gå med i liga
    </button>
)

export default connect(
    // State to props
    state => ({ user: state.user }),
    // Dispatch to props
    dispatch => ({
        openModal: () => dispatch(openJoinGroupModal())
    })
)(JoinGroupButton)
