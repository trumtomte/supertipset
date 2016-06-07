import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchGroups } from '../ducks/groups'
import { GroupList } from '../components'
import JoinGroupButton from './JoinGroupButton'
import CreateGroupButton from './CreateGroupButton'

class Groups extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { dispatch, user, tournament } = this.props
        dispatch(fetchGroups(user.id, tournament))
    }

    render() {
        const { groups, tournament, tournaments } = this.props

        // If we should continue to show the special bets button
        const now = new Date()
        const currTournament = tournaments.data.filter(t => t.id == tournament)[0]
        const currTournamentDate = currTournament ? new Date(currTournament.start_date) : false
        const tournamentHasStarted = now > currTournamentDate

        return (
            <div className='groups-container'>
                <div className='group-actions'>
                    <JoinGroupButton />
                    <span className='div'>|</span>
                    <CreateGroupButton />
                </div>
                <GroupList
                    tournamentHasStarted={tournamentHasStarted}
                    groups={groups} />
            </div>
        )
    }
}

export default connect(
    // State to props
    state => ({
        user: state.user,
        groups: state.groups,
        tournament: state.tournament,
        tournaments: state.tournaments
    })
)(Groups)
