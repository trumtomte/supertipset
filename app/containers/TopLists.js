import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    fetchUsersForTopLists,
    fetchGroupsForTopLists
} from '../ducks/toplists'

import {
    UserTotalTopList,
    UserTopBets,
    GroupAverageTopList,
    GroupTotalTopList,
    GroupMembersTopList
} from '../components'

class TopList extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { dispatch, user, tournament } = this.props

        dispatch(fetchUsersForTopLists(tournament))
        dispatch(fetchGroupsForTopLists(tournament))
    }

    render() {
        const { toplists } = this.props

        return (
            <div>
                <div className='toplists-container'>
                    <UserTotalTopList users={toplists.users} />
                    <UserTopBets users={toplists.users} />
                </div>
                <div className='toplists-container'>
                    <GroupAverageTopList groups={toplists.groups} />
                    <GroupMembersTopList groups={toplists.groups} />
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
