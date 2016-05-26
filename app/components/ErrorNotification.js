import React from 'react'
import { connect } from 'react-redux'
import { hideNotification } from '../ducks/notification'

const ErrorNotification = ({ dispatch, message }) => {
    const hide = () => dispatch(hideNotification())

    return (
        <div onClick={hide} className='notification error'>
            <p>{message}</p>
        </div>
    )
}

export default connect(
    state => ({ notification: state.notification })
)(ErrorNotification)
