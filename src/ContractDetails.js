export const CONTRACT_ADDRESS = "0xb2C42330EE09cFf1b02EC5036EBD3baD27700fAa";

export const ABI = [
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
			{
				internalType: "string",
				name: "descriptionCID",
				type: "string",
			},
		],
		name: "addAssignment",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "classDescCID",
				type: "string",
			},
		],
		name: "addClass",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "classIdCounter",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "classIds",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "assignmentCode",
				type: "uint256",
			},
			{
				internalType: "string",
				name: "assignmentCID",
				type: "string",
			},
		],
		name: "completedAssigment",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "assignmentCode",
				type: "uint256",
			},
		],
		name: "getAssignmentDescriptionCID",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
		],
		name: "getClassAssignmentIdCounter",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
		],
		name: "getClassDescCID",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
		],
		name: "getClassExists",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
		],
		name: "getClassStudents",
		outputs: [
			{
				internalType: "address[]",
				name: "",
				type: "address[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
		],
		name: "getClassTeacherAddress",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "assignmentCode",
				type: "uint256",
			},
		],
		name: "getStudentAssignmentCID",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "assignmentCode",
				type: "uint256",
			},
		],
		name: "getStudentMarks",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "assignmentCode",
				type: "uint256",
			},
		],
		name: "getStudentStatus",
		outputs: [
			{
				internalType: "enum DappClassroom.AssignmentStatus",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getUserClassCode",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getUserName",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "assignmentCode",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "marks",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "studentAddress",
				type: "address",
			},
		],
		name: "giveMarks",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
		],
		name: "joinClass",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "classCode",
				type: "uint256",
			},
		],
		name: "leaveClass",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "name",
				type: "string",
			},
		],
		name: "registration",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
