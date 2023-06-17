import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../ContractDetails";

export default async function fetchAssignmentsData(id, setLoading) {
    setLoading(true);
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

            let assignmentCount;

            await connectedContract
                .getClassAssignmentIdCounter(`${id}`)
                .then((classIdCount) => {
                    assignmentCount = `${classIdCount}`;
                });

            const Data = [];

            for (let i = 0; i < assignmentCount; i++) {
                // Fetching Assignment data
                let assignmentDescCID;
                await connectedContract
                    .getAssignmentDescriptionCID(`${id}`, `${i}`)
                    .then((classIdCount) => {
                        assignmentDescCID = `${classIdCount}`;
                    });

                // Fetching Student Status
                let studentStatus;
                await connectedContract
                    .getStudentStatus(`${id}`, `${i}`)
                    .then((classIdCount) => {
                        studentStatus = `${classIdCount}`;
                    });

                // Fetching Student Marks
                let studentMarks = 0;
                try {
                    await connectedContract
                        .getStudentMarks(`${id}`, `${i}`)
                        .then((classIdCount) => {
                            studentMarks = `${classIdCount}`;
                        });
                } catch (error) {
                    console.log(error);
                }

                // Fetching Student Assignment
                let studentAssignment = null;
                try {
                    await connectedContract
                        .getStudentAssignmentCID(`${id}`, `${i}`)
                        .then((classIdCount) => {
                            studentAssignment = `${classIdCount}`;
                        });
                } catch (error) {
                    console.log(error);
                }

                // Setting the Status
                let assigned;
                let completed;
                let marked;
                if (studentStatus == 0) {
                    assigned = true;
                    completed = false;
                    marked = false;
                } else {
                    if (studentStatus == 1) {
                        assigned = false;
                        completed = true;
                        marked = false;
                    } else {
                        assigned = false;
                        completed = false;
                        marked = true;
                    }
                }


                // Fetching Assignment data from IPFS
                const url = `https://ipfs.io/ipfs/${assignmentDescCID}`;
                const res = await fetch(url);
                let fetchedData = await res.json();
                const data = JSON.parse(fetchedData);

                const fetchedObject = {
                    classCode: `${id}`,
                    assignmentId: `${i}`,
                    deadline: `${data.deadline}`,
                    name: `${data.assignmentName}`,
                    description: `${data.assignmentDesc}`,
                    assignment: `${data.assignmentFileCID}`,
                    studentAssignment: `${studentAssignment}`,
                    maxMarks: `${data.maximumMarks}`,
                    scroredMarks: studentMarks,
                    assigned: assigned,
                    completed: completed,
                    marked: marked,
                };

                Data.push(fetchedObject);
            }

            setLoading(false);
            return { status: "Success", data: Data };
        } else {
            setLoading(false)
            console.log("Ethereum object doesn't exist!");
            return { status: "Error", data: { err: null, msg: "Some problem with Metamask! Please try again" } };
        }
    } catch (error) {
        console.log(error);
        setLoading(false)

        if (error.error?.data?.message?.includes("Create class or join one")) {
            return { status: "Error", data: { err: error, msg: "You are not enrolled in any classroom!" } };
        }
        else if (error.toString().includes("invalid BigNumber")) {
            return { status: "Success", data: [] };
        }
        else {
            return { status: "Error", data: { err: error, msg: "Unexpected error occurred!" } };
        }
    }
};