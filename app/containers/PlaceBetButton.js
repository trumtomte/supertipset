import React from 'react'
import { connect } from 'react-redux'
import { openBetModal } from '../ducks/modal'

const PlaceBetButton = ({ user, game, openModal }) => {
    const open = game => () => openModal(game)

    return (
        <button
            onClick={open(game)}
            className='place-bet-button'
            type='button'>
            Tippa
        </button>
    )
}

export default connect(
    // State to props
    state => ({ user: state.user }),
    // Dispatch to props
    dispatch => ({
        openModal: game => dispatch(openBetModal(game))
    })
)(PlaceBetButton)
