import React, { useEffect } from "react";
import { Card, Input, FormGroup, Label, Spinner } from "reactstrap";
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
const TrackerInfo = () => {
  const location = useLocation();
  const initialDate = new Date();
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const [viewOption, setViewOption] = useState("realtime");
  const [gpsData, setGpsData] = useState();
  const imei = location.state?.Macaddress;
  const vehicleType = 5;
  console.log("Vehicle Type " + vehicleType);

  useEffect(() => {
    const getGpsData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/gpsdata");
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
            <Col sm="4">
              <FormGroup>
                <Label className="form-label">View Options</Label>
                <div className="form-control-wrap">
                  <div className="form-control-select"></div>
                </div>
              </FormGroup>
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
