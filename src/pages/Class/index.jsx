import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';

import Header from './Header';
import Stream from './Stream';
import Assignments from './Assignments';
import People from './People';

export default function Class() {

    const { isConnected, address } = useAccount();
    const { classId, tab } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [classData, setClassData] = useState(null);
    const [activeTab, setActiveTab] = useState(0)

    const fetchData = async (id) => {
        setClassData(
            {
                id: "1686598276043", className: "Computer Science Club", section: "Section - H", teacherName: "Atharv Varshney", teacherAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4", assignments: [
                    { deadline: "1689532200000", name: "Assignment name #1" },
                    { deadline: "1689705000000", name: "Assignment name #2" },
                    { deadline: "1690223400000", name: "Assignment name #3" },
                ],
            }
        )
    }

    useEffect(() => {
        (async () => {
            await fetchData(classId)
        })();
    }, [classId])

    useEffect(() => {
        try {
            if (!tab || parseInt(tab) < 0 || parseInt(tab) > 2) {
                navigate(location.pathname + (location.pathname.charAt(location.pathname.length - 1) === "/" ? "0" : "/0"))
            }
            setActiveTab(parseInt(tab))
        }
        catch (err) {
            // navigate(location.pathname + (location.pathname.charAt(location.pathname.length - 1) === "/" ? "0" : "/0"))
            console.log(err)
        }
    }, [tab])

    return (
        <>
            <Header classData={classData} activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 0 && <Stream classData={classData} />}
            {activeTab === 1 && <Assignments classData={classData} />}
            {activeTab === 2 && <People classData={classData} />}
        </>
    )
}

