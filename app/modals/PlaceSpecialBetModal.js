import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { placeSpecialBet, replaceSpecialBet } from '../ducks/user'
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

// <optgroup> for a team
const teamOptGroup = (t, i) => (
    <optgroup label={t.name} key={i}>
        {t.players.map(playerOpt)}
    </optgroup>
)


const PlaceSpecialBetModal = ({ user, teams, players, tournament, dispatch }) => {
    const bet = user.data.special_bets
        .filter(b => b.tournament == tournament)
        .reduce((a, b) => b, {})

    const betExists = bet.hasOwnProperty('id')

    // Mutable form-data + defaults
    let data = {
        team: betExists ? bet.team.id : teams.data[0].id,
        player: betExists ? bet.player.id : players.data[0].id,
        goals: betExists ? bet.player_goals : 0
    }

    const close = () => dispatch(closeModal())

    const submit = (e) => {
        e.preventDefault()

        if (betExists) {
            // Update a current special bet
            dispatch(replaceSpecialBet(
                bet.id,
                data.player,
                data.goals,
                data.team
            ))
        } else {
            // Place a new special bet
            dispatch(placeSpecialBet(
                user.id,
                data.player,
                data.goals,
                data.team,
                tournament
            ))
        }

        dispatch(closeModal())
    }

    // TODO check if data for teams/players is available? i.e not fetching
    
    const setData = e => data[e.target.name] = Number(e.target.value)

    const teamsWithPlayers = teams.data.map(team => {
        return {
            id: team.id,
            name: team.name,
            players: players.data.filter(p => p.teams[0].id == team.id)
        }
    })

    console.log(teamsWithPlayers)

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
                {teamsWithPlayers.map(teamOptGroup)}
            </select>

            <h3>Mål</h3>
            <input
                onChange={setData}
                defaultValue={betExists ? bet.player_goals : 0}
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

