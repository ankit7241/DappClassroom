import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { useLocation } from "react-router";

import { HuddleIframe } from "@huddle01/iframe";
import { useEventListner } from "@huddle01/iframe";
import { iframeApi } from "@huddle01/iframe";
import axios from "axios";

import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../../ContractDetails";

import Loading from "../../components/Loading";

export default function Huddle({ id }) {
    const [roomId, setRoomId] = useState();
    const roomIdRef = useRef(roomId);
    const [isLoading, setIsLoading] = useState(true);
    const [loadMsg, setLoadMsg] = useState("Loading meet...");
    const location = useLocation();

    roomIdRef.current = roomId;
    async function FetchClassData() {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    ABI,
                    signer
                );
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                });

                let classTeacherAddress;

                setLoadMsg("Fetching details...")
                await connectedContract
                    .getClassTeacherAddress(id)
                    .then((classIdCount) => {
                        classTeacherAddress = `${classIdCount}`;
                    });

                if (classTeacherAddress.toLowerCase() === accounts[0].toLowerCase()) {
                    const response = await axios.post(
                        "https://api.huddle01.com/api/v1/create-iframe-room",
                        {
                            title: "DappClassroom",
                            roomLocked: false,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": "u9pq0Qh4zJ5MYKsynBW2MoBJDQRZOj65",
                            },
                        }
                    );

                    setLoadMsg("Setting up meeting link")
                    setRoomId(response.data.data.roomId);
                    let changeMeetCode = await connectedContract.changeMeetCode(id, response.data.data.roomId);
                    await changeMeetCode.wait();

                } else {
                    let classMeetCode;

                    setLoadMsg("Fetching meeting link...")
                    await connectedContract.getClassMeetCode(id).then((classIdCount) => {
                        classMeetCode = `${classIdCount}`;
                    });

                    setRoomId(classMeetCode);
                }
                setIsLoading(false);
                setLoadMsg(null)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (id) {
            (async () => {
                await FetchClassData();
            })();
        }
    }, [id]);

    useEventListner("lobby:initialized", (data) => {
        iframeApi.initialize({
            redirectUrlOnLeave: window.location.origin + location.pathname,
            background: "https://ipfs.io/ipfs/bafybeih57dsp2gopifd7bnghpbr7vx6yxjtoxynlyr27bsc7zyesi4reqe/image.png",
        });
    });

    return (
        <Container>
            {
                isLoading
                    ? <Loading text={loadMsg} />
                    : <StyledHuddleIframe
                        roomUrl={"https://iframe.huddle01.com/" + roomIdRef.current}
                        height="700px"
                        width="100%"
                    />
            }
        </Container>
    );
}


const Container = styled.div`
    max-width: 100vw !important;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.9);

    display: flex;
    justify-content: center;
    align-items: center;
`

const StyledHuddleIframe = styled(HuddleIframe)`
    width: calc((100vh - 40px) * 16 / 9);
    height: calc(100vh - 40px);
    overflow: hidden;
    outline: none;
    border: 2px solid rgba(255, 255, 255, 0.2);
`