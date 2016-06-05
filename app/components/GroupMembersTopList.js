import React from 'react'
import { Link } from 'react-router'

const group = (g, i) => {
    return (
        <div key={i} className='toplist-row'>
            <span className='pos'>{i + 1}</span>
            <span className='name'>
                <Link to={`/s/groups/${g.id}`}>{g.name}</Link>
            </span>
            <span className='sum'>{g.members}</span>
        </div>
    )
}

const sortByMembers = (a, b) => b.members - a.members
const getGroupWithMembers = g => ({
    id: g.id,
    name: g.name,
    members: g.users.length
})

const GroupMembersTopList = ({ groups }) => {

    if (groups.isFetching || groups.data.length == 0) {
        return (
            <div className='toplist-container'>
                <h2>Medlemmar</h2>
                <div className='toplist user-total'>
                    <div className='toplist-headers'>
                        <h6 className='pos'>#</h6>
                        <h6 className='name'>Liga</h6>
                        <h6 className='sum'>Antal</h6>
                    </div>
                    <p>
                        {groups.isFetching ? 'Laddar...' : ''}
                    </p>
                </div>
            </div>
        )
    }

    const orderedGroups = groups.data.map(getGroupWithMembers).sort(sortByMembers)

    return (
        <div className='toplist-container'>
            <h2>Medlemmar</h2>
            <div className='toplist user-total'>
                <div className='toplist-headers'>
                    <h6 className='pos'>#</h6>
                    <h6 className='name'>Liga</h6>
                    <h6 className='sum'>Antal</h6>
                </div>
                {orderedGroups.map(group)}
            </div>
        </div>
    )
}

export default GroupMembersTopList
