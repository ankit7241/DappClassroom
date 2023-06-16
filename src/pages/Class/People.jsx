import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { ethers, BigNumber } from "ethers";
import avatar from "../../assets/img/placeholder_avatar.png";
import { CONTRACT_ADDRESS, ABI } from "../../ContractDetails";
import isTeacher from "../../utils/isTeacher";

import Button from "../../components/Button";
import Loading from "../../components/Loading";

export default function People({ classData }) {
    const { address } = useAccount();

    const [people, setPeople] = useState(null);
    const [isUserTeacher, setIsUserTeacher] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (id) => {
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

                let userClassIds;
                await connectedContract.getClassStudents(id).then((classIdCount) => {
                    userClassIds = `${classIdCount}`;
                });
                console.log(userClassIds);

                // Making an Array of all class Ids a user is enrolled in
                const userClassIdArray = userClassIds.split(",").map(String);

                let Data = [];
                for (let i = 0; i < userClassIdArray.length; i++) {
                    const fetchedObject = {
                        address: `${userClassIdArray[i].toString()}`,
                    };

                    Data.push(fetchedObject);
                }

                // const modifiedData = userClassIdArray.map(async (item) => {
                // 	// const ensAvatar = getEnsAvatar(item.address, 5)
                // 	// const ensName = getEnsName(item.address, 5)
                // 	// if (ensName) {
                // 	//     item.ensName = ensName;
                // 	//     return item;
                // 	// }
                // 	// else {
                // 	//     item.ensName = null;
                // 	//     return item;
                // 	// }
                // 	// if (ensAvatar) {
                // 	//     item.ensAvatar = ensAvatar;
                // 	//     return item;
                // 	// }
                // 	// else {
                // 	//     item.ensAvatar = null;
                // 	//     return item;
                // 	// }
                // 	item.ensAvatar = null;
                // 	item.ensName = null;
                // 	return item;
                // });
                setPeople(Data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchData(classData?.id);
        })();
        (async () => {
            const temp = await isTeacher(classData?.id);
            if (temp.status === "Success") {
                setIsUserTeacher(temp.data.data);
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
    }, [classData]);

    return (
        <Container>
            {isLoading ? (
                <Loading />
            ) : (
                <Main>
                    <TileList>
                        {people && people.length > 0 ? (
                            people.map((item, ind) => {
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
                                                src={item.ensAvatar ? item.ensAvatar : avatar}
                                                alt=""
                                            />
                                            <p>
                                                {item.address} <span></span>
                                            </p>
                                        </div>

                                        {/* <p>
											Joined{" "}
											{new Date(parseInt(item.timestamp)).toLocaleTimeString(
												"en-us",
												{ hour: "2-digit", minute: "2-digit" }
											)}{" "}
											{new Date(parseInt(item.timestamp)).toLocaleString(
												"default",
												{ day: "numeric", month: "long" }
											)}
										</p> */}
                                    </PeopleTile>
                                );
                            })
                        ) : (
                            <p>No people in the classroom</p>
                        )}
                    </TileList>
                </Main>
            )}
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
const TopDiv = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	gap: 10px;
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
		}
	}

	& > p {
		font-weight: 300;
		font-size: var(--font-sm);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.66);
	}
`;