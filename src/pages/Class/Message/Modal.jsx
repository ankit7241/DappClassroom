import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";


import Input from "./Input";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";

import avatar from "../../../assets/img/placeholder_avatar.png"

export default function Modal({ data, setShowModal, showModal }) {

    const [loading, setLoading] = useState("");
    const [msgData, setMsgData] = useState(null);

    const fetchData = async (id) => {
        setLoading(true)
        //Enter your function here

        setMsgData([
            {
                from: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                timestamp: "1686508212592",
                message: `Greetings! 
There is an update to the assignment for React.js. The fifth task has been made optional. Bonus points will be awarded for completing the same. Feel free to reach out to us via email or leave a comment in the classroom if you have any queries. 
                
All the best!
~Atharv Varshney`,
            },
            {
                from: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                timestamp: "1686508212592",
                message: `Greetings! 
There is an update to the assignment for React.js. The fifth task has been made optional. Bonus points will be awarded for completing the same. Feel free to reach out to us via email or leave a comment in the classroom if you have any queries. 
                
All the best!
~Atharv Varshney`,
            },
            {
                from: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                timestamp: "1686508212592",
                message: `Greetings! 
There is an update to the assignment for React.js. The fifth task has been made optional. Bonus points will be awarded for completing the same. Feel free to reach out to us via email or leave a comment in the classroom if you have any queries. 
                
All the best!
~Atharv Varshney`,
            },
        ]);
        setLoading(false)
    };

    useEffect(() => {
        // if (data && data.id) {
        if (data) {
            (async () => {
                await fetchData(data);
            })();
        }
    }, [data]);

    return (
        <Container onClick={() => setShowModal(false)}>
            <Main onClick={(e) => e.stopPropagation()}>

                {
                    loading
                        ? <Loading text="Loading replies..." />
                        : <>
                            <h2>All Replies</h2>

                            <Input data={data} />

                            <div>
                                {
                                    msgData
                                        ? msgData.length > 0
                                            ? msgData?.map((item) => {
                                                return <Message data={item} />;
                                            })
                                            : <p style={{ textAlign: "center" }}>No messages found</p>
                                        : <p style={{ textAlign: "center" }}>No messages found</p>
                                }
                            </div>

                        </>
                }
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

		/* input,
		textarea {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 10px 20px;
			gap: 15px;

			background: rgba(255, 255, 255, 0.05);
			border: 1px solid rgba(255, 255, 255, 0.2);
			border-radius: 10px;
			outline: none;

			font-family: Groteska;
			font-size: var(--font-md);
			line-height: 125%;
			color: rgba(255, 255, 255, 0.8);
		}

		textarea {
			height: 100px;
			resize: vertical;
		} */

		/* div {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			gap: 10px;
			width: 100%;

			input {
				flex: 1;
			}
		} */
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

    const shortenAddress = (address, place) => {
        return (address.slice(0, place) + "..." + address.slice(-place))
    }

    return (
        <MsgContainer>
            <MsgTop>
                <img src={avatar} alt="" />
                <div>
                    <p><span title={data.from}>({shortenAddress(data.from, 4)})</span></p>
                    <p>{new Date(parseInt(data.timestamp)).toLocaleTimeString("en-us", { hour: "2-digit", minute: "2-digit" })} {new Date(parseInt(data.timestamp)).toLocaleString('default', { day: "numeric", month: 'long' })}</p>
                </div>
            </MsgTop>
            <p>{data.message}</p>
        </MsgContainer>
    )
}

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
`

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
`