import React from 'react'
import { PlaceSpecialBetButton } from '../containers'

const SpecialBets = ({ user, tournamentHasStarted, bettable }) => {

    // <div className='points'>
    //     <h6>POÄNG</h6>
    //     <span>0</span>
    // </div>

    // No special bets available yet
    if (user.isFetching || !user.data.hasOwnProperty('id')) {
        return (
            <div className='special-bets-container'>
                <h5>Specialtips (Laddar...)</h5>
                <div className='special-bets'>
                    <div className='winner'>
                        <h6>Vinnare</h6>
                        <span>-</span>
                    </div>
                    <div className='goal-scorer'>
                        <h6>Skyttekung</h6>
                        <span>-</span>
                    </div>
                    <div className='goals'>
                        <h6>Antal mål</h6>
                        <span>-</span>
                    </div>
                </div>
            </div>
        )
    }

    // No special bets exists
    if (user.data.special_bets.length == 0) {
        return (
            <div className='special-bets-container'>
                <h5>
                    Specialtips
                    {bettable && !tournamentHasStarted ? <PlaceSpecialBetButton /> : ''}
                </h5>
                <div className='special-bets'>
                    <div className='winner'>
                        <h6>Vinnare</h6>
                        <span>-</span>
                    </div>
                    <div className='goal-scorer'>
                        <h6>Skyttekung</h6>
                        <span>-</span>
                    </div>
                    <div className='goals'>
                        <h6>Antal mål</h6>
                        <span>-</span>
                    </div>
                </div>
            </div>
        )
    }


    // TODO Check for special bet results (points)
    const bets = user.data.special_bets[0]

    return (
        <div className='special-bets-container'>
            <h5>
                Specialtips
                {bettable && !tournamentHasStarted ? <PlaceSpecialBetButton /> : ''}
            </h5>
            <div className='special-bets'>
                <div className='winner'>
                    <h6>Vinnare</h6>
                    <span>{bets.team.name}</span>
                </div>
                <div className='goal-scorer'>
                    <h6>Skyttekung</h6>
                    <span>{bets.player.firstname} {bets.player.lastname}</span>
                </div>
                <div className='goals'>
                    <h6>Antal mål</h6>
                    <span>{bets.player_goals}</span>
                </div>
            </div>
        </div>
    )
}

export default SpecialBets
