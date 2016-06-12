import React from 'react'
import { Link } from 'react-router'

const user = (u, i) => {
    return (
        <div key={i} className='toplist-row'>
            <span className='pos'>{i + 1}</span>
            <span className='name'>
                <Link to={`/s/profile/${u.id}`}>{u.username}</Link>
            </span>
            <span className='sum'>{u.topBets}</span>
        </div>
    )
}

const sortByPoints = (a, b) => b.topBets - a.topBets

const getUserWithPoints = u => ({
    id: u.id,
    username: u.username,
    topBets: u.points.filter(pts => pts.points == 10).length
})

const UserTopBets = ({ users }) => {

    if (users.isFetching || users.data.length == 0) {
        return (
            <div className='toplist-container'>
                <h2>Flest 10:or</h2>
                <div className='toplist user-total'>
                    <div className='toplist-headers'>
                        <span>#</span>
                        <span>Användare</span>
                        <span>Poäng</span>
                    </div>
                    {users.isFetching
                        ? <div className='loading'></div>
                        : <p></p>}
                </div>
            </div>
        )
    }

    const orderedUsers = users.data.map(getUserWithPoints).sort(sortByPoints)

    return (
        <div className='toplist-container'>
            <h2>Flest 10:or</h2>
            <div className='toplist user-total'>
                <div className='toplist-headers'>
                    <h6 className='pos'>#</h6>
                    <h6 className='name'>Användare</h6>
                    <h6 className='sum'>Antal</h6>
                </div>
                {orderedUsers.slice(0, 10).map(user)}
            </div>
        </div>
    )
}

export default UserTopBets
