import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    fetchTop10Points,
    fetchTop10Bets,
    fetchTop10Average,
    fetchTop10Members
} from '../ducks/toplists'

import {
    Top10Points,
    Top10Bets,
    Top10Average,
    Top10Members
} from '../components'

class TopList extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { dispatch, tournament } = this.props

        dispatch(fetchTop10Points(tournament))
        dispatch(fetchTop10Bets(tournament))
        dispatch(fetchTop10Average(tournament))
        dispatch(fetchTop10Members())
    }

    render() {
        const { toplists } = this.props

        return (
            <div>
                <div className='toplists-container'>
                    <Top10Points top10points={toplists.top10points} />
                    <Top10Bets top10bets={toplists.top10bets} />
                </div>
                <div className='toplists-container'>
                    <Top10Average top10average={toplists.top10average} />
                    <Top10Members top10members={toplists.top10members} />
                </div>
            </div>
        )
    }
}

export default connect(
    // State to props
    state => ({
        user: state.user,
        tournament: state.tournament,
        toplists: state.toplists
    })
)(TopList)
