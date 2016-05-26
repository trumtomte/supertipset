import React from 'react'

const goBack = () => history.go(-1)

const BackButton = () => (
    <button
        onClick={goBack}
        className='back-button'
        type='button'>
        Tillbaka
    </button>
)

export default BackButton
