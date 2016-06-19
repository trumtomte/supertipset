import React from 'react'
import Points from './Points'
import SpecialBets from './SpecialBets'
import GroupListSummary from './GroupListSummary'
import ProfileBets from './ProfileBets'
import { EditUserPasswordButton } from '../containers'

const Profile = ({ profile, tournamentHasStarted, isCurrentUser }) => {

    const fullname = `${profile.data.firstname} ${profile.data.lastname}`
    const username = <small>({profile.data.username})</small>

    return (
        <div className='profile'>
                {isCurrentUser ? <EditUserPasswordButton /> : ''}

                <h2>{fullname} {username}</h2>

                <Points user={profile} />

                <SpecialBets
                    user={profile}
                    tournamentHasStarted={tournamentHasStarted}
                    bettable={isCurrentUser} />

                {profile.data.groups.length
                    ? <GroupListSummary
                        user={profile}
                        groups={profile.data.groups}
                        isCurrentUser={isCurrentUser} />
                    : ''}

                {!isCurrentUser && profile.data.bets.length
                    ? <ProfileBets
                        bets={profile.data.bets}
                        points={profile.data.points} />
                    : ''}
        </div>
    )
}

export default Profile
