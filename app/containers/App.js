import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchTournaments } from '../ducks/tournaments'
import { fetchUser } from '../ducks/user'
import { fetchTeams } from '../ducks/teams'
import { fetchPlayers } from '../ducks/players'
import ChangeTournamentButton from './ChangeTournamentButton'

class App extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { dispatch, user, tournament } = this.props

        dispatch(fetchTournaments())
        dispatch(fetchUser(user.id, tournament))
        dispatch(fetchTeams())
        dispatch(fetchPlayers())
    }
    
    render() {
        const { children, tournaments } = this.props

        const ACTIVE = {
            background: '#1ABC9C',
            color: 'white'
        }

        return (
            <div className='wrapper'>
                <a className='logout' href='/logout'>Logga ut</a>
                <header>
                    <nav>
                        <Link
                            to="/s/bets"
                            activeStyle={ACTIVE}
                            className='bets-link'>
                            Tippa
                        </Link>
                        <Link
                            to="/s/groups"
                            activeStyle={ACTIVE}
                            className='groups-link'>
                            Ligor
                        </Link>
                        <Link
                            to="/s/toplists"
                            activeStyle={ACTIVE}
                            className='toplists-link'>
                            Top 10
                        </Link>
                        <Link
                            to="/s/profile"
                            activeStyle={ACTIVE}
                            className='profile-link'>
                            Profil
                        </Link>

                        {!tournaments.isFetching && tournaments.data.length > 1
                            ? <ChangeTournamentButton />
                            : ''}
                    </nav>
                </header>
                <div className='content'>{children}</div>
                <footer>&copy; Supertipset</footer>
            </div>
        )
    }
}

export default connect(
    // State to props
    state => ({
        user: state.user,
        tournament: state.tournament,
        tournaments: state.tournaments
    })
)(App)
