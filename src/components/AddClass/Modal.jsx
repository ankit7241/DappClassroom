import React, { useState } from "react";
import { styled } from "styled-components";

import Button from "../Button";
import createClass from "../../utils/createClass";
import joinClass from "../../utils/joinClass";

export default function Modal({ setShowModal, showModal }) {
    const [className, setClassName] = useState("");
    const [section, setSection] = useState("");
    const [teacherName, setTeacherName] = useState("");

    const [code, setCode] = useState("");
    const [loadCreateMessage, setLoadCreateMessage] = useState(null);
    const [loadJoinMessage, setLoadJoinMessage] = useState(null);

    const handleCreate = async () => {
        await createClass(
            className,
            section,
            teacherName,
            setLoadCreateMessage,
            setShowModal
        );

    };

    const handleJoin = async () => {
        await joinClass(code, setLoadJoinMessage, setShowModal);
    };

    return (
        <Container onClick={() => setShowModal(false)}>
            <Main onClick={(e) => e.stopPropagation()}>
                <h2>Add class</h2>

                <div>
                    <input
                        type="text"
                        placeholder="Class Name e.g. Computer Science Club"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Section e.g. H"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Teacher Name e.g. Atharv Varshney"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                    />
                    <StyledButton onClick={handleCreate}>
                        {loadCreateMessage ? (
                            <>
                                {loadCreateMessage} <Loader />
                            </>
                        ) : (
                            "Create Class"
                        )}
                    </StyledButton>
                </div>

                <Divider>
                    <p>OR</p>
                </Divider>

                <div>
                    <input
                        type="text"
                        placeholder="Enter Class Code e.g. 50786"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <StyledButton onClick={handleJoin}>
                        {loadJoinMessage ? (
                            <>
                                {loadJoinMessage} <Loader />
                            </>
                        ) : (
                            "Join Class"
                        )}
                    </StyledButton>
                </div>
            </Main>
        </Container>
    );
}

const Container = styled.div`
    z-index: 2;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.75);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Main = styled.div`
    z-index: 3;
	width: 50%;
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

	div {
		width: 75%;
		display: flex;
		flex-direction: column;
		gap: 15px;

		input {
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
	}

	p {
		font-size: var(--font-sm);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.75);
		width: 100%;
		text-align: center;
		position: relative;
		z-index: 3;
	}
`;

const Divider = styled.div`
	width: 75%;
	position: relative;
	&::before {
		z-index: 3;
		content: "";
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		width: 4ch;
		height: 100%;
		background-color: var(--bg);
	}

	&::after {
		z-index: 2;
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
		height: 2px;
		background-color: rgba(255, 255, 255, 0.3);
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

const Loader = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
            />
        </svg>
    );
};
