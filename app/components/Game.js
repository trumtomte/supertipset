import React from 'react'
import { connect } from 'react-redux'
import { PlaceBetButton } from '../containers'

const formatDate = gameStart => {
    const date = new Date(Date.parse(gameStart))

    const d = date.getDate()
    const m = date.getMonth() + 1
    const hour = date.getHours()
    const min = date.getMinutes()
    const hh = hour < 10 ? '0' + hour : hour
    const mm = min < 10 ? '0' + min : min

    return `${d}/${m} ${hh}:${mm}`
}

const hasStarted = start => new Date() > new Date(Date.parse(start))
const hasEnded = end => hasStarted(end)

const getBetsForGame = (id, user) => {
    // filter by game id and reduce to a single object
    return user.data.bets.filter(b => b.game.id == id).reduce((_, b) => b, {})
}

const getPointsForGame = (id, user) => {
    // filter by game id and reduce points to an integer
    return user.data.points.filter(p => p.result.game == id).reduce((_, n) => n.points, 0)
}

const Game = ({ game, user }) => {
    if (user.isFetching || !user.data.hasOwnProperty('id')) {
        return null
    }

    const started = hasStarted(game.start_date)
    const matchup = `${game.team_1.name} - ${game.team_2.name} (${game.group_name})`

    const bet = getBetsForGame(game.id, user)
    const betExists = bet.hasOwnProperty('id')

    if (!started) {
        const start = formatDate(game.start_date)

        return (
            <div className='game-row'>
                <span className='deadline'>
                    {start}
                </span>
                <span className='matchup'>
                    {matchup}
                </span>
                <span className='res'>
                    x - x
                </span>
                <span className='bet'>
                    {betExists
                        ? <span><span>Tips: </span>{bet.team_1_bet} - {bet.team_2_bet}</span>
                        : <span><span>Tips: </span>x - x</span>}
                </span>
                <span className='pts'>
                    <PlaceBetButton game={game} />
                </span>
            </div>
        )
    }

    // check if the end date of game has passed
    const done = hasEnded(game.stop_date)
    const result = game.result.length === 0
        ? 'x - x'
        : `${game.result[0].team_1_goals} - ${game.result[0].team_2_goals}`

    return (
        <div className='game-row'>
            <span className='deadline'>
                {done ? 'Avgjord' : 'Pågår'}
            </span>
            <span className='matchup'>
                {matchup}
            </span>
            <span className='res'>
                {result}
            </span>
            <span className='bet'>
                {betExists
                    ? <span><span>Tips: </span>{bet.team_1_bet} - {bet.team_2_bet}</span>
                    : <span><span>Tips: </span>x - x</span>}
            </span>
            <span className='pts'>
                <p>{betExists ? getPointsForGame(game.id, user) : 0}<span>p</span></p>
            </span>
        </div>
    )
}

export default connect(
    // state to props
    state => ({ user: state.user })
)(Game)
