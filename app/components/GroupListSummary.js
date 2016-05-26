import React from 'react'
import { Link } from 'react-router'
import { LeaveGroupButton } from '../containers'

const groupSummary = (user, isCurrentUser) => (g, i) => {
    return (
        <div key={i} className='group-summary-row'>
            <span className='pos'>{i + 1}</span>
            <span className='name'>
                <Link to={`/s/groups/${g.id}`}>{g.name}</Link>
            </span>
            <span className='members'>{g.users.length}</span>
            <span className='admin'>
                {user.data.id == g.admin.id
                    ? g.admin.username
                    : <Link to={`/s/profile/${g.admin.id}`}>{g.admin.username}</Link>}
            </span>
            <span className='leave'>
                {isCurrentUser ? <LeaveGroupButton group={g} /> : ''}
            </span>
        </div>
    )
}

const GroupListSummary = ({ user, groups, isCurrentUser }) => {
    return (
        <div className='groups-summary'>
            <h2>Ligor</h2>
            <div className='group-headers'>
                <h6 className='pos'>#</h6>
                <h6 className='name'>Liga</h6>
                <h6 className='members'>Medlemmar</h6>
                <h6 className='admin'>Admin</h6>
                <h6 className='leave'></h6>
            </div>
            {groups.map(groupSummary(user, isCurrentUser))}
        </div>
    )
}

export default GroupListSummary
