import React from 'react'
import { Link } from 'react-router'

const group = (g, i) => (
    <div key={i} className='toplist-row'>
        <span className='pos'>
            {i + 1}
        </span>
        <span className='name'>
            <Link to={`/s/groups/${g.id}`}>{g.name}</Link>
        </span>
        <span className='sum'>
            {g.member_count}
        </span>
    </div>
)

const Top10Members = ({ top10members }) => {

    if (top10members.isFetching || top10members.data.length == 0) {
        return (
            <div className='toplist-container'>
                <h2>Medlemmar</h2>
                <div className='toplist user-total'>
                    <div className='toplist-headers'>
                        <h6 className='pos'>#</h6>
                        <h6 className='name'>Liga</h6>
                        <h6 className='sum'>Antal</h6>
                    </div>
                    {top10members.isFetching
                        ? <div className='loading'></div>
                        : <p></p>}
                </div>
            </div>
        )
    }

    return (
        <div className='toplist-container'>
            <h2>Medlemmar</h2>
            <div className='toplist user-total'>
                <div className='toplist-headers'>
                    <h6 className='pos'>#</h6>
                    <h6 className='name'>Liga</h6>
                    <h6 className='sum'>Antal</h6>
                </div>
                {top10members.data.map(group)}
            </div>
        </div>
    )
}

export default Top10Members
