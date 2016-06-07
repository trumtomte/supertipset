import React from 'react'
import { Link } from 'react-router'

const user = (u, i) => {
    return (
        <div key={i} className='toplist-row'>
            <span className='pos'>{i + 1}</span>
            <span className='name'>
                <Link to={`/s/profile/${u.id}`}>{u.username}</Link>
            </span>
            <span className='sum'>{u.totalPoints}</span>
        </div>
    )
}

const reducePoints = (a, n) => a + n.points
const reduceBetResults = (a, n) => a + (n.goals + n.player + n.team)
const sortByPoints = (a, b) => b.totalPoints - a.totalPoints
const getUserWithPoints = u => ({
    id: u.id,
    username: u.username,
    totalPoints: u.points.reduce(reducePoints, 0) + u.special_bet_results.reduce(reduceBetResults, 0)
})

const UserTotalTopList = ({ users }) => {

    if (users.isFetching || users.data.length == 0) {
        return (
            <div className='toplist-container'>
                <h2>Högsta poäng</h2>
                <div className='toplist user-total'>
                    <div className='toplist-headers'>
                        <span>#</span>
                        <span>Användare</span>
                        <span>Poäng</span>
                    </div>
                    <p>Laddar...</p>
                </div>
            </div>
        )
    }

    const orderedUsers = users.data.map(getUserWithPoints).sort(sortByPoints)

    return (
        <div className='toplist-container'>
            <h2>Högsta poäng</h2>
            <div className='toplist user-total'>
                <div className='toplist-headers'>
                    <h6 className='pos'>#</h6>
                    <h6 className='name'>Användare</h6>
                    <h6 className='sum'>Poäng</h6>
                </div>
                {orderedUsers.slice(0, 10).map(user)}
            </div>
        </div>
    )
}

export default UserTotalTopList
