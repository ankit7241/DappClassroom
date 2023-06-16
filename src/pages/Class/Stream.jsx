import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";

import getChatHistory from "../../utils/getChatHistory";

import Input from "./Input";
import Message from "./Message";

import CopyIcon from "../../assets/img/copy.svg";
import Loading from "../../components/Loading";
import Button from "../../components/Button";

export default function Stream({ classData }) {
    const shortenAddress = (address, place) => {
        return address?.slice(0, place) + "..." + address?.slice(-place);
    };

    const handleCopy = (txt) => {
        navigator.clipboard.writeText(txt);
        toast.success("Class code copied successfully", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    const [loading, setLoading] = useState(null);
    const [msgData, setMsgData] = useState(null);

    const fetchData = async (id) => {
        const chatHistory = await getChatHistory(id, setLoading);
        if (chatHistory.status === "Success") {
            setMsgData(chatHistory.data)
        }
        else {
            toast.error(chatHistory.data.msg, {
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
    };

    useEffect(() => {
        if (classData && classData.id) {
            (async () => {
                await fetchData(classData.id);
            })();
        }
    }, [classData]);

    return (
        <Container>
            <Top>
                <h2>{classData?.className}</h2>
                <h4>{classData?.section}</h4>
                <p>
                    {classData?.teacherName}{" "}
                    <span>({shortenAddress(classData?.teacherAddress, 4)})</span>
                </p>
            </Top>

            <Main>
                <Left>
                    <CodeDiv>
                        <h3>Class code</h3>
                        <div onClick={() => handleCopy(classData?.id)}>
                            <p>{classData?.id}</p>
                            <img src={CopyIcon} alt="" />
                        </div>
                    </CodeDiv>

                    <AssignmentsDiv>
                        <h3>Upcoming</h3>

                        {classData?.assignments?.map((item, ind) => {
                            return (
                                <div key={ind}>
                                    <p>
                                        Due{" "}
                                        {new Date(parseInt(item.deadline)).toLocaleString(
                                            "default",
                                            { day: "numeric", month: "long" }
                                        )}
                                    </p>
                                    <h4>
                                        {item.name.length > 15
                                            ? item.name.slice(0, 15) + "..."
                                            : item.name}
                                    </h4>
                                </div>
                            );
                        })}
                    </AssignmentsDiv>
                </Left>

                <Right>
                    {
                        loading
                            ? <Loading text="Sign messages to load chat history..." />
                            : msgData
                                ? <>
                                    <Input classData={classData} />
                                    {msgData?.map((item, ind) => {
                                        return <Message key={ind} data={item} />;
                                    })}
                                </>
                                : <Button onClick={async () => { await fetchData(classData.id) }}>Load Messages</Button>
                    }
                </Right>
            </Main>
        </Container>
    );
}

const Container = styled.div`
	margin-top: 75px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 30px;
	flex: 1;

	& > div {
		max-width: 1000px;
	}
`;

const Top = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding: 20px 30px;
	gap: 10px;

	width: 100%;
	height: 200px;

	background: rgba(255, 255, 255, 0.08);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;

	h2 {
		font-weight: 400;
		font-size: var(--font-xl);
		line-height: 125%;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 1);
	}
	h4 {
		font-weight: 300;
		font-size: var(--font-lg);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.9);
	}
	p {
		display: flex;
		gap: 5px;

		font-weight: 200;
		font-size: var(--font-md);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.66);

		span {
			font-size: var(--font-sm);
			color: rgba(255, 255, 255, 0.5);
		}
	}
`;

const Main = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	gap: 30px;
`;
const Left = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;

	& > div {
		display: flex;
		flex-direction: column;
		padding: 20px;
		gap: 20px;
		width: 200px;

		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 15px;

		h3 {
			font-weight: 400;
			font-size: var(--font-md);
			line-height: 125%;
			color: rgba(255, 255, 255, 0.75);
		}
	}
`;
const Right = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	flex: 1;
`;

const CodeDiv = styled.div`
	div {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 15px;
		cursor: pointer;

		p {
			font-weight: 400;
			font-size: var(--font-md);
			line-height: 125%;
			color: rgba(255, 255, 255, 1);
		}
	}
`;

const AssignmentsDiv = styled.div`
	div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0px;
		gap: 5px;
		cursor: pointer;

		p {
			font-weight: 300;
			font-size: var(--font-sm);
			line-height: 125%;
			color: rgba(255, 255, 255, 0.5);
		}
		h4 {
			font-weight: 300;
			font-size: var(--font-md);
			line-height: 125%;
			color: rgba(255, 255, 255, 0.75);
			transition: all 0.15s linear;
		}

		&:hover > h4 {
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
		}
	}
`;
