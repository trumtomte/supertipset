import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProfile } from '../ducks/profile'
import { Profile } from '../components'

class UserProfile extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { dispatch, user, tournament } = this.props

        dispatch(fetchProfile(user.id, tournament))
    }

    render() {
        const { user, profile } = this.props

        if (profile.isFetching || !profile.data.hasOwnProperty('id')) {
            return <div className='profile-container'>Laddar</div>
        }

        const isCurrentUser = user.id === profile.data.id

        return <Profile profile={profile} isCurrentUser={isCurrentUser} />
    }
}

export default connect(
    // State to props
    state => ({
        user: state.user,
        profile: state.profile,
        tournament: state.tournament
    })
)(UserProfile)
