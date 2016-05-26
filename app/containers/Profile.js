// import React, { Component } from 'react'
// import { connect } from 'react-redux'
// // import { fetchProfileIfNeeded, fetchProfileFromUser } from '../actions/profile'
// import { fetchProfile } from '../ducks/profile'
// import { Points, SpecialBets, GroupListSummary, ProfileBets } from '../components'
// import EditableUserPassword from './EditableUserPassword'
// 
// class Profile extends Component {
//     constructor(props) {
//         super(props)
//     }
// 
//     // TODO: have a UserProfile and AnyProfile?
// 
//     componentDidMount() {
//         const { dispatch, params, user, tournament } = this.props
// 
//         if (params.hasOwnProperty('id')) {
//             // dispatch(fetchProfileIfNeeded(params.id, tournament))
//             dispatch(fetchProfile(params.id, tournament))
//         } else {
//             //dispatch(fetchProfileIfNeeded(user.id, tournament))
//             dispatch(fetchProfile(user.id, tournament))
//         }
// 
//         // if (params.hasOwnProperty('id') && params.id !== user.id) {
//         //     dispatch(fetchProfileIfNeeded(params.id, tournament))
//         // } else {
//         //     dispatch(fetchProfileFromUser(user.data))
//         // }
//     }
// 
//     render() {
//         const { profile, user } = this.props
// 
//         if (profile.isFetching || !profile.data.hasOwnProperty('id')) {
//             return (
//                 <div class='profile-container'>
//                     profil
//                 </div>
//             )
//         }
// 
//         const isCurrentUser = user.id === profile.data.id
// 
//         return (
//             <div class='profile-container'>
//                 {isCurrentUser ? <EditableUserPassword /> : ''}
//                 <h2>{`${profile.data.firstname} ${profile.data.lastname} (${profile.data.username})`}</h2>
//                 <Points user={profile} />
//                 <SpecialBets user={profile.data} isFetching={false} bettable={false} />
//                 <GroupListSummary groups={profile.data.groups} isCurrentUser={isCurrentUser} />
//                 {!isCurrentUser
//                     ? <ProfileBets bets={profile.data.bets} points={profile.data.points} />
//                     : ''}
//             </div>
//         )
//     }
// }
// 
// const mapStateToProps = state => {
//     const { user, tournament, profile } = state
// 
//     return {
//         user,
//         profile,
//         tournament
//     }
// }
// 
// export default connect(
//     mapStateToProps
// )(Profile)
