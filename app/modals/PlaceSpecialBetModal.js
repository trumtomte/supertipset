import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { placeSpecialBet } from '../ducks/user'
import Modal from './Modal'

// <option> for a team
const teamOpt = (t, i) => (
    <option key={i} value={t.id}>
        {t.name}
    </option>
)

// <option> for a player
const playerOpt = (p, i) => (
    <option key={i} value={p.id}>
        {p.firstname} {p.lastname}
    </option>
)

const PlaceSpecialBetModal = ({ user, teams, players, tournament, dispatch }) => {
    // Mutable form-data + defaults
    let data = {
        team: teams.data[0].id,
        player: teams.data[0].id,
        goals: 0
    }

    const close = () => dispatch(closeModal())

    const submit = (e) => {
        e.preventDefault()

        if (user.data.special_bets.length) {
            console.log('has special bets - should send PUT request')
        }

        dispatch(placeSpecialBet(
            user.id,
            data.player,
            data.goals,
            data.team,
            tournament
        ))

        dispatch(closeModal())
    }

    // TODO check if data for teams/players is available? i.e not fetching
    
    const setData = e => data[e.target.name] = Number(e.target.value)

    return (
        <Modal submit={submit}>
            <h2 className='modal-title'>Tippa specialtips</h2>

            <h3>Vinnare</h3>
            <select
                onChange={setData}
                name='team'>
                {teams.data.map(teamOpt)}
            </select>

            <h3>Skyttekung</h3>
            <select
                onChange={setData}
                name='player'>
                {players.data.map(playerOpt)}
            </select>

            <h3>Mål</h3>
            <input
                onChange={setData}
                defaultValue={0}
                min='0'
                className='special-bet-goals'
                type='number'
                name='goals' />
        </Modal>
    )
}

export default connect(
    // State to props
    state => ({
        user: state.user,
        teams: state.teams,
        players: state.players,
        tournament: state.tournament
    })
)(PlaceSpecialBetModal)

