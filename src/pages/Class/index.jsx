import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import * as PushAPI from "@pushprotocol/restapi";

import Header from "./Header";
import Stream from "./Stream";
import Assignments from "./Assignments";
import People from "./People";
import getClassData from "../../utils/getClassData";
import Loading from "../../components/Loading";

export default function Class() {
    const { isConnected, address } = useAccount();
    const { classId, tab } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(null);
    const [classData, setClassData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    const fetchData = async (id) => {
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

            setClassData([])

        } else {
            console.log(data.data);

            const currentClass = data.data.filter((obj) => {
                return obj.id === id;
            });

            console.log(currentClass[0]);
            setClassData(currentClass[0]);
        }

        setLoading(false)
    };

    useEffect(() => {
        (async () => {
            await fetchData(classId);
        })();
    }, [classId]);

    useEffect(() => {
        try {
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
            // navigate(location.pathname + (location.pathname.charAt(location.pathname.length - 1) === "/" ? "0" : "/0"))
            console.log(err);
        }
    }, [tab]);

    return (
        loading
            ? <Loading />
            : <>
                <Header
                    classData={classData}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {activeTab === 0 && <Stream classData={classData} />}
                {activeTab === 1 && <Assignments classData={classData} />}
                {activeTab === 2 && <People classData={classData} />}
            </>
    );
}
