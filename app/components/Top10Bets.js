import React from 'react'
import { Link } from 'react-router'

const user = (u, i) => (
    <div key={i} className='toplist-row'>
        <span className='pos'>{i + 1}</span>
        <span className='name'>
            <Link to={`/s/profile/${u.id}`}>{u.username}</Link>
        </span>
        <span className='sum'>{u.top_bet_count}</span>
    </div>
)

const Top10Bets = ({ top10bets }) => {

    if (top10bets.isFetching || top10bets.data.length == 0) {
        return (
            <div className='toplist-container'>
                <h2>Flest 10:or</h2>
                <div className='toplist user-total'>
                    <div className='toplist-headers'>
                        <span>#</span>
                        <span>Användare</span>
                        <span>Poäng</span>
                    </div>
                    {top10bets.isFetching
                        ? <div className='loading'></div>
                        : <p></p>}
                </div>
            </div>
        )
    }

    return (
        <div className='toplist-container'>
            <h2>Flest 10:or</h2>
            <div className='toplist user-total'>
                <div className='toplist-headers'>
                    <h6 className='pos'>#</h6>
                    <h6 className='name'>Användare</h6>
                    <h6 className='sum'>Antal</h6>
                </div>
                {top10bets.data.map(user)}
            </div>
        </div>
    )
}

export default Top10Bets
