import React from 'react'
import { connect } from 'react-redux'
import { hideNotification } from '../ducks/notification'

const SuccessNotification = ({ dispatch, message }) => {
    const hide = () => dispatch(hideNotification())

    return (
        <div className='notification success' onClick={hide}>
            <p>{message}</p>
        </div>
    )
}

export default connect(
    state => ({ notification: state.notification })
)(SuccessNotification)
