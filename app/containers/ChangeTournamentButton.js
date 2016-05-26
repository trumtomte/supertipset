import React from 'react'
import { connect } from 'react-redux'
import { openChangeTournamentModal } from '../ducks/modal'

const ChangeTournamentButton = ({ tournament, tournaments, openModal }) => {
    const name = tournaments.data.filter(t => t.id == tournament)[0].name

    // TODO what should be the display text?
    return <button onClick={openModal} className='change-tournament' type='button'>{name}</button>
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
