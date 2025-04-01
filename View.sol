// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Attendance {
    struct Record {
        uint256 timestamp;
        string studentId;
    }

    mapping(string => Record[]) public attendanceRecords;

    event AttendanceMarked(string studentId, uint256 timestamp);

    function markAttendance(string memory _studentId) public {
        attendanceRecords[_studentId].push(Record(block.timestamp, _studentId));
        emit AttendanceMarked(_studentId, block.timestamp);
    }

    function getAttendance(string memory _studentId) public view returns (Record[] memory) {
        return attendanceRecords[_studentId];
    }
}
