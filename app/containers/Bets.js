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
        dispatch(fetchRounds(tournament))
    }

    render() {
        const { user, rounds, tournament, tournaments } = this.props
        
        // If we should continue to show the special bets button
        const now = new Date()
        const currTournament = tournaments.data.filter(t => t.id == tournament)[0]
        const currTournamentDate = currTournament ? new Date(currTournament.start_date) : false
        const tournamentHasStarted = now > currTournamentDate

        return (
            <div className='bets-container'>
                <Points
                    user={user} />
                <SpecialBets
                    user={user}
                    tournamentHasStarted={tournamentHasStarted}
                    bettable={true} />
                <Rounds
                    rounds={rounds} />
            </div>
        )
    }
}

export default connect(
    // State to props
    state => ({
        user: state.user,
        rounds: state.rounds,
        tournament: state.tournament,
        tournaments: state.tournaments
    })
)(Bets)
