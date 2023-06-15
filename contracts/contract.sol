// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DappClassroom {
    
    struct Class {

        string classDescCID;

        uint256 classCode;

        address teacherAddress;

        // Assignment ids
        uint256 assignmentIdCounter;

        // Mapping unique code of assignment to it's features
        mapping(uint256 => Assignment) assignments;

        address[] students;

        bool classExists;

    }

    struct Assignment {

        uint256 classId;

        string descriptionCID;

        bool assignmentExists;

        // Mapping from address of the student to his assignment marks
        mapping(address => AssignmentDetails) studentDetails;

    }


    struct User {

        uint256[] classCodes;
        
    }

    enum AssignmentStatus{assigned,completed,marked}

    struct AssignmentDetails{

        uint256 marks;

        string assignmentCID;
        
        AssignmentStatus status;
        
    }
    
    // All class ids
    uint256[] public classIds;

    uint256 public classIdCounter;

    // Mapping unique code of class to it's features ( classIds => Class)
    mapping(uint256 => Class) classes;

    // Mapping unique address of user to it's features
    mapping(address => User) users;



    function addClass(string memory classDescCID) public returns(uint256)
    {
        uint random = uint(keccak256(abi.encodePacked(block.number, block.timestamp, classIds,classDescCID))) % 100000;
        
        classes[random].classCode =  random;

        classes[random].classDescCID =  classDescCID;

        classes[random].teacherAddress =  msg.sender;

        classes[random].classExists = true;

        classIds.push(random);

        classIdCounter++;

        users[msg.sender].classCodes.push(random);

        return random;

    }

    function joinClass(uint256 classCode) public{

        require(classes[classCode].classExists == true,"Class does not exist");
        users[msg.sender].classCodes.push(classCode);
        classes[classCode].students.push(msg.sender);
        
        
    }

    function leaveClass(uint256 classCode) public{

        require(classes[classCode].classExists == true,"Class does not exist");
        for(uint i=0;i<users[msg.sender].classCodes.length-1;i++)
        {
            if(users[msg.sender].classCodes[i] == classCode)
            {
                users[msg.sender].classCodes[i] = users[msg.sender].classCodes[users[msg.sender].classCodes.length - 1];
                break;
            }
        }
        users[msg.sender].classCodes.pop();
        
    }

    function addAssignment(uint256 classCode, string memory descriptionCID) public {

        require(classes[classCode].teacherAddress == msg.sender, "Only teacher can assign the assignment");

        require(classes[classCode].classExists == true,"Class does not exist");

        classes[classCode].assignments[classes[classCode].assignmentIdCounter].descriptionCID = descriptionCID;

        classes[classCode].assignments[classes[classCode].assignmentIdCounter].assignmentExists = true;

        classes[classCode].assignmentIdCounter++;
        
    }

    function completedAssigment(uint256 classCode,uint256 assignmentCode, string memory assignmentCID) public{


        classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].assignmentCID = assignmentCID;
        classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].status = AssignmentStatus.completed;

    }

     function giveMarks(uint256 classCode, uint256 assignmentCode,uint256 marks, address studentAddress) public{

        require(classes[classCode].teacherAddress == msg.sender, "Only teacher can assign marks");

        classes[classCode].assignments[assignmentCode].studentDetails[studentAddress].marks = marks;
        classes[classCode].assignments[assignmentCode].studentDetails[studentAddress].status = AssignmentStatus.marked;

    }

    // Get values of class struct using class code


    function getClassDescCID(uint256 classCode) public view returns(string memory){

        require(classes[classCode].classExists == true,"Class does not exist");
        
        return classes[classCode].classDescCID;
    }

     function getClassTeacherAddress(uint256 classCode) public view returns(address){

        require(classes[classCode].classExists == true,"Class does not exist");

        return classes[classCode].teacherAddress;
    }

     function getClassAssignmentIdCounter(uint256 classCode) public view returns(uint256){

        require(classes[classCode].classExists == true,"Class does not exist");

        return classes[classCode].assignmentIdCounter;
    }

     function getClassExists(uint256 classCode) public view returns(bool){

        require(classes[classCode].classExists == true,"Class does not exist");

        return classes[classCode].classExists;
    }

    function getClassStudents(uint256 classCode) public view returns(address[] memory){

        require(classes[classCode].classExists == true,"Class does not exist");

        return classes[classCode].students;
    }




    // Get values of assignment struct using class and assignment code

    function getAssignmentDescriptionCID(uint256 classCode, uint256 assignmentCode) public view returns(string memory){

        require(classes[classCode].classExists == true,"Class does not exist");

        require(classes[classCode].assignments[assignmentCode].assignmentExists == true,"Assignment does not exist");

        return classes[classCode].assignments[assignmentCode].descriptionCID;
    }


    function getAssignmentExists(uint256 classCode, uint256 assignmentCode) public view returns(bool){

        return classes[classCode].assignments[assignmentCode].assignmentExists;
    }





    // Get student details in assignment struct using class and assignment code

    function getStudentMarks(uint256 classCode, uint256 assignmentCode) public view returns(uint256){

        require(classes[classCode].classExists == true,"Class does not exist");

        require(classes[classCode].assignments[assignmentCode].assignmentExists == true,"Assignment does not exist");

        require(classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].status == AssignmentStatus.marked,"Assignment has not been marked yet by the teacher");

        return classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].marks;
    }

    function getStudentAssignmentCID(uint256 classCode, uint256 assignmentCode) public view returns(string memory){

        require(classes[classCode].classExists == true,"Class does not exist");

        require(classes[classCode].assignments[assignmentCode].assignmentExists == true,"Assignment does not exist");

        require(classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].status == AssignmentStatus.completed,"Assignment has not been submitted yet");

        return classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].assignmentCID;
    }

    function getStudentStatus(uint256 classCode,uint256 assignmentCode) public view returns(AssignmentStatus){

        require(classes[classCode].classExists == true,"Class does not exist");

        require(classes[classCode].assignments[assignmentCode].assignmentExists == true,"Assignment does not exist");

        return classes[classCode].assignments[assignmentCode].studentDetails[msg.sender].status;
    }


    function getUserClassCode() public view returns(uint256[] memory){

        require(users[msg.sender].classCodes.length != 0,"Create class or join one");

        return users[msg.sender].classCodes;
    }

    
}
