import React from 'react'
import { Link } from 'react-router'

const group = (g, i) => {
    return (
        <div key={i} className='toplist-row'>
            <span className='pos'>{i + 1}</span>
            <span className='name'>
                <Link to={`/s/groups/${g.id}`}>{g.name}</Link>
            </span>
            <span className='sum'>{g.averagePoints}</span>
        </div>
    )
}

// Various reducers
const reduceUserPoints = (a, n) => a + n.points
const reduceUserBetResults = (a, n) => a + (n.goals + n.player + n.team)
const reduceUserTotal = (a, n) => (
    a + n.points.reduce(reduceUserPoints, 0)
      + n.special_bet_results.reduce(reduceUserBetResults, 0)
)

const sortByPoints = (a, b) => b.averagePoints - a.averagePoints

const getGroupWithPoints = g => ({
    id: g.id,
    name: g.name,
    averagePoints: Math.floor(g.users.reduce(reduceUserTotal, 0) / g.users.length)
})

const GroupAverageTopList = ({ groups }) => {

    if (groups.isFetching || groups.data.length == 0) {
        return (
            <div className='toplist-container'>
                <h2>Medelpoäng</h2>
                <div className='toplist user-total'>
                    <div className='toplist-headers'>
                        <h6 className='pos'>#</h6>
                        <h6 className='name'>Liga</h6>
                        <h6 className='sum'>Poäng</h6>
                    </div>
                    {groups.isFetching
                        ? <div className='loading'></div>
                        : <p></p>}
                </div>
            </div>
        )
    }

    const orderedGroups = groups.data.map(getGroupWithPoints).sort(sortByPoints)

    return (
        <div className='toplist-container'>
            <h2>Medelpoäng</h2>
            <div className='toplist user-total'>
                <div className='toplist-headers'>
                    <h6 className='pos'>#</h6>
                    <h6 className='name'>Liga</h6>
                    <h6 className='sum'>Poäng</h6>
                </div>
                {orderedGroups.slice(0, 10).map(group)}
            </div>
        </div>
    )
}

export default GroupAverageTopList
