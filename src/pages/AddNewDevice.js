import React, { useEffect, useState } from "react";
import {
  Block,
  BlockHead,
  PreviewCard,
  BlockHeadContent,
  BlockTitle,
  Row,
  Col,
  BlockBetween,
} from "../components/Component";
import Swal from "sweetalert2";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addNewDevice } from "../redux/deviceSlice";
import { selectAllClients, fetchClients, getClientsStatus } from "../redux/clientSlice";
import { user_id } from "../redux/userSlice";
import { FormGroup, Button, ButtonGroup, Label, Form, Spinner, Input } from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";

const AddNewDevice = () => {
  const dispatch = useDispatch();
  const clients = useSelector(selectAllClients);
  const clientStatus = useSelector(getClientsStatus);
  const userId = useSelector(user_id);
  const INITIAL_DEVICE_DETAILS = {
    DeviceId: null,
    client_id: userId,
    DeviceName: "",
    DeviceSerialNo: "",
    DeviceStatus: "Offline",
    DeviceNetworkMode: "Wifi",
    DeviceOTAMode: "Live",
    DeviceWifiSSID: "",
    DeviceWifiPassword: "",
    TicketValidationRSSI: "",
    EspFirmwareUrl: null,
    EspFirmwareVersion: null,
    AtmegaFirmwareUrl: null,
    AtmegaFirmwareVersion: null,
    DisplayFirmwareUrl: null,
    DisplayFirmwareVersion: null,
    WifiMacAddress: "",
    BIBOAMACAddress: "",
    BIBOOMACAddress: "",
    BIBOBMACAddress: "",
    IBeaconAMACAddress: "",
    IBeaconOMACAddress: "",
    IBeaconBMACAddress: "",
    IBeaconAUUID: "",
    IBeaconOUUID: "",
    IBeaconBUUID: "",
    IBeaconAMajor: "",
    IBeaconOMajor: "",
    IBeaconBMajor: "",
    IBeaconAMinor: "",
    IBeaconOMinor: "",
    IBeaconBMinor: "",
    BiboARssi: null,
    BiboORssi: null,
    BiboBRssi: null,
    GpsMode: null,
    GpsFrequency: null,
    DisplayFrequency: null,
  };

  const [device, setDevice] = useState(INITIAL_DEVICE_DETAILS);
  const [status, setStatus] = useState("idle");
  const initialiseWidgets = async () => {
    await axios.post(
      "AddWidgets",
      {
        WifiMacAddress: device.WifiMacAddress,
        widget1: false,
        widget2: false,
        widget3: false,
        widget4: false,
        widget5: false,
        widget6: false,
      },
      { withCredentials: true }
    );
  };
  const postDeviceData = async () => {
    try {
      setStatus("pending");
      await dispatch(addNewDevice(device));
      await initialiseWidgets();
      setDevice(INITIAL_DEVICE_DETAILS);
      deviceAddedSuccess();
    } catch (err) {
      failure(err.message);
    } finally {
      setStatus("idle");
    }
  };
  const deviceAddedSuccess = () => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your device has been added",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const failure = (msg) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: msg,
      focusConfirm: true,
    });
  };
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setDevice((prevState) => ({ ...prevState, [name]: name === "DeviceId" || name === "client_id" ? +value : value }));
  };
  const { errors, register, handleSubmit } = useForm();
  const onFormSubmit = () => {
    postDeviceData();
  };
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  useEffect(() => {
    setDevice(INITIAL_DEVICE_DETAILS);

    return () => {
      setDevice(INITIAL_DEVICE_DETAILS);
    };
  }, []);

  useEffect(() => {
    if (clientStatus === "idle") {
      dispatch(fetchClients());
    }
  }, []);
  return (
    <React.Fragment>
      <Head title="Add New Device"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Add New Device
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <Form className={formClass} onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="gy-4">
                <Col sm="4">
                  <FormGroup>
                    <label className="form-label" htmlFor="sno">
                      Serial No
                    </label>
                    <div className="form-control-wrap">
                      <input
                        ref={register({ required: true })}
                        className="form-control"
                        name="DeviceSerialNo"
                        value={device.DeviceSerialNo}
                        onChange={onChangeHandler}
                        id="sno"
                      />
                      {errors.DeviceSerialNo && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <label className="form-label" htmlFor="id">
                      Device ID
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        ref={register({ required: true })}
                        name="DeviceId"
                        value={device.DeviceId === null || device.DeviceId === 0 ? "" : device.DeviceId}
                        onChange={onChangeHandler}
                        className="form-control"
                        id="id"
                      />
                      {errors.DeviceId && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <label className="form-label" htmlFor="DeviceName">
                      Device Name
                    </label>
                    <div className="form-control-wrap">
                      <input
                        ref={register({ required: true })}
                        className="form-control"
                        name="DeviceName"
                        value={device.DeviceName}
                        onChange={onChangeHandler}
                        id="DeviceName"
                      />
                      {errors.DeviceName && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="client-id">
                      Client ID
                    </label>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <Input
                          type="select"
                          name="client_id"
                          id="client-id"
                          disabled={clients.length === 0}
                          value={device.client_id ?? ""}
                          onChange={onChangeHandler}
                          defaultValue={device.client_id}
                        >
                          {clients.length > 0 &&
                            clients.map((item) => (
                              <option key={item?.id} value={item?.id}>
                                {item?.id}
                              </option>
                            ))}
                        </Input>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="ticket">
                      Ticket Validation RSSI
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        value={device.TicketValidationRSSI}
                        onChange={onChangeHandler}
                        ref={register({ required: true })}
                        name="TicketValidationRSSI"
                        className="form-control"
                        id="ticket"
                      />
                      {errors.TicketValidationRSSI && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <label className="form-label" htmlFor="status">
                      Status
                    </label>
                    <div className="form-control-wrap">
                      <ButtonGroup>
                        <Button
                          color="primary"
                          outline={device.DeviceStatus === "Online"}
                          onClick={() => setDevice((prevState) => ({ ...prevState, DeviceStatus: "Offline" }))}
                        >
                          Offline
                        </Button>
                        <Button
                          color="primary"
                          outline={device.DeviceStatus === "Offline"}
                          onClick={() => setDevice((prevState) => ({ ...prevState, DeviceStatus: "Online" }))}
                        >
                          Online
                        </Button>
                      </ButtonGroup>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <label className="form-label" htmlFor="ota">
                      OTA Mode
                    </label>
                    <div className="form-control-wrap">
                      <ButtonGroup>
                        <Button
                          color="primary"
                          outline={device.DeviceOTAMode === "Live"}
                          onClick={() => setDevice((prevState) => ({ ...prevState, DeviceOTAMode: "Inactive" }))}
                        >
                          Inactive
                        </Button>
                        <Button
                          color="primary"
                          outline={device.DeviceOTAMode === "Inactive"}
                          onClick={() => setDevice((prevState) => ({ ...prevState, DeviceOTAMode: "Live" }))}
                        >
                          Live
                        </Button>
                      </ButtonGroup>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="DeviceNetworkMode">
                      Network Mode
                    </label>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <Input
                          type="select"
                          name="DeviceNetworkMode"
                          id="DeviceNetworkMode"
                          value={device.DeviceNetworkMode}
                          onChange={onChangeHandler}
                        >
                          <option value="Wifi">Wifi</option>

                          <option value="GSM">GSM</option>
                          <option value="Safe">Safe</option>
                        </Input>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="ssid">
                      Wifi SSID
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        ref={register({ required: true, minLength: 3 })}
                        name="DeviceWifiSSID"
                        value={device.DeviceWifiSSID}
                        onChange={onChangeHandler}
                        className="form-control"
                        id="ssid"
                      />
                      {errors.DeviceWifiSSID && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="gps-mode">
                      GPS Mode
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        value={device.GpsMode ?? ""}
                        onChange={onChangeHandler}
                        name="GpsMode"
                        id="gps-mode"
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="pwd">
                      Wifi Password
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="password"
                        ref={register({ required: true, minLength: 8 })}
                        name="DeviceWifiPassword"
                        value={device.DeviceWifiPassword}
                        onChange={onChangeHandler}
                        className="form-control"
                        id="pwd"
                      />
                      {errors.DeviceWifiPassword && <span className="invalid">Mininum length is 8</span>}
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="gps-freq">
                      GPS Frequency
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        value={device.GpsFrequency ?? ""}
                        name="GpsFrequency"
                        onChange={onChangeHandler}
                        id="gps-freq"
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="wifi-mac">
                      Wifi MAC Address
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        ref={register({ required: true })}
                        name="WifiMacAddress"
                        value={device.WifiMacAddress}
                        onChange={onChangeHandler}
                        className="form-control"
                        id="wifi-mac"
                      />
                      {errors.WifiMacAddress && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="disp-freq">
                      Display Frequency
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        value={device.DisplayFrequency ?? ""}
                        name="DisplayFrequency"
                        onChange={onChangeHandler}
                        className="form-control"
                        id="disp-freq"
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      BIBOA
                    </Label>
                    <Row className="gy-2">
                      <Col sm="12">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              MAC Address
                            </span>
                          </div>
                          <input
                            value={device.BIBOAMACAddress}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="BIBOAMACAddress"
                            className="form-control"
                          />
                          {errors.BIBOAMACAddress && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="12">
                        <div className="input-group input-group-md">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              RSSI
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            value={device.BiboARssi ?? ""}
                            name="BiboARssi"
                            onChange={onChangeHandler}
                          />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      BIBOO
                    </Label>
                    <Row className="gy-2">
                      <Col sm="12">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              MAC Address
                            </span>
                          </div>
                          <input
                            value={device.BIBOOMACAddress}
                            type="text"
                            onChange={onChangeHandler}
                            ref={register({ required: true })}
                            name="BIBOOMACAddress"
                            className="form-control"
                          />
                          {errors.BIBOOMACAddress && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="12">
                        <div className="input-group input-group-md">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              RSSI
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            value={device.BiboORssi ?? ""}
                            onChange={onChangeHandler}
                            name="BiboORssi"
                          />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      BIBOB
                    </Label>
                    <Row className="gy-2">
                      <Col sm="12">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              MAC Address
                            </span>
                          </div>
                          <input
                            value={device.BIBOBMACAddress}
                            type="text"
                            onChange={onChangeHandler}
                            ref={register({ required: true })}
                            name="BIBOBMACAddress"
                            className="form-control"
                          />
                          {errors.BIBOBMACAddress && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="12">
                        <div className="input-group input-group-md">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              RSSI
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            name="BiboBRssi"
                            onChange={onChangeHandler}
                            value={device.BiboBRssi ?? ""}
                          />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      IBeacon A
                    </Label>
                    <Row className="gy-2">
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              MAC Address
                            </span>
                          </div>
                          <input
                            value={device.IBeaconAMACAddress}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconAMACAddress"
                            className="form-control"
                          />
                          {errors.IBeaconAMACAddress && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              UUID
                            </span>
                          </div>
                          <input
                            value={device.IBeaconAUUID}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconAUUID"
                            className="form-control"
                          />
                          {errors.IBeaconAUUID && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Major
                            </span>
                          </div>
                          <input
                            type="text"
                            value={device.IBeaconAMajor}
                            onChange={onChangeHandler}
                            ref={register({ required: true })}
                            name="IBeaconAMajor"
                            className="form-control"
                          />
                          {errors.IBeaconAMajor && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Minor
                            </span>
                          </div>
                          <input
                            value={device.IBeaconAMinor}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconAMinor"
                            className="form-control"
                          />
                          {errors.IBeaconAMinor && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      IBeacon O
                    </Label>
                    <Row className="gy-2">
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              MAC Address
                            </span>
                          </div>
                          <input
                            value={device.IBeaconOMACAddress}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconOMACAddress"
                            className="form-control"
                          />
                          {errors.IBeaconOMACAddress && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              UUID
                            </span>
                          </div>
                          <input
                            value={device.IBeaconOUUID}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconOUUID"
                            className="form-control"
                          />
                          {errors.IBeaconOUUID && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Major
                            </span>
                          </div>
                          <input
                            value={device.IBeaconOMajor}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconOMajor"
                            className="form-control"
                          />
                          {errors.IBeaconOMajor && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Minor
                            </span>
                          </div>
                          <input
                            value={device.IBeaconOMinor}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconOMinor"
                            className="form-control"
                          />
                          {errors.IBeaconOMinor && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      IBeacon B
                    </Label>
                    <Row className="gy-2">
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              MAC Address
                            </span>
                          </div>
                          <input
                            value={device.IBeaconBMACAddress}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconBMACAddress"
                            className="form-control"
                          />
                          {errors.IBeaconBMACAddress && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              UUID
                            </span>
                          </div>
                          <input
                            value={device.IBeaconBUUID}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconBUUID"
                            className="form-control"
                          />
                          {errors.IBeaconBUUID && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Major
                            </span>
                          </div>
                          <input
                            type="text"
                            value={device.IBeaconBMajor}
                            onChange={onChangeHandler}
                            ref={register({ required: true })}
                            name="IBeaconBMajor"
                            className="form-control"
                          />
                          {errors.IBeaconBMajor && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Minor
                            </span>
                          </div>
                          <input
                            value={device.IBeaconBMinor}
                            onChange={onChangeHandler}
                            type="text"
                            ref={register({ required: true })}
                            name="IBeaconBMinor"
                            className="form-control"
                          />
                          {errors.IBeaconBMinor && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup>
                    <Label htmlFor="firmwareUrl" className="form-label">
                      ATMega Firmware
                    </Label>
                    <Row className="gy-2">
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Firmware URL
                            </span>
                          </div>
                          <input
                            value={device.AtmegaFirmwareUrl ?? ""}
                            onChange={onChangeHandler}
                            type="text"
                            id="firmwareUrl"
                            name="AtmegaFirmwareUrl"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Version
                            </span>
                          </div>
                          <input
                            value={device.AtmegaFirmwareVersion ?? ""}
                            onChange={onChangeHandler}
                            type="text"
                            name="AtmegaFirmwareVersion"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup>
                    <Label htmlFor="espUrl" className="form-label">
                      ESP Firmware
                    </Label>
                    <Row className="gy-2">
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Firmware URL
                            </span>
                          </div>
                          <input
                            value={device.EspFirmwareUrl ?? ""}
                            onChange={onChangeHandler}
                            type="text"
                            id="espUrl"
                            name="EspFirmwareUrl"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Version
                            </span>
                          </div>
                          <input
                            value={device.EspFirmwareVersion ?? ""}
                            onChange={onChangeHandler}
                            type="text"
                            id="espVersion"
                            name="EspFirmwareVersion"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      Display Firmware
                    </Label>
                    <Row className="gy-2">
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Firmware URL
                            </span>
                          </div>
                          <input
                            value={device.DisplayFirmwareUrl ?? ""}
                            onChange={onChangeHandler}
                            type="text"
                            id="displayFirmware"
                            name="DisplayFirmwareUrl"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="input-group input-group-md form-control-wrap">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-md">
                              Version
                            </span>
                          </div>
                          <input
                            value={device.DisplayFirmwareVersion ?? ""}
                            onChange={onChangeHandler}
                            type="text"
                            name="DisplayFirmwareVersion"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>

              <Col lg="12">
                <FormGroup className="mt-2">
                  <Button color="primary" size="lg" disabled={status === "pending"}>
                    {status === "pending" ? (
                      <>
                        <Spinner size="sm" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      "Add new device"
                    )}
                  </Button>
                </FormGroup>
              </Col>
            </Form>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default AddNewDevice;
