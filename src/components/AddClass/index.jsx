import React, { useState, useEffect } from 'react';
import Plus from "../../assets/img/plus.svg";
import Modal from './Modal';

export default function AddClass() {

    const [showModal, setShowModal] = useState(false);

    // On toggle of Modal, change the scroll mode of body
    useEffect(() => {
        if (showModal) {
            window.scroll(0, 0)
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "scroll";
        }
    }, [showModal]);

    return (
        <>
            {showModal && <Modal showModal={showModal} setShowModal={setShowModal} />}

            <img src={Plus} onClick={() => setShowModal(true)} />
        </>
    )
}
