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

        if (betExists) {
            // Update a current bet
            dispatch(replaceBet(
                bet.id,
                data.teamOne,
                data.teamTwo
            ))
        } else {
            const now = new Date()
            const gameStart = new Date(game.start_date)

            // Game has already started
            if (now > gameStart) {
                dispatch(errorNotification('Ouch! Deadline har passerat.'))
            } else {
                // Place a new bet
                dispatch(placeBet(
                    user.id,
                    game.id,
                    data.teamOne,
                    data.teamTwo
                ))
            }
        }

        dispatch(closeModal())
    }

    const setData = e => data[e.target.name] = Number(e.target.value)
    const focus = r => r ? r.focus() : false

    return (
        <Modal submit={submit}>
            <h2 className='modal-title'>Tippa</h2>
            <p className='modal-description'>
                {game.team_1.name} -  {game.team_2.name}
            </p>
            <div className='game-bets'>
                <input
                    onChange={setData}
                    ref={focus}
                    defaultValue={betExists ? bet.team_1_bet : 0}
                    min='0'
                    type='number'
                    name='teamOne' />
                <input
                    onChange={setData}
                    defaultValue={betExists ? bet.team_2_bet : 0}
                    min='0'
                    type='number'
                    name='teamTwo' />
            </div>
        </Modal>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user })
)(PlaceBetModal)
