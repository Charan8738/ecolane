import React, { useState, useEffect } from "react";
import { Block, BlockHead, PreviewCard, BlockHeadContent, BlockTitle, BlockBetween } from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { user_id } from "../redux/userSlice";
import styled from "styled-components";
import backgroundImage from "../assets/images/Tickets.png";
import NewTicketsTable from "../components/table/NewTicketsTable";
import { useSelector, useDispatch } from "react-redux";
import { Card, Row, Col, Modal, ModalBody, Button, Spinner, FormGroup, Label } from "reactstrap";
import {
  fetchDevices,
  selectAllDevices,
  getDevicesError,
  getDevicesStatus,
  setStatusToIdle,
} from "../redux/deviceSlice";
const tickets = () => {
  const dispatch = useDispatch();
  const devices = useSelector(selectAllDevices);
  const status = useSelector(getDevicesStatus);
  const error = useSelector(getDevicesError);
  const userId = useSelector(user_id);
  const [deviceMac, setDeviceMac] = useState("All");

  const onDeviceSelected = (e) => {
    console.log(e.target.value);
    setDeviceMac(e.target.value);
  };

  useEffect(() => {
    dispatch(fetchDevices(84));

    console.log(devices);
  }, []);
  return (
    <React.Fragment>
      <Head title="Tickets"></Head>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "305px",
          paddingTop: "140px",
        }}
      >
        <BlockTitle page tag="h3">
          <Title>Tickets</Title>
        </BlockTitle>
      </div>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3"></BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Payment Device</BlockTitle>
              <Row>
                {/* {devices && devices.length > 0 ?  } */}{" "}
                <Col className="col-5 text-left" sm="8">
                  <div className="dataTables_length" id="DataTables_Table_0_length">
                    <label>
                      {/* <span className="d-none d-sm-inline-block">Payment Device</span> */}
                      <div className="form-control-select">
                        {" "}
                        <select
                          name="DataTables_Table_0_length"
                          className="custom-select custom-select-sm form-control form-control-sm"
                          onChange={onDeviceSelected}
                          value={deviceMac}
                        >
                          <option value="All">All</option>
                          {devices &&
                            devices.map((device) => (
                              <option value={device.IBeaconAMACAddress}>{device.DeviceName}</option>
                            ))}
                          {/* <option value="10">All</option>
                          <option value="25">25</option>
                          <option value="40">40</option>
                          <option value="50">50</option> */}
                        </select>{" "}
                      </div>
                    </label>
                  </div>
                </Col>
              </Row>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <NewTicketsTable expandableRows pagination actions deviceMac={deviceMac} />
          </PreviewCard>
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
export default tickets;
