import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

import Header from "./Header";
import Stream from "./Stream";
import Assignments from "./Assignments";
import People from "./People";
import getClassData from "../../utils/getClassData";
import Loading from "../../components/Loading";
import ConnectWalletFallback from "../../components/ConnectWalletFallback";

export default function Class() {
    const { isConnected } = useAccount();

    const { classId, tab } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(null);
    const [classData, setClassData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    const fetchData = async (id) => {
        setLoading(true)

        const data = await getClassData(id);

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

            setClassData([])

        } else {
            setClassData(data.data);
        }

        setLoading(false)
    };

    useEffect(() => {
        if (classId && isConnected) {
            (async () => {
                await fetchData(classId);
            })();
        }
    }, [classId]);

    useEffect(() => {
        try {
            if (isNaN(parseInt(tab))) {
                navigate(`/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}/0`)
            }
            if (!tab || parseInt(tab) < 0 || parseInt(tab) > 2) {
                navigate(
                    location.pathname +
                    (location.pathname.charAt(location.pathname.length - 1) === "/"
                        ? "0"
                        : "/0")
                );
            }
            setActiveTab(parseInt(tab));
        } catch (err) {
            navigate(`/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}/0`)
        }
    }, [tab]);

    return (
        loading
            ? <Loading />
            : isConnected
                ? <>
                    <Header
                        classData={classData}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    {activeTab === 0 && <Stream classData={classData} />}
                    {activeTab === 1 && <Assignments classData={classData} />}
                    {activeTab === 2 && <People classData={classData} />}
                </>
                : <ConnectWalletFallback />
    );
}