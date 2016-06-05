import React from 'react'
import { connect } from 'react-redux'
import { openChangeTournamentModal } from '../ducks/modal'

const ChangeTournamentButton = ({ tournament, tournaments, openModal }) => {
    const t = tournaments.data.filter(t => t.id == tournament).reduce((a, b) => b, {})

    return <button onClick={openModal} className='change-tournament' type='button'>{t.name}</button>
}

export default connect(
    // State to props
    state => ({
        tournament: state.tournament,
        tournaments: state.tournaments
    }),
    // Dispatch to props
    dispatch => ({
        openModal: () => dispatch(openChangeTournamentModal())
    })
)(ChangeTournamentButton)
