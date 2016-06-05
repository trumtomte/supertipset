import React from 'react'

const hasStarted = gameStart => {
    const now = new Date()
    const start = new Date(Date.parse(gameStart))

    return now > start
}

const showBet = points => (bet, i) => {
    const p = points.filter(point => point.game === bet.game.id)

    // if we should show profile bets or not
    const showBet = hasStarted(bet.game.start_date)

    if (!showBet) {
        return null
    }

    return (
        <div key={i} className='profile-bet'>
            <span className='game'>
                {`${bet.game.team_1.name} - ${bet.game.team_2.name}`}
            </span>
            <span className='res'>
                {bet.game.result.length ? `${bet.game.result[0].team_1_goals} - ${bet.game.result[0].team_2_goals}` : '-'}
            </span>
            <span className='bet'>
                {`${bet.team_1_bet} - ${bet.team_1_bet}`}
            </span>
            <span className='points'>
                {p.length ? p[0].points : '-'}
            </span>
        </div>
    )
}

const ProfileBets = ({ bets, points }) => {
    return (
        <div className='profile-bets-container'>
            <h2>Tips</h2>
            <div className='profile-bets-headers'>
                <h6 className='game'>Match (grupp)</h6>
                <h6 className='res'>Resultat</h6>
                <h6 className='bet'>Tips</h6>
                <h6 className='points'>Poäng</h6>
            </div>
            {bets.map(showBet(points))}
        </div>
    )
}


export default ProfileBets
