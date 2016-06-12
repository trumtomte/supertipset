import React from 'react'

const getSumOfPoints = user => {
    const pointsSum = user.data.points.reduce((a, n) => a + n.points, 0)
    const specialBetsPointsSum = user.data.special_bet_results.reduce((a, n) => a + (n.goals + n.player + n.team), 0)
    return pointsSum + specialBetsPointsSum
}

const getSumOfSpecialBet = (user, type) => {
    return user.data.special_bet_results.reduce((a, n) => a + n[type], 0)
}

const Points = ({ user }) => {

    if (user.isFetching || !user.data.hasOwnProperty('id')) {
        return (
            <div className='user-points'>
                <h6>POÄNG</h6>
                <p>-</p>
                <span>Specialtips - / - / -</span>
            </div>
        )
    }

    const specialBetExists = user.data.special_bet_results.length > 0

    const pointsForTeam = specialBetExists ? getSumOfSpecialBet(user, 'team') : '-'
    const pointsForPlayer = specialBetExists ? getSumOfSpecialBet(user, 'player') : '-'
    const pointsForGoals = specialBetExists ? getSumOfSpecialBet(user, 'goals') : '-'

    return (
        <div className='user-points'>
            <h6>POÄNG</h6>
            <p>
                {getSumOfPoints(user)}
            </p>
            <span>
                Specialtips {pointsForTeam} / {pointsForPlayer} / {pointsForGoals}
            </span>
        </div>
    )
}

export default Points
