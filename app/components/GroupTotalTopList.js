import React from 'react'
import { Link } from 'react-router'

const group = (g, i) => {
    return (
        <li key={i}>{i+1} | <Link to={`/s/groups/${g.id}`}>{g.name}</Link> | {g.totalPoints}</li>
    )
}

const reduceUserPoints = (a, n) => a + n.points
const reduceUserBetResults = (a, n) => a + (n.goals + n.player + n.team)
const reduceUserTotal = (a, n) => (
    a + n.points.reduce(reduceUserPoints, 0)
      + n.special_bet_results.reduce(reduceUserBetResults, 0)
)

const GroupTotalTopList = ({ groups }) => {

    if (groups.isFetching || groups.data.length == 0) {
        return <p>Laddar grupper</p>
    }

    const orderedGroups = groups.data
        .map(g => {
            return {
                id: g.id,
                name: g.name,
                totalPoints: g.users.reduce(reduceUserTotal, 0)
            }
        })
        .sort((a, b) => b.totalPoints - a.totalPoints)

    return (
        <ol>
            {orderedGroups.map(group)}
        </ol>
    )
}

export default GroupTotalTopList
