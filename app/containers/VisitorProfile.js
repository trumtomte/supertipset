import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProfile, invalidateProfile } from '../ducks/profile'
import { Profile } from '../components'

class VisitorProfile extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { profile, dispatch, params, tournament } = this.props
        dispatch(fetchProfile(params.id, tournament))
    }

    componentDidUpdate(prevProps) {
        const { profile, dispatch, params, tournament } = this.props

        // On route change to same endpoint (but new id) - refetch the profile
        if (prevProps.params.id != params.id) {
            dispatch(fetchProfile(params.id, tournament))
        }
    }

    render() {
        const { user, profile, tournament, tournaments, params, dispatch } = this.props

        if (profile.isFetching || !profile.data.hasOwnProperty('id')) {
            return <div className='profile-container'><div className='loading'></div></div>
        }

        const isCurrentUser = user.id === profile.data.id
        
        // If we should continue to show the special bets button
        const now = new Date()
        const currTournament = tournaments.data.filter(t => t.id == tournament)[0]
        const currTournamentDate = currTournament ? new Date(currTournament.start_date) : false
        const tournamentHasStarted = now > currTournamentDate

        return (
            <Profile
                profile={profile}
                tournamentHasStarted={tournamentHasStarted}
                isCurrentUser={isCurrentUser} />
        )
    }
}

export default connect(
    // State to props
    state => ({
        user: state.user,
        profile: state.profile,
        tournament: state.tournament,
        tournaments: state.tournaments
    })
)(VisitorProfile)
