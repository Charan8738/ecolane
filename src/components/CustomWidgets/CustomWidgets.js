import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "reactstrap";
import { Block, BlockHead, BlockHeadContent, BlockTitle, PreviewCard, Row, Col } from "../Component";
import moment from "moment";

const DeviceLog = React.lazy(() => import("../WidgetTables/DeviceLog"));
const DeviceActiveTime = React.lazy(() => import("../WidgetCharts/DeviceActiveTime"));
const TicketHistory = React.lazy(() => import("../WidgetTables/TicketHistory"));
const SignalStrength = React.lazy(() => import("../WidgetCharts/SignalStrength"));
const LTESignalStrength = React.lazy(() => import("../WidgetCharts/LTESignalStrength"));
const WidgetMap = React.lazy(() => import("../WidgetMap/WidgetMap"));
const WidgetCharts = ({ widgets, device }) => {
  function dateconvertor(timestamp) {
    var time = moment.utc(timestamp).local().format("h:mm:ss");
    return time;
  }
  const [chartData, setChartData] = useState({});
  const [lteData, setlteData] = useState({});
  const chart = () => {
    let id = [];
    let signal = [];
    axios
      .get("Firmware/getWifiSignalList?WifiMacAddress=" + device.WifiMacAddress)
      .then((res) => {
        for (const dataObj of res.data) {
          console.log(dataObj);
          var timen = dateconvertor(dataObj.added_date);
          console.log(timen);
          id.push(timen);
          signal.push(parseInt(dataObj.Signal));
        }
        setChartData({
          labels: id,
          datasets: [
            {
              label: "RSSI",
              data: signal,
              borderWidth: 3,
              borderColor: "red",
              backgroundColor: "orange",
              fill: false,
            },
          ],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const chart2 = () => {
    let id = [];
    let signal = [];
    console.log(device.WifiMacAddress);
    axios
      .get("Firmware/getGsmSignalList?WifiMacAddress=" + device.WifiMacAddress)
      .then((res) => {
        console.log(res);
        for (const dataObj of res.data) {
          var timen = dateconvertor(dataObj.added_date);
          id.push(timen);
          signal.push(parseInt(dataObj.Signal));
        }
        setlteData({
          labels: id,
          datasets: [
            {
              label: "RSSI",
              data: signal,
              borderWidth: 3,
              borderColor: "red",
              backgroundColor: "orange",
              fill: false,
            },
          ],
        });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(id, signal);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      chart();
      chart2();
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div>
      {widgets[0] && (
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Device Log</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered card-preview">
            <DeviceLog device={device} />
          </Card>
        </Block>
      )}
      {widgets[1] && (
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Device Active Time</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <div className="nk-ck">
              <DeviceActiveTime data={barChartData} />
            </div>
          </PreviewCard>
        </Block>
      )}
      {(widgets[2] || widgets[3]) && (
        <Block size="lg">
          <Row className="g-gs">
            {widgets[2] && (
              <Col md={6}>
                <PreviewCard>
                  <div className="card-head">
                    <h6 className="title">Device Wifi Strength</h6>
                  </div>
                  <div className="nk-ck-sm">
                    <SignalStrength legend={false} data={chartData} />
                  </div>
                </PreviewCard>
              </Col>
            )}
            {widgets[3] && (
              <Col md={6}>
                <PreviewCard>
                  <div className="card-head">
                    <h6 className="title">Device LTE Strength </h6>
                  </div>
                  <div className="nk-ck-sm">
                    <LTESignalStrength legend={false} data={lteData} />
                  </div>
                </PreviewCard>
              </Col>
            )}
          </Row>
        </Block>
      )}

      {widgets[4] && (
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">GPS Tracker</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered card-preview">
            <div style={{ width: "100%", height: "400px" }}>
              <WidgetMap device={device} />
            </div>
          </Card>
        </Block>
      )}
      {widgets[5] && (
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Ticket History</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered card-preview">
            <TicketHistory />
          </Card>
        </Block>
      )}
    </div>
  );
};

export default WidgetCharts;

const barChartData = {
  labels: ["June 1", "June 2", "June 3", "June 4", "June 5", "June 6", "June 7", "June 8", "June 9", "June 10"],
  dataUnit: "Date",
  datasets: [
    {
      label: "hours",
      backgroundColor: "#9cabff",
      barPercentage: 0.8,
      categoryPercentage: 0.8,
      data: [3, 5, 1, 6, 4, 7, 8, 2, 11, 9],
    },
  ],
};
const wifiStrength = {
  dataUnit: "Signal Strength",
  datasets: [
    {
      label: "values",
      lineTension: 0.4,
      borderColor: "#798bff",
      backgroundColor: "rgba(121, 139, 255, 0.4)",
      pointBorderWidth: 2,
      pointBackgroundColor: "white",
      pointHoverRadius: 3,
      pointHoverBorderWidth: 2,
      pointRadius: 3,
      pointHitRadius: 3,
      fill: true,
      data: [110, 80, 125, 65, 95, 75, 90, 110, 80, 125, 70, 95],
    },
  ],
};

const deviceLTE = {
  dataUnit: "Signal Strength",
  datasets: [
    {
      label: "dBm",
      lineTension: 0,
      borderColor: "#798bff",
      backgroundColor: "rgba(121, 139, 255, 0.4)",
      pointBorderWidth: 2,
      pointBackgroundColor: "white",
      pointRadius: 4,
      borderRadius: 0,
      fill: true,
      bezierCurve: false,
      data: [90, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95],
    },
  ],
};
