import React from 'react'
import { Link } from 'react-router'
import { LeaveGroupButton } from '../containers'
import GroupMembers from './GroupMembers'

const group = (g, i) => {
    return (
        <GroupMembers key={i} group={g}>
            <div className='group-name'>
                <Link to={`/s/groups/${g.id}`}>{g.name}</Link>
                <LeaveGroupButton group={g} />
            </div>
        </GroupMembers>
    )
}

const sortByGroupName = (a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1

const GroupList = ({ groups }) => {
    if (groups.isFetching) {
        return <div className='groups'><p>Laddar...</p></div>
    }

    if (groups.data.length === 0) {
        return <div className='groups'><p>Du är inte med i några ligor.</p></div>
    }

    return (
        <div className='groups'>
            {groups.data.sort(sortByGroupName).map(group)} 
        </div>
    )
}

export default GroupList

