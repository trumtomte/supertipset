import React from 'react'
import { connect } from 'react-redux'
import { SpecialBets } from '../components'
import { openSpecialBetModal } from '../ducks/modal'

const PlaceSpecialBetButton = ({ openModal }) => (
    <button
        onClick={openModal}
        className='place-special-bet-button'
        type='button'>
        Tippa
    </button>
)

export default connect(
    // State to props
    state => ({ user: state.user }),
    // Dispatch to props
    dispatch => ({
        openModal: () => dispatch(openSpecialBetModal())
    })
)(PlaceSpecialBetButton)
