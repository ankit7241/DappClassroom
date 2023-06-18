import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";

import getEnsData from "../../../utils/getEnsData";

import Input from "./Input";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";

import avatar from "../../../assets/img/placeholder_avatar.png";

export default function Modal({ data, setShowModal, showModal }) {
    const [loading, setLoading] = useState("");
    const [msgData, setMsgData] = useState(null);

    const fetchData = async (id) => {
        setLoading(true);
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                });

                const message = data.message;

                const startMarker = "****###@@";
                const endMarker = "####***@@";

                const startIndex = message.indexOf(startMarker) + startMarker.length;
                const endIndex = message.indexOf(endMarker);

                const chatId = message.substring(startIndex, endIndex);

                const pvtKeyStartIndex = endIndex + endMarker.length;
                const pvtKey = message.substring(pvtKeyStartIndex);

                const user = await PushAPI.user.get({
                    account: `eip155:${accounts[0]}`,
                    env: "staging",
                });

                // need to decrypt the encryptedPvtKey to pass in the api using helper function
                const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
                    encryptedPGPPrivateKey: user.encryptedPrivateKey,
                    signer: signer,
                });

                // conversation hash are also called link inside chat messages
                const conversationHash = await PushAPI.chat.conversationHash({
                    account: `${accounts[0]}`,
                    conversationId: `${chatId}`, // receiver's address or chatId of a group
                    env: "staging",
                });

                // actual api
                const chatHistory = await PushAPI.chat.history({
                    threadhash: conversationHash.threadHash,
                    account: `${accounts[0]}`,
                    limit: 30,
                    toDecrypt: true,
                    pgpPrivateKey: pgpDecryptedPvtKey,
                    env: "staging",
                });

                const Data = [];

                chatHistory.forEach((item) => {
                    const from = item.fromCAIP10.slice(7);
                    const timestamp = item.timestamp;
                    const message = item.messageContent;

                    const msgObj = {
                        from: `${from}`,
                        timestamp: `${timestamp}`,
                        message: `${message}`,
                    };
                    Data.push(msgObj);
                });
                setMsgData(Data);
                setLoading(false);
            } else {
                console.log("Ethereum object doesn't exist!");
                toast.error("Some problem with Metamask! Please try again", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setLoading(false);
            }
        } catch (error) {
            console.log(error);

            if (error.toString().includes("user rejected signing")) {
                toast.error("Please sign messages to load chat history!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (error.toString().includes("Request failed with status code 400")) {
                toast.error("No replies found!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                toast.error("Unexpected error occurred while loading the messages!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }


            setLoading(false);
        }
    };

    useEffect(() => {
        if (data) {
            (async () => {
                await fetchData(data);
            })();
        }
    }, [data]);

    return (
        <Container onClick={() => setShowModal(false)}>
            <Main onClick={(e) => e.stopPropagation()}>
                {loading ? (
                    <Loading text="Loading replies..." />
                ) : (
                    <>
                        <h2>All Replies</h2>

                        <Input data={data} />

                        <div>
                            {msgData ? (
                                msgData.length > 0 ? (
                                    msgData?.map((item, ind) => {
                                        return <Message key={ind} data={item} />;
                                    })
                                ) : (
                                    <p style={{ textAlign: "center" }}>No messages found</p>
                                )
                            ) : (
                                <p style={{ textAlign: "center" }}>No messages found</p>
                            )}
                        </div>
                    </>
                )}
            </Main>
        </Container>
    );
}

const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.75);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
`;

const Main = styled.div`
	z-index: 3;
	width: 50%;
	max-height: 90vh;
	overflow-y: auto;
	background-color: var(--bg);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 20px;
	padding: 20px 40px;

	padding-bottom: 40px;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 30px;

	h2 {
		font-weight: 500;
		font-size: var(--font-xxl);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.9);
	}

	& > div {
		width: 90%;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	& > p {
		font-size: var(--font-sm);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.75);
		width: 100%;
		text-align: center;
		position: relative;
		z-index: 3;
	}
`;
const StyledButton = styled(Button)`
	border-radius: 10px;
	font-weight: 500;
	padding: 10px;

	svg {
		display: inline;
		width: 25px;
		height: 25px;
		color: rgba(255, 255, 255, 0.05);
		fill: var(--bg);
		animation: spin 0.75s infinite linear;
		margin-left: 7px;
	}
`;

const Message = ({ data }) => {

    const [ensName, setEnsName] = useState(null);
    const [ensAvatar, setEnsAvatar] = useState(null);

    const shortenAddress = (address, place) => {
        return address.slice(0, place) + "..." + address.slice(-place);
    };

    useEffect(() => {
        if (data.from) {
            (async () => {
                const { EnsName, EnsAvatar } = await getEnsData(data.from);
                setEnsName(EnsName)
                setEnsAvatar(EnsAvatar)
            })();
        }
    }, [data]);

    return (
        <MsgContainer>
            <MsgTop>
                <img src={ensAvatar ? ensAvatar : avatar} alt="" />
                <div>
                    <p>
                        {
                            ensName
                                ? <>{data.fromName} <span title={data.from}>({ensName})</span></>
                                : <>{data.fromName} <span title={data.from}>({shortenAddress(data.from, 4)})</span></>
                        }
                    </p>
                    <p>
                        {new Date(parseInt(data.timestamp)).toLocaleTimeString("en-us", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}{" "}
                        {new Date(parseInt(data.timestamp)).toLocaleString("default", {
                            day: "numeric",
                            month: "long",
                        })}
                    </p>
                </div>
            </MsgTop>
            <p>{data.message}</p>
        </MsgContainer>
    );
};

const MsgContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 15px 20px;
	gap: 30px;

	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;

	& > p {
		font-weight: 300;
		font-size: var(--font-sm);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.75);
		white-space: pre-wrap;
		cursor: default;
	}
`;

const MsgTop = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 15px;

	img {
		width: 35px;
		height: 35px;
	}

	& > div {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	& > div > p:nth-child(1) {
		font-weight: 300;
		font-size: var(--font-md);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.66);

		span {
			font-size: var(--font-sm);
			color: rgba(255, 255, 255, 0.5);
		}
	}

	& > div > p:nth-child(2) {
		font-weight: 300;
		font-size: var(--font-sm);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.33);
	}
`;
