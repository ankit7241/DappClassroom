import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useAccount } from "wagmi";
import getClassData from "../../utils/getClassData"

import HomeCard from "../../components/HomeCard";
import ConnectWalletButton from "../../components/ConnectWalletButton";
import Loading from "../../components/Loading";
import Button from "../../components/Button";

import NoClassSvg from "../../assets/img/no_class.svg"

export default function Home() {
    const { isConnected } = useAccount();

    const data = {
        id: "1686598245009",
        className: "Computer Club",
        section: "Section - H",
        teacherName: "Atharv Varshney",
        teacherAddress: "0x4d4DB20DcDc95A2D8B0e8ccB33D235209B15e5Ee",
        assignments: [],
    };

    const data2 = {
        id: "1686598276043",
        className: "Computer Science Club",
        section: "Section - H",
        teacherName: "Atharv Varshney",
        teacherAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
        assignments: [
            { deadline: "1689532200000", name: "Assignment name #1" },
            {
                deadline: "1689705000000",
                name: "Assignment name #2 Assignment name #2",
            },
            {
                deadline: "1689705000000",
                name: "Assignment name #2 Assignment name #2",
            },
            { deadline: "1690223400000", name: "Assignment name #3" },
        ],
    };

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState([]);

    const fetchData = async () => {
        setLoading(true)
        const data = await getClassData();

        if (data.status === "Error") {
            // toast.error("An unexpected error occurred!", {
            //     position: "top-center",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "dark",
            // });
            setClasses([]);
        } else {
            console.log(data.data);

            setClasses(data.data);
        }
        setLoading(false)
    };

    useEffect(() => {
        (async () => {
            await fetchData();
        })();
    }, []);

    return isConnected ?
        loading
            ? (<Loading />)
            : classes?.length > 0
                ? (
                    <CardContainer>
                        {classes.map((item, ind) => {
                            return <HomeCard key={ind} _data={item} />;
                        })}
                    </CardContainer>
                )
                : (
                    <FallbackCont>
                        <img src={NoClassSvg} />
                        <p>Add a class to get started</p>
                        <div>
                            <Button>Join Class</Button>
                            <Button>Create Class</Button>
                        </div>
                    </FallbackCont >
                )
        : (
            <FallbackCont>
                <p>Please connect your wallet to continue!</p>
                <ConnectWalletButton />
            </FallbackCont>
        );
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
