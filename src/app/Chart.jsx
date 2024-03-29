import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import AttendanceCard from "./AttendanceCard"; // Import the AttendanceCard component

function Chart({ monthWeeks, vMonthWeeks }) {
  if (!monthWeeks || monthWeeks.length === 0 || !vMonthWeeks || vMonthWeeks.length === 0) {
    return <div>No attendance or visitor data to display</div>;
  }

  function getSundayOfWeek(weekStartDate) {
    const sunday = new Date(weekStartDate.getTime());
    sunday.setDate(sunday.getDate() - sunday.getDay());
    return sunday;
  }




  const chartData = {
    labels: monthWeeks.map((week) =>
      getSundayOfWeek(week.startDate).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Member Attendance",
        data: monthWeeks.map((week) => week.members.length),
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        pointBorderColor: "#42A5F5",
        pointBackgroundColor: "#42A5F5",
        lineTension: 0.4,
        borderWidth: 10,
      },
      {
        label: "Visitor Attendance",
        data: vMonthWeeks.map((week) => week.members.length),
        borderColor: "#FF6384",
        backgroundColor: "#FF6384",
        pointBorderColor: "#FF6384",
        pointBackgroundColor: "#FF6384",
        lineTension: 0.4,
        borderWidth: 10,
      },
      {
        label: "Total Attendance",
        data: monthWeeks.map((week, index) =>
          week.members.length + vMonthWeeks[index].members.length
        ),
        borderColor: "#9932CC",
        backgroundColor: "#9932CC",
        pointBorderColor: "#9932CC",
        pointBackgroundColor: "#9932CC",
        lineTension: 0.4,
        borderWidth: 10,
      },
    ],
    options: {
      scales: {
        y: {
          ticks: {
            stepSize: 1, // Ensure whole numbers on y-axis
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Member and Visitor Attendance</h2>
      <Line data={chartData} />
      <div className="card-container">
        {monthWeeks.map((week, index) => (
          <AttendanceCard
            key={index}
            weekNumber={week.weekNumber}
            memberAttendance={week.members.length}
            visitorAttendance={vMonthWeeks[index].members.length}
          />
        ))}
      </div>
    </div>
  );
}

export default Chart;
