import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../../../Component";
import { Card, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
// import { AverageOrderChart } from "../../charts/e-commerce/EcomCharts";
import { averargeOrder, averargeOrderSet2, averargeOrderSet3, averargeOrderSet4 } from "../../charts/e-commerce/Data";
import { Bar, Doughnut, Line } from "react-chartjs-2";

const TransactionsOrder = ({ totalSales }) => {
  const [data, setData] = useState("7");
  return (
    <Card className="h-100">
      <div className="nk-ecwg nk-ecwg2">
        <div className="card-inner">
          <div className="card-title-group mt-n1">
            <div className="card-title">
              <h6 className="title">Last 30 days sales</h6>
            </div>
          </div>
          <div className="data">
            <div className="data-group">
              <div className="amount">${totalSales}</div>
              <div className="info text-right">
                <span className="change up text-danger">
                  <Icon name="arrow-long-up"></Icon>4.63%
                </span>
                <br />
                <span>vs. last week</span>
              </div>
            </div>
          </div>
          <h6 className="sub-title">Transactions over time</h6>
        </div>
        <div className="nk-ecwg2-ck">
          <AverageOrderChart state={data} />
        </div>
      </div>
    </Card>
  );
};

const AverageOrderChart = ({ state }) => {
  const [data, setData] = useState(averargeOrder);
  useEffect(() => {
    if (state === "7") {
      setData(averargeOrderSet2);
    }
  }, [state]);
  return (
    <Bar
      data={data}
      options={{
        legend: {
          display: false,
          labels: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return false;
            },
            label: function (tooltipItem, data) {
              return `${data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]]}`;
            },
          },
          backgroundColor: "#1c2b46",
          titleFontSize: 9,
          titleFontColor: "#fff",
          titleMarginBottom: 6,
          bodyFontColor: "#fff",
          bodyFontSize: 9,
          bodySpacing: 4,
          yPadding: 6,
          xPadding: 6,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 0,
                display: false,
                stepSize: 100,
              },
              gridLines: {
                color: "rgba(82, 100, 132, 0.2)",
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
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: "transparent",
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    ></Bar>
  );
};
export default TransactionsOrder;
