import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import getClassData from "../../utils/getClassData"

import HomeCard from "../../components/HomeCard";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import ConnectWalletFallback from "../../components/ConnectWalletFallback";

import NoClassSvg from "../../assets/img/no_class.svg";
import Modal from "../../components/AddClass/Modal";

export default function Home() {
    const { isConnected } = useAccount();

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true)
        const data = await getClassData();

        if (data.status === "Error") {
            toast.error(data.data.msg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setClasses([]);
        } else {
            setClasses(data.data);
        }
        setLoading(false)
    };

    useEffect(() => {
        (async () => {
            await fetchData();
        })();
    }, []);

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
            {isConnected ?
                loading
                    ? (<Loading />)
                    : classes?.length > 0
                        ? (
                            <CardContainer>
                                {classes?.map((item, ind) => {
                                    return <HomeCard key={ind} _data={item} />;
                                })}
                            </CardContainer>
                        )
                        : (
                            <FallbackCont>
                                <img src={NoClassSvg} />
                                <p>Add a class to get started</p>
                                <div>
                                    <Button onClick={() => setShowModal(true)}>Join Class</Button>
                                    <Button onClick={() => setShowModal(true)}>Create Class</Button>
                                </div>
                            </FallbackCont >
                        )
                : <ConnectWalletFallback />
            }
        </>
    )
}

const CardContainer = styled.div`
	margin-top: 75px;
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	padding: 0px 50px;
	gap: 50px;
	flex: 1;
`;

const FallbackCont = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	gap: 30px;
	height: 100%;
	flex: 1;

    img {
        height: 200px;
    }

	p {
		font-weight: 400;
		font-size: var(--font-lg);
		line-height: 125%;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 0.9);
	}

    div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

    button {
        padding: 10px 30px;
    }

    button:nth-child(1) {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.75);
    }
`;