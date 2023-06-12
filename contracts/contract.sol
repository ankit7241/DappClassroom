// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DappClassroom {
    
    struct Class {

        string name;

        uint256 classCode;

        address teacherAddress;

        uint256 numberOfStudents;

        // Assignment ids
        uint256 assignmentIdCounter;

        // Mapping unique code of assignment to it's features
        mapping(uint256 => Assignment) assignments;

        address[] students;

        bool classExists;

    }

    struct Assignment {

        uint256 classId;

        string title;

        string descriptionCID;

        // Mapping from address of the student to his assignment marks
        mapping(address => AssignmentDetails) studentDetails;  

    }


    struct User {

        uint256[] classCodes;

        string name;
        
    }

    enum AssignmentStatus{assigned,completed,marked}

    struct AssignmentDetails{

        uint256 marks;

        string assignmentCID;
        
        AssignmentStatus status;
        
    }
    
    // All class ids
    uint256[] public classIds;

    // Mapping unique code of class to it's features ( classIds => Class)
    mapping(uint256 => Class) classes;

    // Mapping unique address of user to it's features
    mapping(address => User) users;



    function addClass(string memory className) public returns(uint256)
    {
        uint random = uint(keccak256(abi.encodePacked(block.number, block.timestamp, classIds,className))) % 100000;
        
        classes[random].classCode =  random;

        classes[random].name =  className;

        classes[random].teacherAddress =  msg.sender;

        classes[random].classExists = true;

        classIds.push(random);

        return random;

    }

    function joinClass(uint256 classCode) public{

        require(classes[classCode].classExists == true,"Class does not exist");
        users[msg.sender].classCodes.push(classCode);
        
    }

    function registration(string memory name ) public{
        users[msg.sender].name = name;
    }

    function addAssignment(uint256 classCode, string memory title, string memory descriptionCID) public {

        require(classes[classCode].teacherAddress == msg.sender);

        require(classes[classCode].classExists == true,"Class does not exist");

        classes[classCode].assignments[classes[classCode].assignmentIdCounter].title = title;

        classes[classCode].assignments[classes[classCode].assignmentIdCounter].descriptionCID = descriptionCID;

        classes[classCode].assignmentIdCounter++;
        
    }

    function completedAssigment(uint256 classCode,uint256 assignmentCode, string memory assignmentCID) public{

        classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].assignmentCID = assignmentCID;
        classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].status = AssignmentStatus.completed;

    }

     function giveMarks(uint256 classCode, uint256 assignmentCode,uint256 marks, address studentAddress) public{

        require(classes[classCode].teacherAddress == msg.sender);

        classes[classCode].assignments[assignmentCode].studentDetails[studentAddress].marks = marks;
        classes[classCode].assignments[assignmentCode].studentDetails[studentAddress].status = AssignmentStatus.marked;

    }

     

    // Get values of class struct using class code


    function getClassName(uint256 classCode) public view returns(string memory){
        return classes[classCode].name;
    }

     function getClassTeacherAddress(uint256 classCode) public view returns(address){

        return classes[classCode].teacherAddress;
    }

     function getClassNumberOfStudents(uint256 classCode) public view returns(uint256){

        return classes[classCode].numberOfStudents;
    }

     function getClassAssignmentIdCounter(uint256 classCode) public view returns(uint256){

        return classes[classCode].assignmentIdCounter;
    }

     function getClassExists(uint256 classCode) public view returns(bool){

        return classes[classCode].classExists;
    }




    // Get values of assignment struct using class and assignment code



    function getAssignmentTitle(uint256 classCode, uint256 assignmentCode) public view returns(string memory){

        return classes[classCode].assignments[assignmentCode].title;
    }

    function getAssignmentDescriptionCID(uint256 classCode, uint256 assignmentCode) public view returns(string memory){

        return classes[classCode].assignments[assignmentCode].descriptionCID;
    }





    // Get values of assignment struct using class and assignment code

    function getStudentMarks(uint256 classCode, uint256 assignmentCode) public view returns(uint256){

        return classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].marks;
    }

    function getStudentAssignmentCID(uint256 classCode, uint256 assignmentCode) public view returns(string memory){

        return classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].assignmentCID;
    }

    function getStudentStatus(uint256 classCode,uint256 assignmentCode) public view returns(AssignmentStatus){
        return classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].status;
    }

    
}
