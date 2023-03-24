import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Input,
  FormGroup,
  Label,
  Spinner,
  CardLink,
  CardText,
  CardSubtitle,
} from "reactstrap";
import Speedometer, { Arc, Background, Needle, Progress, Marks, Indicator } from "react-speedometer";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockDes,
  BlockHeadContent,
  Row,
  Col,
  PreviewCard,
  Button,
} from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
// import HistoryMap from "./components/CustomWidgets/Widgets/HistoryMap";
// import CustomWidgets from "./components/CustomWidgets/CustomWidgets";
import { useLocation, Redirect } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import TicketsTable from "../components/table/TicketsTable";
import LiveMap from "./components/CustomWidgets/Widgets/LiveMap";
import TripsTable from "../components/table/TripsTable";

import { DataTableData, apidata, dataTableColumns, dataTableColumns2, userData } from "./components/table/TableData";

const SignalStrength = React.lazy(() => import("../components/WidgetCharts/SignalStrength"));
const LTESignalStrength = React.lazy(() => import("../components/WidgetCharts/LTESignalStrength"));
const SpeedometerWiddget = ({ value }) => {
  return (
    <div style={{ height: 130, width: 150 }}>
      <Speedometer value={value} max={100} angle={180} min={0} height={150} width={150}>
        <Background opacity={0.8} />
        <Arc />
        <Needle />
        <Progress />
        <Marks />
        <Indicator fontSize={35} />
      </Speedometer>
    </div>
  );
};
const TrackerInfo = () => {
  const location = useLocation();
  const chartData = [
    { id: 32546, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: -52, added_date: "2023-03-07 14:37:05.193026" },
    { id: 32546, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: -52, added_date: "2023-03-07 14:37:05.193026" },
    { id: 32546, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: -52, added_date: "2023-03-07 14:37:05.193026" },
    { id: 32546, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: -52, added_date: "2023-03-07 14:37:05.193026" },
    { id: 32546, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: -52, added_date: "2023-03-07 14:37:05.193026" },
    { id: 32546, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: -52, added_date: "2023-03-07 14:37:05.193026" },
    { id: 32546, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: -52, added_date: "2023-03-07 14:37:05.193026" },
    { id: 32546, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: -52, added_date: "2023-03-07 14:37:05.193026" },
    { id: 32545, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: 10, added_date: "2023-03-07 14:37:04.903183" },
    { id: 32542, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: -77, added_date: "2023-03-07 14:34:42.699014" },
  ];
  const lteData = [
    { id: 40, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: 14, added_date: "2022-09-13 14:56:52.410986" },
    { id: 39, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: 18, added_date: "2022-09-13 14:49:46.989031" },
    { id: 38, WifiMacAddress: "98:CD:AC:51:4A:E8", Signal: 16, added_date: "2022-09-13 14:45:40.475417" },
  ];
  const buttonsDiv = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const [isLoading, setLoading] = useState(false);
  const [viewOption, setViewOption] = useState("realtime");
  const [gpsData, setGpsData] = useState();
  const [odoData, setOdoData] = useState();
  const [tripsData, setTripsData] = useState();
  const imei = location.state?.Macaddress;

  const vehicleType = 5;
  // const response = axios.get("AllTripdata?WifiMacAddress=" + imei);
  // setTripsData(response.data);
  console.log("Vehicle Type " + vehicleType);
  console.log("IMEI " + imei);
  // useEffect(() => {
  //   const getTripData = async () => {
  //     try {
  //       const response = await axios.get("AllTripdata?WifiMacAddress=" + imei);
  //       return response.data;
  //     } catch (err) {
  //       throw err;
  //     }
  //   };
  //   setLoading(true);
  //   const timer = setInterval(() => {
  //     getTripData()
  //       .then((res) => {
  //         setTripsData({ ...res });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }, 15000);
  // }, []);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://ecolane-api.zig-web.com/api/AllTripdata?WifiMacAddress=100");
      const json = await response.json();
      setTripsData(json);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const getGpsData = async () => {
      try {
        const response = await axios.get("gpsdata?WifiMacAddress=" + imei);
        return response.data;
      } catch (err) {
        throw err;
      }
    };
    setLoading(true);
    const timer = setInterval(() => {
      getGpsData()
        .then((res) => {
          setGpsData({ ...res });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 5000);
  }, []);
  useEffect(() => {
    const getOdoData = async () => {
      try {
        const response = await axios.get("odometer?WifiMacAddress=" + imei);
        return response.data;
      } catch (err) {
        throw err;
      }
    };
    setLoading(true);
    const timer = setInterval(() => {
      getOdoData()
        .then((odoRes) => {
          setOdoData({ ...odoRes });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 15000);
  }, []);

  if (!imei) return <Redirect to="/" />;

  return (
    <React.Fragment>
      <Head title="Add Tracker"></Head>
      <Content>
        {isLoading ? (
          <Card>
            <div className="nk-ecwg nk-ecwg6">
              <div className="card-inner">
                <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
                  <div>
                    <h6 className="title " style={{ textAlign: "center" }}>
                      <Spinner color="primary" type="grow" />
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page tag="h3">
                  {gpsData?.Deviceid ? "Tracker Info" : "Error"}
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                      IMEI: <span className="text-base">{gpsData?.Deviceid}</span>
                    </li>
                    <li>
                      Last updated: <span className="text-base">{gpsData?.Updateago}</span>
                    </li>
                  </ul>
                </BlockDes>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
        )}

        <Block>
          <Row className="gy-5">
            <Col lg="4">
              <Card>
                <CardBody className="card-inner">
                  <CardTitle className="text-primary" tag="h6">
                    Speed (mph)
                  </CardTitle>
                  <div className="center">
                    <SpeedometerWiddget value={gpsData?.Speed} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card>
                <CardBody className="card-inner">
                  <CardTitle className="text-primary centre" tag="h6">
                    Battery Voltage
                  </CardTitle>
                  <div className="center">
                    <SpeedometerWiddget value={gpsData?.Speed} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="">
                <CardBody className="card-inner">
                  <CardTitle className="text-primary" tag="h6">
                    Total Miles
                  </CardTitle>
                  <CardTitle className="center ff-mono" tag="h4">
                    {odoData?.Odometerfinalvalue.toFixed(2)}
                  </CardTitle>
                  <br></br>
                  <CardTitle className="text-primary" tag="h6">
                    Tripmeter (miles)
                  </CardTitle>
                  <CardTitle className="center ff-mono" tag="h4">
                    {odoData?.Odometerfinalvalue.toFixed(2)}
                  </CardTitle>
                </CardBody>
                {/* <CardBody>
                  <CardTitle className="text-primary" tag="h6">
                    Tripmeter (miles)
                  </CardTitle>
                  <CardTitle className="center ff-mono" tag="h4">
                    {odoData?.Odometerfinalvalue.toFixed(2)}
                  </CardTitle>
                </CardBody> */}
              </Card>
            </Col>
            <Col sm="12">
              <div style={{ width: "100%", height: "522px" }}>
                <LiveMap imei={imei} vehicleType={vehicleType} />
              </div>
            </Col>
          </Row>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <Card className="card-bordered">
            <CardBody className="card-inner">
              <CardTitle tag="h5">Device diagnostics</CardTitle>
              <div className="card bg-secondary">
                <div style={buttonsDiv} className="card-header text-white">
                  <Button className="btn btn-primary" style={{ float: "right" }} color="danger">
                    Ping Request
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button className="btn btn-primary" style={{ float: "right" }} color="danger">
                    Stop Request
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button className="btn btn-primary" style={{ float: "right" }} color="danger">
                    SOS Request
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button className="btn btn-primary" style={{ float: "right" }} color="danger">
                    Troubleshoot
                  </Button>
                </div>
              </div>
              <br></br>
              <div>
                <CardTitle tag="h5">Troubleshoot data</CardTitle>

                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Item</th>
                      <th scope="col">Default</th>
                      <th scope="col">Last Known Value</th>
                      <th scope="col">Last Known Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Voltage</th>
                      <td>2-5 V</td>
                      <td>5 V</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <th scope="row">GPS wiring</th>
                      <td>5</td>
                      <td>Normal</td>
                      <td>Normal</td>
                    </tr>
                    <tr>
                      <th scope="row">GPS signal</th>
                      <td>Good</td>
                      <td>Good</td>
                      <td>Good</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
          {/* <Row className="g-gs"> */}

          {/* </Row> */}
          <br></br>
          <Row className="g-gs">
            <Col md={6}>
              <PreviewCard>
                <div className="card-head">
                  <h6 className="title">Wifi Signal</h6>
                </div>
                <div className="nk-ck-sm">
                  <SignalStrength legend={false} data={chartData} />
                </div>
              </PreviewCard>
            </Col>

            <Col md={6}>
              <PreviewCard>
                <div className="card-head">
                  <h6 className="title">Voltage </h6>
                </div>
                <div className="nk-ck-sm">
                  <LTESignalStrength legend={false} data={lteData} />
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Trips List</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>{tripsData && <TripsTable data={tripsData} expandableRows pagination />}</PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default TrackerInfo;
