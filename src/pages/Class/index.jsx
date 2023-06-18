import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

import getClassData from "../../utils/getClassData";
import isTeacher from "../../utils/isTeacher";
import getEnsData from "../../utils/getEnsData";

import Header from "./Header";
import Stream from "./Stream";
import Assignments from "./Assignments";
import People from "./People";
import Submissions from "./Submissions";

import Loading from "../../components/Loading";
import ConnectWalletFallback from "../../components/ConnectWalletFallback";

export default function Class() {
    const { isConnected, address } = useAccount();

    const { classId, tab } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(null);
    const [classData, setClassData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    const [isUserTeacher, setIsUserTeacher] = useState(false);

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
            const { EnsName, EnsAvatar } = await getEnsData(data.data.teacherAddress);
            data.data.teacherEnsName = EnsName;
            data.data.teacherEnsAvatar = EnsAvatar;
            setClassData(data.data);
        }

        setLoading(false)
    };

    useEffect(() => {
        if (classId && isConnected) {
            (async () => {
                await fetchData(classId);
            })();

            // Checking if the user is a teacher
            (async () => {
                const temp = await isTeacher(classId);
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
        }
    }, [classId, address]);

    useEffect(() => {
        try {
            if (isNaN(parseInt(tab))) {
                navigate(`/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}/0`)
            }
            if (!tab || parseInt(tab) < 0 || parseInt(tab) > 2) {
                if (!loading && !isUserTeacher) {
                    navigate(`/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}/0`)
                }
                else if (!loading && isUserTeacher && parseInt(tab) !== 3) {
                    navigate(`/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}/3`)
                }
            }
            setActiveTab(parseInt(tab));
        } catch (err) {
            navigate(`/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}/0`)
        }
    }, [tab, loading]);

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
                    {isUserTeacher && activeTab === 3 && <Submissions classData={classData} />}
                </>
                : <ConnectWalletFallback />
    );
}