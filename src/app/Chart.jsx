import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import AttendanceCard from "./AttendanceCard";

function Chart({ monthWeeks, vMonthWeeks }) {
  // Check if there is data available
  if (!monthWeeks?.length || !vMonthWeeks?.length) {
    return <div>No attendance or visitor data to display</div>;
  }

  // Function to get Sunday of the week
  const getSundayOfWeek = (weekStartDate) => {
    const sunday = new Date(weekStartDate.getTime());
    sunday.setDate(sunday.getDate() - sunday.getDay());
    return sunday;
  };

  // Prepare data for the chart
  const memberData = monthWeeks.map((week) => week.members.length);
  const visitorData = vMonthWeeks.map((week) => week.members.length);
  const totalData = monthWeeks.map(
    (week, index) => week.members.length + vMonthWeeks[index].members.length
  );

  // Chart data configuration (with hidden legend)
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
        data: memberData,
        borderColor: "#A2C579",
        backgroundColor: "#A2C579",
        pointBorderColor: "#A2C579",
        pointBackgroundColor: "#A2C579",
        lineTension: 0.4,
        borderWidth: 10,
      },
      {
        label: "Visitor Attendance",
        data: visitorData,
        borderColor: "#61A3BA",
        backgroundColor: "#61A3BA",
        pointBorderColor: "#61A3BA",
        pointBackgroundColor: "#61A3BA",
        lineTension: 0.4,
        borderWidth: 10,
      },
      {
        label: "Total Attendance",
        data: totalData,
        borderColor: "#D2DE32",
        backgroundColor: "#D2DE32",
        pointBorderColor: "#D2DE32",
        pointBackgroundColor: "#D2DE32",
        lineTension: 0.4,
        borderWidth: 10,
      },
    ],
    options: {
      scales: {
        y: {
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: false
        },
      },
    },
  };
  console.log(chartData.options)

  // Find the index of the current week
  const currentDate = new Date();
  const currentWeekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  );
  const currentWeekIndex = monthWeeks.findIndex(
    (week) => week.startDate.getTime() === currentWeekStart.getTime()
  );

  return (
    <div>
      <AttendanceCard
        monthWeeks={monthWeeks}
        vMonthWeeks={vMonthWeeks}
        totalData={totalData}
        currentWeekIndex={currentWeekIndex}
      />
      <div className="shadow-lg border rounded-lg p-5 bg-white" >
      <Line data={chartData} />
      </div>
    </div>
  );
}

export default Chart;
