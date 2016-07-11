import React from 'react'
import { Link } from 'react-router'

const user = (u, i) => (
    <div key={i} className='toplist-row'>
        <span className='pos'>{i + 1}</span>
        <span className='name'>
            <Link to={`/s/profile/${u.id}`}>{u.username}</Link>
        </span>
        <span className='sum'>{u.total_points}</span>
    </div>
)

const Top10Points = ({ top10points }) => {

    if (top10points.isFetching || top10points.data.length == 0) {
        return (
            <div className='toplist-container'>
                <h2>Högsta poäng</h2>
                <div className='toplist user-total'>
                    <div className='toplist-headers'>
                        <span>#</span>
                        <span>Användare</span>
                        <span>Poäng</span>
                    </div>
                    {top10points.isFetching
                        ? <div className='loading'></div>
                        : <p></p>}
                </div>
            </div>
        )
    }

    return (
        <div className='toplist-container'>
            <h2>Högsta poäng</h2>
            <div className='toplist user-total'>
                <div className='toplist-headers'>
                    <h6 className='pos'>#</h6>
                    <h6 className='name'>Användare</h6>
                    <h6 className='sum'>Poäng</h6>
                </div>
                {top10points.data.map(user)}
            </div>
        </div>
    )
}

export default Top10Points
