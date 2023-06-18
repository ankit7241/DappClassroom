import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

import getChatHistory from "../../utils/getChatHistory";
import getAssignments from "../../utils/getAssignments";

import Input from "./Input";
import Message from "./Message";

import CopyIcon from "../../assets/img/copy.svg";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import Huddle from "./Huddle";

export default function Stream({ classData }) {

    const { isConnected, address } = useAccount()

    const [isMeetOpen, setIsMeetOpen] = useState(false);
    const navigate = useNavigate();

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
    const [assignmentLoading, setAssignmentLoading] = useState(false);
    const [assignmentData, setAssignmentData] = useState(null);

    const fetchData = async (id) => {
        const chatHistory = await getChatHistory(id, setLoading);
        if (chatHistory.status === "Success") {
            setMsgData(chatHistory.data);
        } else {
            if (chatHistory.data.msg === "No Messages Found!") {
                setMsgData([])
            }

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

    const fetchAssignmentsData = async (id) => {
        const resp = await getAssignments(id, setAssignmentLoading, address)
        if (resp.status === "Success") {
            const modifiedData = resp.data.filter((item) => {
                return (new Date().getTime() < parseInt(item.deadline) && !item.marked && !item.completed)
            })
            setAssignmentData(modifiedData)
        }
        else {
            toast.error(
                resp.data.msg,
                {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                }
            );
            if (resp.data.msg === "You are not a member of this classroom!") {
                navigate("/")
            }
        }
    };
    useEffect(() => {
        if (classData && classData.id, address) {
            // Fetching assignments data
            (async () => {
                await fetchAssignmentsData(classData?.id);
            })();
        }
    }, [classData, isConnected, address])

    return (
        <Container>
            <Top>
                <h2>{classData?.className}</h2>
                <h4>{classData?.section}</h4>
                <p>
                    {classData?.teacherName}{" "}
                    <span>({
                        classData?.teacherEnsName
                            ? classData?.teacherEnsName
                            : shortenAddress(classData?.teacherAddress, 4)
                    })</span>
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
                        {
                            assignmentLoading
                                ? <Loading size="20px" />
                                : assignmentData && assignmentData.length > 0
                                    ? <>{
                                        assignmentData.map((item, ind) => {
                                            return (
                                                <div key={ind}>
                                                    <p>
                                                        Due{" "}
                                                        {new Date(parseInt(item.deadline)).toLocaleString(
                                                            "default",
                                                            { day: "numeric", month: "long" }
                                                        )}
                                                    </p>
                                                    <h4 onClick={() => { navigate(`/class/${classData?.id}/1`) }}>
                                                        {item.name.length > 15
                                                            ? item.name.slice(0, 15) + "..."
                                                            : item.name}
                                                    </h4>
                                                </div>
                                            );

                                        })}
                                    </>
                                    : <p>You're all caught up! No assignments found.</p>
                        }
                    </AssignmentsDiv>

                    <CodeDiv>
                        <h3>Class meeting</h3>
                        <Button style={{ padding: "7px 0px" }} onClick={() => setIsMeetOpen(true)}>Open meet</Button>
                    </CodeDiv>
                </Left>

                <Right>
                    {
                        loading
                            ? <Loading text="Sign messages to load chat history..." />
                            : msgData
                                ? msgData.length > 0
                                    ? <>
                                        <Input classData={classData} />
                                        {msgData?.map((item) => {
                                            return <Message data={item} />;
                                        })}
                                    </>
                                    : <>
                                        <Input classData={classData} />
                                        <p style={{ textAlign: "center" }}>No messages found</p>
                                    </>
                                : <>
                                    <Input classData={classData} />
                                    <Button
                                        onClick={async () => {
                                            await fetchData(classData.id);
                                        }}
                                    >
                                        Load Messages
                                    </Button>
                                </>

                    }
                </Right>
            </Main>

            {isMeetOpen && <Huddle id={classData?.id ?? ""} />}
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

    p {
        font-weight: 300;
		font-size: var(--font-sm);
		line-height: 125%;
        letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
    }
`;
