import React, { useEffect } from "react";
import { Card, CardBody, CardTitle, Input, FormGroup, Label, Spinner } from "reactstrap";
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
} from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
// import HistoryMap from "./components/CustomWidgets/Widgets/HistoryMap";
// import CustomWidgets from "./components/CustomWidgets/CustomWidgets";
import { useLocation, Redirect } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import LiveMap from "./components/CustomWidgets/Widgets/LiveMap";
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

  const [isLoading, setLoading] = useState(false);
  const [viewOption, setViewOption] = useState("realtime");
  const [gpsData, setGpsData] = useState();
  const [odoData, setOdoData] = useState();
  const imei = location.state?.Macaddress;
  const vehicleType = 5;
  console.log("Vehicle Type " + vehicleType);
  console.log("IMEI " + imei);
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
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default TrackerInfo;
