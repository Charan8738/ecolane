import React from "react";
import { Card } from "reactstrap";
import { Icon } from "../../../Component";
// import { TotalSalesChart } from "../../charts/e-commerce/EcomCharts";
import { Bar, Doughnut, Line } from "react-chartjs-2";

const TotalSales = ({ totalusers, monthlyUsers, weeklyUsers, UserData, UserDataDate }) => {
  console.log(totalusers);
  const midIndex = Math.floor(UserData.length / 2);
  const firstHalf = UserData.slice(0, midIndex);
  const secondHalf = UserData.slice(midIndex);
  const sum = UserData.reduce((acc, curr) => acc + curr, 0);
  const firstHalfPercentage = ((firstHalf.reduce((acc, curr) => acc + curr, 0) / sum) * 100).toFixed(2);
  const secondHalfPercentage = ((secondHalf.reduce((acc, curr) => acc + curr, 0) / sum) * 100).toFixed(2);
  console.log(firstHalfPercentage);
  console.log(secondHalfPercentage);

  return (
    <Card className="is-dark h-100">
      <div className="nk-ecwg nk-ecwg1">
        <div className="card-inner">
          <div className="card-title-group">
            <div className="card-title">
              <h6 className="title">Total users</h6>
            </div>
            <div className="card-tools"></div>
          </div>
          <div className="data">
            <div className="amount">{totalusers}</div>
            <div className="info">
              <strong>{monthlyUsers}</strong> users this month
            </div>
          </div>
          <div className="data">
            <h6 className="sub-title">This week so far</h6>
            <div className="data-group">
              <div className="amount">{weeklyUsers}</div>
              <div className="info text-right">
                {secondHalfPercentage > firstHalfPercentage ? (
                  <span className="change up text-danger">
                    <Icon name="arrow-long-up"></Icon>
                    {secondHalfPercentage}%
                  </span>
                ) : (
                  <span className="change down text-danger">
                    <Icon name="arrow-long-down"></Icon>
                    {firstHalfPercentage}%
                  </span>
                )}
                {/* <span className="change up text-danger">
                  <Icon name="arrow-long-up"></Icon>4.63%
                </span> */}
                <br />
                <span>vs. last week</span>
              </div>
            </div>
          </div>
        </div>
        <div className="nk-ecwg1-ck">
          <TotalSalesChart UserData={UserData} UserDataDate={UserDataDate} />
        </div>
      </div>
    </Card>
  );
};

const TotalSalesChart = ({ UserData, UserDataDate }) => {
  var totalSales = {
    labels: UserDataDate,
    dataUnit: "Sales",
    lineTension: 0.3,
    datasets: [
      {
        label: "Sales",
        borderColor: "#9d72ff",
        backgroundColor: "rgba(157, 114, 255, 0.25)",
        borderWidth: 2,
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#9d72ff",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 4,
        data: UserData,
      },
    ],
  };
  return (
    <Line
      className="ecommerce-line-chart-s1"
      data={totalSales}
      options={{
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return `${data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]]} sales`;
            },
          },
          backgroundColor: "#1c2b46",
          titleFontSize: 10,
          titleFontColor: "#fff",
          titleMarginBottom: 4,
          bodyFontColor: "#fff",
          bodyFontSize: 10,
          bodySpacing: 4,
          yPadding: 6,
          xPadding: 6,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: false,
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 0,
              },
              gridLines: {
                display: false,
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
              },
            },
          ],
          xAxes: [
            {
              display: false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 0,
              },
              gridLines: {
                display: false,
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
};

export default TotalSales;
