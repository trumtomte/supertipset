import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchRounds } from '../ducks/rounds'
import { Points, Rounds, SpecialBets } from '../components'
import PlaceSpecialBetButton from './PlaceSpecialBetButton'

class Bets extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { dispatch, user, tournament } = this.props
        // TODO do i need to re-fetch user here?
        dispatch(fetchRounds(tournament))
    }

    render() {
        const { user, rounds } = this.props

        return (
            <div className='bets-container'>
                <Points user={user} />
                <SpecialBets user={user} bettable={true} />
                <Rounds rounds={rounds} />
            </div>
        )
    }
}

export default connect(
    // State to props
    state => ({
        user: state.user,
        rounds: state.rounds,
        tournament: state.tournament
    })
)(Bets)
