import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { placeBet, replaceBet } from '../ducks/user'
import { errorNotification } from '../ducks/notification'
import Modal from './Modal'

const PlaceBetModal = ({ user, game, dispatch }) => {
    const bet = user.data.bets
        .filter(b => b.game.id == game.id)
        .reduce((a, b) => b, {})

    const betExists = bet.hasOwnProperty('id')
    
    // Mutable form-data + defaults
    let data = {
        teamOne: betExists ? bet.team_1_bet : 0,
        teamTwo: betExists ? bet.team_2_bet : 0
    }

    const close = () => dispatch(closeModal())

    const submit = (e) => {
        e.preventDefault()
        const now = new Date()
        const gameStart = new Date(game.start_date)

        // Game has already started
        if (now > gameStart) {
            dispatch(errorNotification('Ouch! Deadline har passerat.'))
            dispatch(closeModal())
            return false
        }

        if (betExists) {
            // Update a current bet
            dispatch(replaceBet(
                bet.id,
                data.teamOne,
                data.teamTwo
            ))
        } else {
            // Place a new bet
            dispatch(placeBet(
                user.id,
                game.id,
                data.teamOne,
                data.teamTwo
            ))
        }

        dispatch(closeModal())
    }

    const setData = e => data[e.target.name] = Number(e.target.value)
    const focus = r => r ? r.focus() : false

    // <input
    //     onChange={setData}
    //     ref={focus}
    //     defaultValue={betExists ? bet.team_1_bet : 0}
    //     min='0'
    //     type='number'
    //     name='teamOne' />
    // <input
    //     onChange={setData}
    //     defaultValue={betExists ? bet.team_2_bet : 0}
    //     min='0'
    //     type='number'
    //     name='teamTwo' />

    return (
        <Modal submit={submit}>
            <h2 className='modal-title'>Tippa</h2>
            <p className='modal-description'>
                {game.team_1.name} -  {game.team_2.name}
            </p>
            <div className='game-bets'>
                <select
                    onChange={setData}
                    defaultValue={betExists ? bet.team_1_bet: 0}
                    name='teamOne'>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>
                <select
                    onChange={setData}
                    defaultValue={betExists ? bet.team_2_bet: 0}
                    name='teamTwo'>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>
            </div>
        </Modal>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user })
)(PlaceBetModal)
