import React from 'react'
import { Link } from 'react-router'

const member = tournamentHasStarted => (m, i) => {
    return (
        <div key={i} className='group-row'>
            <span className='pos'>{i + 1}</span>
            <span className='member'>
                <Link to={`/s/profile/${m.id}`}>{m.username}</Link>
            </span>
            <span className='team'>{tournamentHasStarted ? m.team : '-'}</span>
            <span className='points'>{m.totalPoints}</span>
        </div>
    )
}

// Various reducers
const reduceTeamName = (p, c) => c.team.name
const reducePoints = (p, c) => p += c.points
const reduceBetResults = (p, c) => c.player + c.goals + c.team

const sortByPoints = (a, b) => b.totalPoints - a.totalPoints

const getUser = u => ({
    id: u.id,
    username: u.username,
    team: u.special_bets.reduce(reduceTeamName, '-'),
    totalPoints: u.points.reduce(reducePoints, 0) + u.special_bet_results.reduce(reduceBetResults, 0)
})

const GroupMembers = ({ group, tournamentHasStarted, children }) => {
    const orderedMembers = group.users.map(getUser).sort(sortByPoints)

    return (
        <div className='group-container'>
            {children}
            <div className='group-headers'>
                <h6 className='pos'>#</h6>
                <h6 className='member'>Medlem</h6>
                <h6 className='team'>Lag</h6>
                <h6 className='points'>Poäng</h6>
            </div>
            {orderedMembers.map(member(tournamentHasStarted))} 
        </div>
    )
}

export default GroupMembers
