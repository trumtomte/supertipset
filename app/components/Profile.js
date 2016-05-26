import React from 'react'
import Points from './Points'
import SpecialBets from './SpecialBets'
import GroupListSummary from './GroupListSummary'
import ProfileBets from './ProfileBets'
import { EditUserPasswordButton } from '../containers'

const Profile = ({ profile, isCurrentUser }) => {

    const fullname = `${profile.data.firstname} ${profile.data.lastname}`
    const username = <small>({profile.data.username})</small>

    return (
        <div className='profile'>
                {isCurrentUser ? <EditUserPasswordButton /> : ''}
                <h2>
                    {fullname} {username}
                </h2>
                <Points user={profile} />
                <SpecialBets
                    user={profile}
                    bettable={isCurrentUser} />
                <GroupListSummary
                    user={profile}
                    groups={profile.data.groups}
                    isCurrentUser={isCurrentUser} />
                {!isCurrentUser
                    ? <ProfileBets
                        bets={profile.data.bets}
                        points={profile.data.points} />
                    : ''}
        </div>
    )
}

export default Profile
