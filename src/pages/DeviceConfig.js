import React, { useEffect, useState } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import { Link } from "react-router-dom";
import { Success, failure } from "../utils/Utils";
import {
  Button,
  Icon,
  BlockBetween,
  BlockHead,
  BlockTitle,
  BlockHeadContent,
  BlockDes,
  Block,
  Row,
  Col,
} from "../components/Component";
import { Badge, Card, CardTitle, CardBody, Spinner } from "reactstrap";
import { getDevicesStatus, selectAllDevices, fetchDevices } from "../redux/deviceSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { user_id } from "../redux/userSlice";
import EditDeviceModal from "../components/EditDeviceModal/EditDeviceModal";
const CustomWidgets = React.lazy(() => import("../components/CustomWidgets/CustomWidgets"));
const AddWidgetModal = React.lazy(() => import("../components/AddWidgetModal/AddWidgetModal"));

const DeviceConfig = ({ match }) => {
  const dispatch = useDispatch();
  const devices = useSelector(selectAllDevices);
  const status = useSelector(getDevicesStatus);
  const userId = useSelector(user_id);
  const [device, setDevice] = useState({});
  const [widgets, setWidgets] = useState(new Array(6).fill(false));
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [networkMode, setNetworkMode] = useState(true);
  const buttonsDiv = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const PERIPHERAL_MODES = {
    PrinterWrist: "Wristband",
    Scanner: "Barcode Scanner",
    PrinterSmall: "Small Label",
    PrinterMedium: "Medium Label",
  };

  const pingDevice = async (event, Id, msg) => {
    console.log(msg);
    const response = await axios.get("Firmware/pingDevice?WifiMacAddress=" + Id + "&message=" + msg);
    // const response = await axios.get("Firmware/pingDevice?WifiMacAddress=98:CD:AC:51:4D:C4&message=201002");
    console.log(response.data);
    // setLogs(response.data);
  };
  const onChangeWidgetHandler = (newWidgets) => {
    setWidgets([...newWidgets]);
  };
  const fetchWidgetStatus = async (mac) => {
    const response = await axios.get("getWidgets", {
      params: {
        WifiMacAddress: mac,
      },
      withCredentials: true,
    });
    return response.data;
  };
  const onEditHandler = async (data) => {
    const response = await axios.put("iot/addDeviceData", { ...device, ...data });
    if (response.status === 200) {
      setDevice(response.data);
      Success("Device updated successfully");
      setShowEditModal(false);
    } else {
      failure("Error in updating device");
    }
  };
  //To fetch devices when user visits directly or refreshes the page
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDevices(userId));
    }
  }, []);
  //Get DeviceInfo from url params
  useEffect(() => {
    const id = match.params.id;
    if (id !== undefined || null || "") {
      const deviceInfo = devices.find((item) => item.DeviceId === +id);
      if (deviceInfo && deviceInfo?.WifiMacAddress) {
        setDevice(deviceInfo);
        fetchWidgetStatus(deviceInfo?.WifiMacAddress)
          .then((res) => {
            setWidgets([res.widget1, res.widget2, res.widget3, res.widget4, res.widget5, res.widget6]);
          })
          .catch((err) => console.log(err));
      }
    }
  }, [match.params.id, devices]);
  if (status === "loading")
    return (
      <React.Fragment>
        <Head title="Manage Device"></Head>
        <Content>
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
        </Content>
      </React.Fragment>
    );
  if (device?.DeviceId === undefined) {
    return (
      <React.Fragment>
        <Head title="Manage Device"></Head>
        <Content>
          <Card>
            <div className="nk-ecwg nk-ecwg6">
              <div className="card-inner">
                <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
                  <div>
                    <h6 className="title " style={{ textAlign: "center" }}>
                      No device found
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Content>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Head title="Manage Device">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
          integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
          crossorigin=""
        />
      </Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                {device ? device?.DeviceName : "No device found"}
              </BlockTitle>
              <BlockDes className="text-soft">
                <ul className="list-inline">
                  <li>
                    Device ID: <span className="text-base">{device != null && device?.DeviceId}</span>
                  </li>
                  <li>
                    Serial No: <span className="text-base">{device != null && device?.DeviceSerialNo}</span>
                  </li>
                </ul>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <Button color="primary" className="mr-4" onClick={() => setShowEditModal(true)}>
                <Icon name="edit" className="mr-0.5"></Icon>
                <span>Edit Device</span>
              </Button>
              <Link to={`${process.env.PUBLIC_URL}/`}>
                <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                  <Icon name="arrow-left"></Icon>
                  <span>Back</span>
                </Button>
                <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                  <Icon name="arrow-left"></Icon>
                </Button>
              </Link>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="gy-5">
            <Col lg="9">
              <Card className="card-bordered">
                <ul className="data-list is-compact">
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> Client ID </div>
                      <div className="data-value">{device != null && device?.client_id}</div>
                    </div>
                  </li>

                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> OTA Mode </div>
                      <div className="data-value">
                        <Badge size="sm" color="info">
                          {device != null && device?.DeviceOTAMode}
                        </Badge>
                      </div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> Network Mode </div>
                      <div className="data-value">
                        <Badge size="sm" color="secondary">
                          {device != null && device?.DeviceNetworkMode}
                        </Badge>
                      </div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> SSID </div>
                      <div className="data-value">{device != null && device?.DeviceWifiSSID}</div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> Wifi Macaddress </div>
                      <div className="data-value">{device != null && device?.WifiMacAddress}</div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> BIBO 1.1 A Macaddress </div>
                      <div className="data-value">{device != null && device?.BIBOAMACAddress}</div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> BIBO 1.1 O Macaddress </div>
                      <div className="data-value">{device != null && device?.BIBOOMACAddress}</div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> BIBO 1.1 C Macaddress </div>
                      <div className="data-value">{device != null && device?.BIBOBMACAddress}</div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> iBeacon A Macaddress </div>
                      <div className="data-value">{device != null && device?.IBeaconAMACAddress}</div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> iBeacon O Macaddress </div>
                      <div className="data-value">{device != null && device?.IBeaconOMACAddress}</div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> iBeacon B Macaddress </div>
                      <div className="data-value">{device != null && device?.IBeaconBMACAddress}</div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> Peripheral Mode </div>
                      <div className="data-value">
                        {device != null && device?.peripheralMode ? PERIPHERAL_MODES[device?.peripheralMode] : "Null"}
                      </div>
                    </div>
                  </li>
                  <li className="data-item">
                    <div className="data-col">
                      <div className="data-label"> Status </div>
                      <div className="data-value">
                        <Badge
                          size="sm"
                          color={device?.DeviceStatus === "Online" ? "outline-success" : "outline-danger"}
                          className="badge-dim"
                        >
                          {device != null && device?.DeviceStatus}
                        </Badge>
                      </div>
                    </div>
                  </li>
                </ul>
              </Card>
              <div className="card bg-secondary">
                <div style={buttonsDiv} className="card-header text-white">
                  <Button
                    className="btn btn-primary"
                    style={{ float: "right" }}
                    onClick={(event) => pingDevice(event, device.WifiMacAddress, "PING")}
                    color="danger"
                  >
                    Ping Request
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    className="btn btn-primary"
                    style={{ float: "right" }}
                    onClick={(event) => pingDevice(event, device.WifiMacAddress, "STOP#OK")}
                    color="danger"
                  >
                    Stop Request
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    className="btn btn-primary"
                    style={{ float: "right" }}
                    onClick={(event) => pingDevice(event, device.WifiMacAddress, "SOS#OK")}
                    color="danger"
                  >
                    SOS Request
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    className="btn btn-primary"
                    style={{ float: "right" }}
                    onClick={(event) => pingDevice(event, device.WifiMacAddress, "PUSH")}
                    color="danger"
                  >
                    Troubleshoot
                  </Button>
                </div>
              </div>
            </Col>

            <Col lg="3">
              <Card className="text-center">
                <CardBody className="card-inner">
                  <CardTitle tag="h5">Release Update</CardTitle>
                  <Button color="primary">Update</Button>
                </CardBody>
                <CardBody>
                  <CardTitle tag="h5">Add Widget</CardTitle>
                  <Button color="primary" onClick={() => setShowWidgetModal(true)}>
                    Add
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="gy-5">
            <Col sm="12">
              {!widgets.every((widget) => widget === false) && <CustomWidgets widgets={widgets} device={device} />}
            </Col>
          </Row>
        </Block>
      </Content>
      {showWidgetModal && (
        <AddWidgetModal
          widgets={widgets}
          changeHandler={onChangeWidgetHandler}
          showModal={showWidgetModal}
          macAddress={device?.WifiMacAddress}
          toggleForm={() => setShowWidgetModal(false)}
        />
      )}
      {showEditModal && (
        <EditDeviceModal
          showModal={showEditModal}
          toggleHandler={() => setShowEditModal(false)}
          submitHandler={(data) => onEditHandler(data)}
          deviceInfo={device}
        />
      )}
    </React.Fragment>
  );
};

export default DeviceConfig;
