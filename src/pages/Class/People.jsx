import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../../ContractDetails";

import isTeacher from "../../utils/isTeacher";
import getEnsData from "../../utils/getEnsData";

import Loading from "../../components/Loading";
import avatar from "../../assets/img/placeholder_avatar.png";


export default function People({ classData }) {

    const { address } = useAccount();

    const [people, setPeople] = useState(null);
    const [isUserTeacher, setIsUserTeacher] = useState(false);
    const [teacherAddress, setTeacherAddress] = useState(null);
    const [teacherEnsName, setTeacherEnsName] = useState(null);
    const [teacherEnsAvatar, setTeacherEnsAvatar] = useState(null);
    const [isStudentsLoading, setIsStudentsLoading] = useState(false);

    const fetchData = async (id) => {
        setIsStudentsLoading(true);
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

                let userClassIds;
                await connectedContract.getClassStudents(id).then((classIdCount) => {
                    userClassIds = `${classIdCount}`;
                });

                // Making an Array of all class Ids a user is enrolled in
                const userClassIdArray = userClassIds.split(",").map(String);

                let Data = [];
                for (let i = 0; i < userClassIdArray.length; i++) {
                    const { EnsName, EnsAvatar } = await getEnsData(userClassIdArray[i].toString());

                    const fetchedObject = {
                        address: `${userClassIdArray[i].toString()}`,
                        EnsName,
                        EnsAvatar
                    };

                    Data.push(fetchedObject);
                }

                if (Data.length === 1 && Data[0].address === "") {
                    setPeople(null);
                }
                else {
                    setPeople(Data);
                }

                setIsStudentsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsStudentsLoading(false);
        }
    };

    useEffect(() => {
        if (classData && classData.id) {
            (async () => {
                await fetchData(classData?.id);
            })();
            (async () => {
                const temp = await isTeacher(classData.id);
                if (temp.status === "Success") {
                    setIsUserTeacher(temp.data.data);
                    setTeacherAddress(temp.data.teacherAddress)
                    const { EnsName, EnsAvatar } = await getEnsData(temp.data.teacherAddress);
                    setTeacherEnsName(EnsName)
                    setTeacherEnsAvatar(EnsAvatar)
                } else {
                    toast.error(temp.data.msg, {
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
            })();
        }
    }, [classData]);

    return (
        <Container>
            <Main>
                <PeopleTile style={{ background: "rgba(255, 255, 255, 0.15)" }} >
                    <div>
                        <img src={teacherEnsAvatar ? teacherEnsAvatar : avatar} />
                        <p>{teacherAddress ? teacherEnsName ? teacherEnsName : teacherAddress : "Loading..."}</p>
                    </div>
                    <p>Teacher</p>
                </PeopleTile>

                <TileList>
                    {
                        isStudentsLoading
                            ? <Loading />
                            : people && people.length > 0
                                ? people.map((item, ind) => {
                                    return (
                                        <PeopleTile
                                            key={ind}
                                            style={
                                                address === item.address
                                                    ? { background: "rgba(255, 255, 255, 0.15)" }
                                                    : undefined
                                            }
                                        >
                                            <div>
                                                <img
                                                    src={item.EnsAvatar ? item.EnsAvatar : avatar}
                                                    alt=""
                                                />
                                                <p>
                                                    {
                                                        item.EnsName
                                                            ? <>
                                                                {item.EnsName}
                                                                <span>({item.address.slice(0, 6)}...{item.address.slice(-6)})</span>
                                                            </>
                                                            : item.address
                                                    }
                                                </p>
                                            </div>
                                            <p>Student</p>
                                        </PeopleTile>
                                    );
                                })

                                : <p>No Students in the classroom</p>
                    }
                </TileList>
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

const Main = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	gap: 50px;
	width: 100%;
`;
const TileList = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 20px;
	width: 100%;

	& > p {
		padding: 20% 0px;
		font-size: var(--font-lg);
		font-weight: 300;
		color: rgba(255, 255, 255, 0.75);
	}
`;
const PeopleTile = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 15px 20px;
	gap: 5px;
	width: 100%;

	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;
	transition: all 0.2s linear;

	&:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	& > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0px;
		gap: 15px;

		img {
			width: 30px;
			height: 30px;
		}

		p {
			font-weight: 500;
			font-size: var(--font-md);
			line-height: 125%;
			color: rgba(255, 255, 255, 0.75);

            span {
                margin-left: 7px;
                font-weight: 400;
                font-size: var(--font-sm);
                line-height: 125%;
                color: rgba(255, 255, 255, 0.33);
            }
		}
	}

	& > p {
		font-weight: 300;
		font-size: var(--font-sm);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.66);
	}
`;