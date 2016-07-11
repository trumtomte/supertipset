import React from 'react'
import { Link } from 'react-router'

const member = tournamentHasStarted => (m, i) => (
    <div key={i} className='group-row'>
        <span className='pos'>{i + 1}</span>
        <span className='member'>
            <Link to={`/s/profile/${m.id}`}>{m.username}</Link>
        </span>
        <span className='team'>{tournamentHasStarted ? m.country : '-'}</span>
        <span className='points'>{m.total_points}</span>
    </div>
)

const GroupMembers = ({ group, tournamentHasStarted, children }) => (
    <div className='group-container'>
        {children}
        <div className='group-headers'>
            <h6 className='pos'>#</h6>
            <h6 className='member'>Medlem</h6>
            <h6 className='team'>Lag</h6>
            <h6 className='points'>Poäng</h6>
        </div>
        {group.users.map(member(tournamentHasStarted))}
    </div>
)

export default GroupMembers
