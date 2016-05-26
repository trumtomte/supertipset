import React from 'react'

const option = (tournament, i) => (
    <option key={i} value={tournament.id}>
        {tournament.name}
    </option>
)

const Tournaments = ({ tournaments, onChange }) => {
    const c = (e) => onChange(Number(e.target.value))

    return (
        <select onChange={c}>
            {tournaments.map(option)}
        </select>
    )
}

export default Tournaments
