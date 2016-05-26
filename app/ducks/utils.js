export function assign(state, newState) {
    return Object.assign({}, state, newState)
}

export function prepare(method, body) {
    return {
        method: method,
        headers: new Headers({ 'Content-type': 'application/json' }),
        body: JSON.stringify(body)
    }
}

export function preparePost(body)  {
    return prepare('POST', body)
}

export function preparePut(body)  {
    return prepare('PUT', body)
}
