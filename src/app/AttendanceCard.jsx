import React from "react";

function AttendanceCard({ weekNumber, memberAttendance, visitorAttendance }) {
  return (
    <div className="card">
      <div className="card-header">Week {weekNumber}</div>
      <div className="card-body">
        <p>Member Attendance: {memberAttendance}</p>
        <p>Visitor Attendance: {visitorAttendance}</p>
      </div>
    </div>
  );
}

export default AttendanceCard;
