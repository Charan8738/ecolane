import React from "react";
import { Card } from "reactstrap";
import { Icon } from "../../../Component";
// import { TotalOrderChart } from "../../charts/e-commerce/EcomCharts";
import { Line } from "react-chartjs-2";

const Orders = ({ noOfTickets, ticketsCountData, ticketsCountDate }) => {
  console.log(ticketsCountData);
  console.log(ticketsCountDate);

  const midIndex = Math.floor(ticketsCountData.length / 2);
  const firstHalf = ticketsCountData.slice(0, midIndex);
  const secondHalf = ticketsCountData.slice(midIndex);
  const sum = ticketsCountData.reduce((acc, curr) => acc + curr, 0);
  const firstHalfPercentage = ((firstHalf.reduce((acc, curr) => acc + curr, 0) / sum) * 100).toFixed(2);
  const secondHalfPercentage = ((secondHalf.reduce((acc, curr) => acc + curr, 0) / sum) * 100).toFixed(2);
  const total_tickets = secondHalf.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  console.log(firstHalfPercentage);
  console.log(secondHalfPercentage);
  console.log(secondHalf);

  return (
    <Card>
      <div className="nk-ecwg nk-ecwg3">
        <div className="card-inner pb-0">
          <div className="card-title-group">
            <div className="card-title">
              <h6 className="title">Tickets Sold</h6>
            </div>
          </div>
          <div className="data">
            <div className="data-group">
              <div className="amount">{total_tickets}</div>
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
                <br />
                <span>vs. last week</span>
              </div>
            </div>
          </div>
        </div>
        <div className="nk-ecwg3-ck">
          <TotalOrderChart ticketsCountData={ticketsCountData} ticketsCountDate={ticketsCountDate} />
        </div>
      </div>
    </Card>
  );
};

const TotalOrderChart = ({ ticketsCountData, ticketsCountDate }) => {
  var totalOrders = {
    labels: ticketsCountDate,
    dataUnit: "Orders",
    lineTension: 0.3,
    datasets: [
      {
        label: "Orders",
        borderColor: "#7de1f8",
        backgroundColor: "rgba(125, 225, 248, 0.25)",
        borderWidth: 2,
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#7de1f8",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 4,
        data: ticketsCountData,
      },
    ],
  };

  return (
    <Line
      className="ecommerce-line-chart-s1"
      data={totalOrders}
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
              return `${data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]]} orders`;
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

export default Orders;
