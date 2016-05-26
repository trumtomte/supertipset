import React from 'react'

const sum = p => p.reduce((a, n) => a + n.points, 0)

const Points = ({ user }) => {
    return (
        <div className='user-points'>
            <h6>POÄNG</h6>
            <p>
                {!user.isFetching && user.data.hasOwnProperty('id')
                    ? sum(user.data.points)
                    : '-'}
            </p>
        </div>
    )
}

export default Points
