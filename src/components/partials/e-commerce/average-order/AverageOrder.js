import React, { useState, useEffect } from "react";
import { Icon } from "../../../Component";
import { Card, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Spinner } from "reactstrap";

const AverageOrder = ({ totalSales, salesData, salesDate }) => {
  const [data, setData] = useState("7");
  const midIndex = Math.floor(salesData.length / 2);
  const firstHalf = salesData.slice(0, midIndex);
  const secondHalf = salesData.slice(midIndex);
  const sum = salesData.reduce((acc, curr) => acc + curr, 0);
  const firstHalfPercentage = ((firstHalf.reduce((acc, curr) => acc + curr, 0) / sum) * 100).toFixed(2);
  const secondHalfPercentage = ((secondHalf.reduce((acc, curr) => acc + curr, 0) / sum) * 100).toFixed(2);
  return (
    <Card className="h-100">
      <div className="nk-ecwg nk-ecwg2">
        <div className="card-inner">
          <div className="card-title-group mt-n1">
            <div className="card-title">
              <h6 className="title">Averarge order</h6>
            </div>
            {/* <div className="card-tools mr-n1">
              <UncontrolledDropdown>
                <DropdownToggle
                  tag="a"
                  href="#toggle"
                  onClick={(ev) => ev.preventDefault()}
                  className="dropdown-toggle btn btn-icon btn-trigger"
                >
                  <Icon name="more-h" />
                </DropdownToggle>
                <DropdownMenu right className="dropdown-menu-sm">
                  <ul className="link-list-opt no-bdr">
                    <li className={data === "7" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setData("7");
                        }}
                      >
                        <span>7 Days</span>
                      </DropdownItem>
                    </li>
                    <li className={data === "15" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setData("15");
                        }}
                      >
                        <span>15 days</span>
                      </DropdownItem>
                    </li>
                    <li className={data === "30" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setData("30");
                        }}
                      >
                        <span>30 days</span>
                      </DropdownItem>
                    </li>
                  </ul>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div> */}
          </div>
          <div className="data">
            <div className="data-group">
              <div className="amount">${totalSales}</div>
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
          <h6 className="sub-title">Orders over time</h6>
        </div>
        <div className="nk-ecwg2-ck">
          {salesData.length > 1 ? (
            <AverageOrderChart state={data} salesData={salesData} salesDate={salesDate} />
          ) : (
            <Spinner />
          )}
          {/* <AverageOrderChart state={data} salesData={salesData} salesDate={salesDate} /> */}
        </div>
      </div>
    </Card>
  );
};

const AverageOrderChart = ({ state, salesData, salesDate }) => {
  console.log(salesData);
  const [data, setData] = useState([]);
  var averargeOrderSet2 = {
    labels: salesDate,
    dataUnit: "People",
    lineTension: 0.1,
    datasets: [
      {
        label: "Active Users",
        borderColor: "#b695ff",
        backgroundColor: "#b695ff",
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderWidth: 2,
        data: salesData,
      },
    ],
  };
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
              return false; //data['labels'][tooltipItem[0]['index']];
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
                stepSize: 100000,
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

export default AverageOrder;
