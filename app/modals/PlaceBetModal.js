import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'
import { placeBet, replaceBet } from '../ducks/user'
import Modal from './Modal'

const PlaceBetModal = ({ user, game, dispatch }) => {
    // Mutable form-data + defaults
    let data = {
        teamOne: 0,
        teamTwo: 0
    }

    const bet = user.data.bets
        .filter(b => b.game.id == game.id)
        .reduce((a, b) => b, {})

    const betExists = bet.hasOwnProperty('id')

    const close = () => dispatch(closeModal())

    // TODO check if game has started etc
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
