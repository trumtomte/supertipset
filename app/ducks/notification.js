import { assign } from './utils'

const HIDE = 'supertipset/notification/HIDE'
const SHOW = 'supertipset/notification/SHOW'

const SUCCESS = 'supertipset/notification/SUCCESS'

const initialState = {
    notificationType: undefined,
    notificationProps: {}
}

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case SHOW:
            return assign(state, {
                notificationType: action.notificationType,
                notificationProps: action.notificationProps
            })
        case HIDE:
            return assign(state, initialState)
        default:
            return state
    }
}

export function hideNotification() {
    return { type: HIDE }
}

export function showNotification(notificationType, notificationProps) {
    return { type: SHOW, notificationType, notificationProps }
}

export function publishNotification(type, props) {
    return (dispatch, getState) => {
        setTimeout(() => {
            if (getState().notification.notificationType) {
                dispatch(hideNotification())
            }
        }, 3000)

        dispatch(showNotification(type, props))
    }
}

export function successNotification(message) {
    return publishNotification(SUCCESS, { message })
}
