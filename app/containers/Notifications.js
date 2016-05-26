import React from 'react'
import { connect } from 'react-redux'
import {
    SuccessNotification,
    ErrorNotification
} from '../components'

const NOTIFICATIONS = {
    'supertipset/notification/SUCCESS': SuccessNotification,
    'supertipset/notification/ERROR': ErrorNotification
}

const Notifications = ({ notification }) => {
    const { notificationType, notificationProps } = notification

    if (typeof notificationType === 'undefined') {
        return null
    }

    const Notification = NOTIFICATIONS[notificationType]

    return <Notification {...notificationProps} />
}

export default connect(
    // State to props
    state => ({ notification: state.notification })
)(Notifications)


