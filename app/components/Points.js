import React from 'react'

const sum = p => p.reduce((a, n) => a + n.points, 0)

const getSumOfPoints = user => {
    const pointsSum = user.data.points.reduce((a, n) => a + n.points, 0)
    const specialBetsPointsSum = user.data.special_bet_results.reduce((a, n) => a + (n.goals + n.player + n.team), 0)
    return pointsSum + specialBetsPointsSum
}

const Points = ({ user }) => {
    return (
        <div className='user-points'>
            <h6>POÄNG</h6>
            <p>
                {!user.isFetching && user.data.hasOwnProperty('id')
                    ? getSumOfPoints(user)
                    : '-'}
            </p>
        </div>
    )
}

export default Points
