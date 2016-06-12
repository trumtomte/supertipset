import React from 'react'
import Round from './Round'

const round = (r, i) => <Round key={i} round={r} />

const Rounds = ({ rounds }) => {
    if (rounds.isFetching || rounds.data.length === 0) {
        return <div className='rounds'><div className='loading'></div></div>
    }

    return (
        <div className='rounds'>
            {rounds.data.map(round)}
        </div>
    )
}


export default Rounds
