import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../ducks/modal'

const Modal = ({ dispatch, submit, children }) => {

    const close = () => dispatch(closeModal())

    return (
        <div className='modal-container'>
            <div onClick={close} className='modal-overlay'></div>
            <div className='modal-content'>
                <form onSubmit={submit}>
                    {children}
                    <div className='modal-actions'>
                        <button onClick={close} className='modal-cancel' type='button'>Avbryt</button>
                        <button className='modal-ok'>OK</button>
                    </div>
                </form>
                <div onClick={close} className='modal-close'></div>
            </div>
        </div>
    )
}

export default connect(
    // State to props
    state => ({ modal: state.modal })
)(Modal)
