import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { trafficSources } from "./Data";
export const TrafficSourcesChart = ({ state, chartData }) => {
  console.log(chartData);
  var trafficSourcesSet2 = {
    labels: ["Vehicles Running", "Vehicles Idle", "Vehicles Parked", "Vehicles Offline"],
    dataUnit: "vehicle",
    legend: false,
    datasets: [
      {
        borderColor: "#fff",
        backgroundColor: ["#1ee0ac", "#364a63", "#f4bd0e", "#e85347"],
        data: [chartData[0], chartData[1], chartData[2], chartData[3]],
      },
    ],
  };

  return (
    <Doughnut
      data={trafficSourcesSet2}
      options={{
        legend: {
          display: false,
        },
        rotation: 1,
        cutoutPercentage: 40,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]];
            },
          },
          backgroundColor: "#1c2b46",
          titleFontSize: 13,
          titleFontColor: "#fff",
          titleMarginBottom: 6,
          bodyFontColor: "#fff",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
      }}
    />
  );
};
