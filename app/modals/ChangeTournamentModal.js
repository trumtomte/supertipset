import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { changeTournament } from '../ducks/tournament'
import Modal from './Modal'

// <option> for a tournament
const tournamentOpt = (t, i) => <option key={i} value={t.id}>{t.name}</option>

const ChangeTournamentModal = ({ dispatch, tournaments, tournament }) => {
    // Mutable form-data
    let data = { tournament: tournament }

    const submit = e => {
        e.preventDefault()
        dispatch(changeTournament(data.tournament))
        dispatch(closeModal())
    }

    const setData = e => data[e.target.name] = Number(e.target.value)
    const focus = r => r ? r.focus() : false

    return (
        <Modal submit={submit}>
            <h2 className='modal-title'>Ändra turnering</h2>
            <p className='modal-description'>Välj turnering</p>
            <select
                onChange={setData}
                defaultValue={tournament}
                name='tournament'>
                {tournaments.data.map(tournamentOpt)}
            </select>
        </Modal>
    )
}

export default connect(
    // state to props
    state => ({
        tournament: state.tournament,
        tournaments: state.tournaments
    })
)(ChangeTournamentModal)




