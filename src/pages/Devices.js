import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import { Card } from "reactstrap";
import { user_id } from "../redux/userSlice";
import styled from "styled-components";
import DataCardCustom from "../components/partials/default/DataCardCustom";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Row,
  Col,
  BlockBetween,
  Icon,
} from "../components/Component";
import { DefaultOrderChart, DefaultRevenueChart } from "../components/partials/charts/default/DefaultCharts";
import DeviceTable from "../components/table/DeviceTable";
import DeviceTableTwo from "../components/table/DeviceTableTwo";
import { useSelector, useDispatch } from "react-redux";
import beacon from "../assets/images/all_beacon.png";
import online_beacon from "../assets/images/online_beacon.png";
import offline_beacon from "../assets/images/offline_beacon.png";
import backgroundImage from "../assets/images/device_background.png";

import {
  fetchDevices,
  selectAllDevices,
  getDevicesError,
  getDevicesStatus,
  setStatusToIdle,
} from "../redux/deviceSlice";
import axios from "axios";
const Homepage = () => {
  const dispatch = useDispatch();
  const devices = useSelector(selectAllDevices);
  const status = useSelector(getDevicesStatus);
  const error = useSelector(getDevicesError);
  const userId = useSelector(user_id);
  const [deviceStatus, setDeviceStatus] = useState("All");
  const refreshDevice = async () => {
    const response = await axios.get("Firmware/test");
    if (response.status === 200) {
      dispatch(setStatusToIdle());
    }
  };
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDevices(userId));
    }
  }, [status, dispatch]);

  return (
    <React.Fragment>
      <Head title="Homepage"></Head>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "280px",
          paddingTop: "105px",
        }}
      >
        <BlockTitle page tag="h3">
          <Title>Devices</Title>
        </BlockTitle>
      </div>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              {/* <BlockTitle page tag="h3">
                Devices
              </BlockTitle> */}
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="4">
              <DataCardCustom
                title="Total Devices"
                percentChange={"2.5"}
                up={true}
                chart={<DefaultOrderChart />}
                image={beacon}
                amount={devices ? `${devices.length}` : "NA"}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardCustom
                title="Devices Online"
                percentChange={"2.5"}
                up={false}
                chart={<DefaultRevenueChart />}
                image={online_beacon}
                amount={devices ? `${devices.filter((i) => i.DeviceStatus === "Online").length}` : "NA"}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCardCustom
                title="Devices Offline"
                percentChange={"2.5"}
                up={false}
                chart={<DefaultRevenueChart />}
                amount={devices ? `${devices.filter((i) => i.DeviceStatus === "Online").length}` : "NA"}
                image={offline_beacon}
              />
            </Col>
          </Row>
        </Block>
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Latest Device History</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <div className="justify-between g-2  row m-2">
            <div className="col-7 text-left col-sm-4 ">
              <Button outline={deviceStatus !== "Online"} color="primary" onClick={() => setDeviceStatus("Online")}>
                Online
              </Button>
              <Button outline={deviceStatus !== "Offline"} color="primary" onClick={() => setDeviceStatus("Offline")}>
                Offline
              </Button>
              <Button outline={deviceStatus !== "All"} color="primary" onClick={() => setDeviceStatus("All")}>
                All
              </Button>
            </div>
            <div className="col-5 text-right col-sm-8 ">
              <Button color="primary" onClick={refreshDevice}>
                <Icon name="reload" />
                <span>Discover devices</span>
              </Button>
            </div>
          </div>
          <Card className="card-bordered card-preview">
            <DeviceTableTwo deviceStatus={deviceStatus} devices={devices} status={status} error={error} />
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};
const Title = styled.h3`
  font-size: 112px;
  font-weight: 900;
  padding-left: 32px;
`;
export default Homepage;
