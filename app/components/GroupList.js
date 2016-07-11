import React from 'react'
import { Link } from 'react-router'
import { LeaveGroupButton } from '../containers'
import GroupMembers from './GroupMembers'

const group = tournamentHasStarted => (g, i) => (
    <GroupMembers key={i} group={g} tournamentHasStarted={tournamentHasStarted}>
        <div className='group-name'>
            <Link to={`/s/groups/${g.id}`}>{g.name}</Link>
            <LeaveGroupButton group={g} />
        </div>
    </GroupMembers>
)

const GroupList = ({ groups, tournamentHasStarted }) => {
    if (groups.isFetching) {
        return <div className='groups'><div className='loading'></div></div>
    }

    if (groups.data.length === 0) {
        return <div className='groups'><p>Du är inte med i några ligor.</p></div>
    }

    return (
        <div className='groups'>
            {groups.data.map(group(tournamentHasStarted))}
        </div>
    )
}

export default GroupList
