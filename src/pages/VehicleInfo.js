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
import DataCardAnalytics from "../components/partials/default/DataCardAnalytics";
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
  LineChartExample,
} from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
// import { straightLineChart } from "../pages/components/charts/ChartData";
// import HistoryMap from "./components/CustomWidgets/Widgets/HistoryMap";
import CustomWidgets from "./components/CustomWidgets/CustomWidgets";
import { useLocation, Redirect } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Speedometer, { Arc, Background, Needle, Progress, Marks, Indicator } from "react-speedometer";
import TripsTable from "../components/table/TripsTable";
import LiveMapTeltonika from "./components/CustomWidgets/Widgets/LiveMapTeltonika";
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
const SpeedometerWidget = ({ value }) => {
  return (
    <div style={{ height: 130, width: 150 }}>
      <Speedometer value={value} max={15} angle={180} min={0} height={150} width={150}>
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
const VehicleInfo = () => {
  const location = useLocation();

  const initialDate = new Date();
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const [viewOption, setViewOption] = useState("realtime");
  const [gpsData, setGpsData] = useState();
  const [analyticsData, setAnalyticsData] = useState();
  const [tripsData, setTripsData] = useState();
  const [gsmSignal, setGsmSignal] = useState();
  const [gpsSignal, setGpsSignal] = useState();
  const [timeStamp, setTimeStamp] = useState();
  const imei = location.state?.imei;
  const vehicleType = location.state?.vehicleType;
  const vehicleNo = location.state?.vehicleNo;

  console.log(vehicleNo);
  const gpschart = {
    labels: timeStamp,
    dataUnit: "BTC",
    datasets: [
      {
        label: "GSM Signal Strength",
        lineTension: 0,
        borderColor: "#1270f2",
        backgroundColor: "rgba(18, 112, 242,0.15)",
        pointBorderWidth: 2,
        pointBackgroundColor: "white",
        pointRadius: 4,
        borderRadius: 0,
        fill: true,
        bezierCurve: false,
        // data: [110, 80, 125, 300, 95, 75, 90, 110, 80, 125],
        data: gpsSignal,
      },
    ],
  };
  const gsmChart = {
    labels: timeStamp,
    dataUnit: "numbers",
    datasets: [
      {
        label: "GSM Signal Strength",
        lineTension: 0,
        borderColor: "#1270f2",
        backgroundColor: "rgba(18, 112, 242,0.15)",
        pointBorderWidth: 2,
        pointBackgroundColor: "white",
        pointRadius: 4,
        borderRadius: 0,
        fill: true,
        bezierCurve: false,
        // data: [110, 80, 125, 300, 95, 75, 90, 110, 80, 125],
        data: gsmSignal,
      },
    ],
  };
  useEffect(() => {
    async function getChartData() {
      const response = await fetch("https://gps.zig-app.com/api/strength?imei=" + imei);
      const json = await response.json();
      const timeArray = json.Time_Stamp.map((dateString) => {
        return dateString.split(" ")[1];
      });
      setGpsSignal(json.GPS);
      setGsmSignal(json.GSM);
      setTimeStamp(timeArray);
    }
    getChartData();
  }, []);
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
        const response = await axios.get("https://gps-v2.zig-app.com/getlastGpsdata/" + imei);
        return response.data;
      } catch (err) {
        throw err;
      }
    };
    setLoading(true);
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
  }, []);
  useEffect(() => {
    const getAnalyticsData = async () => {
      try {
        const response = await axios.get("https://gps.zig-app.com/api/v2/getAnalyticsData?imei=" + imei);
        return response.data;
      } catch (err) {
        throw err;
      }
    };
    setLoading(true);
    getAnalyticsData()
      .then((res) => {
        setAnalyticsData({ ...res });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
                  {gpsData?.imei ? "Coach Info" : "Error"}
                </BlockTitle>
                <BlockDes className="text-soft">
                  <ul className="list-inline">
                    <li>
                      Coach No: <span className="text-base">{vehicleNo}</span>
                    </li>
                    <li>
                      IMEI: <span className="text-base">{gpsData?.imei}</span>
                    </li>
                    <li>
                      Last updated: <span className="text-base">{gpsData?.last_updated}</span>
                    </li>
                  </ul>
                </BlockDes>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
        )}

        <Block>
          <Row className="gy-5">
            <Col sm="4">
              <FormGroup>
                <Label className="form-label">View Options</Label>
                <div className="form-control-wrap">
                  <div className="form-control-select">
                    <Input
                      type="select"
                      name="select"
                      id="view-options"
                      onChange={(event) => setViewOption(event.target.value)}
                    >
                      <option value="realtime">Realtime Tracking</option>
                      <option value="history">History Playback</option>
                    </Input>
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row className="gy-5">
            <Col lg="4">
              <Card>
                <CardBody className="card-inner">
                  <CardTitle className="text-primary" tag="h6">
                    Speed (mph)
                  </CardTitle>
                  <div className="center">
                    <SpeedometerWiddget value={gpsData?.speed} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card>
                <CardBody className="card-inner">
                  <CardTitle className="text-primary centre" tag="h6">
                    Battery Voltage (Volts)
                  </CardTitle>
                  <div className="center">
                    <SpeedometerWidget value={gpsData?.ExternalVoltage} />
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
                    {parseFloat(gpsData?.total_odometer).toFixed(2)}
                  </CardTitle>
                  <br></br>
                  <CardTitle className="text-primary" tag="h6">
                    Tripmeter (miles)
                  </CardTitle>
                  <CardTitle className="center ff-mono" tag="h4">
                    {parseFloat(gpsData?.today_odometer).toFixed(2)}
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
            {viewOption === "realtime" ? (
              <Col sm="12">
                <div style={{ width: "100%", height: "522px" }}>
                  <LiveMapTeltonika imei={imei} vehicleType={vehicleType} />
                </div>
              </Col>
            ) : (
              <Col sm="12">
                {/* <CustomWidgets gpsData={gpsData} /> */}
                <div style={{ width: "100%", height: "522px" }}>
                  {/* <HistoryMap imei={imei} vehicleType={vehicleType} /> */}
                </div>
              </Col>
            )}
          </Row>
        </Block>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="4">
              <DataCardAnalytics
                title="Today Travelled (M) "
                // percentChange={"2.5"}
                up={true}
                // chart={<DefaultOrderChart />}
                amount={parseFloat(gpsData?.today_odometer).toFixed(2)}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardAnalytics
                title="Average Speed (M) "
                // percentChange={"2.5"}
                up={true}
                // chart={<DefaultOrderChart />}
                amount={analyticsData?.avgSpeed}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardAnalytics
                title="No of Stops"
                // percentChange={"2.5"}
                up={true}
                // chart={<DefaultOrderChart />}
                amount={analyticsData?.noOfStops}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardAnalytics
                title="Top Speed (Mph)"
                // percentChange={"2.5"}
                up={true}
                // chart={<DefaultOrderChart />}
                amount={analyticsData?.overSpeed}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardAnalytics
                title="Moving hours"
                // percentChange={"2.5"}
                up={true}
                // chart={<DefaultOrderChart />}
                amount={analyticsData?.movingTime}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardAnalytics
                title="Air Conditioner"
                // percentChange={"2.5"}
                up={true}
                // chart={<DefaultOrderChart />}

                amount={analyticsData?.ac_status === "0" ? "On" : "Off"}
                // amount={analyticsData.ac_status ? "0" : "not"}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardAnalytics
                title="Idling Hours"
                // percentChange={"2.5"}
                up={true}
                // chart={<DefaultOrderChart />}

                amount={analyticsData?.idling}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardAnalytics
                title="Built-In Battery (V)"
                // percentChange={"2.5"}
                up={true}
                // chart={<DefaultOrderChart />}
                amount={analyticsData?.buitBattery}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardAnalytics
                title="External Battery (V)"
                // percentChange={"2.5"}
                up={true}
                // chart={<DefaultOrderChart />}
                amount={analyticsData?.extVoltage}
              />
            </Col>
            {/* <Col xxl="3" sm="4">
              <DataCard
                title="Total Devices"
                percentChange={"2.5"}
                up={true}
                chart={<DefaultOrderChart />}
                amount={devices ? `${devices.length}` : "NA"}
              />
            </Col> */}
            {/* <Col xxl="3" sm="4">
              <DataCard
                title="Devices Online"
                percentChange={"2.5"}
                up={false}
                chart={<DefaultRevenueChart />}
                amount={devices ? `${devices.filter((i) => i.DeviceStatus === "Online").length}` : "NA"}
              />
            </Col> */}
          </Row>
        </Block>
        <Block>
          <Row>
            <Col md={6}>
              <PreviewCard>
                <div className="card-head">
                  <h6 className="title">GPS Signal Strength</h6>
                </div>
                <div className="nk-ck-sm">
                  <LineChartExample legend={false} data={gpschart} />
                </div>
              </PreviewCard>
            </Col>
            <Col md={6}>
              <PreviewCard>
                <div className="card-head">
                  <h6 className="title">GSM Signal Strength</h6>
                </div>
                <div className="nk-ck-sm">
                  <LineChartExample legend={false} data={gsmChart} />
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

export default VehicleInfo;
