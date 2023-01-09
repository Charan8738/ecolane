import React, { useState, useEffect } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormGroup,
  Button,
  Label,
  Form,
  ButtonGroup,
  Input,
  Badge,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, OverlineTitle, Icon, PreviewCard } from "../../components/Component";
import classNames from "classnames";
import { fetchDevices, selectAllDevices, getDevicesStatus } from "../../redux/deviceSlice";
import { user_id } from "../../redux/userSlice";
import { useForm } from "react-hook-form";
import MultipleListDnd from "../../components/partials/dnd/MultipleListDnd";
import { SketchPicker } from "react-color";
import axios from "axios";
const MuseumFormTwo = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const [colors, setColors] = useState({
    PrimaryColorcode: "#4b1010",
    SecondaryColorcode: "#4b1010",
    ClientPrimaryColorcode: "#4b1010",
    ClientSecondaryColorcode: "#4b1010",
  });
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [latlng, setLatLng] = useState([null, null]);
  const [status, setStatus] = useState(1);
  const [activateStatus, setActivateStatus] = useState(false);
  const [validationMode, setValidationMode] = useState(2);
  const [iosValidationMode, setIosValidationMode] = useState(2);
  const [locationType, setLocationType] = useState(0); // 0 - Address  1 - Latitude
  const userId = useSelector(user_id);
  const devices = useSelector(selectAllDevices);
  const deviceStatus = useSelector(getDevicesStatus);
  const [activeTab, setActiveTab] = useState("1");
  const selectDeviceHandler = (newDevices) => {
    const newDeviceList = newDevices.map((device) => ({
      BiboO_Macaddress: device.BIBOOMACAddress,
      BiboA_Macaddress: device.BIBOAMACAddress,
      Macaddress: device.WifiMacAddress,
      iBibo_Macaddress: device.IBeaconAMACAddress,
      Major: device.IBeaconAMajor,
      Minor: device.IBeaconAMinor,
      // Clientid: device.client_id,
      Bus_serialno: device.DeviceSerialNo,
    }));
    setSelectedDevices([...newDeviceList]);
  };
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const { errors, register, handleSubmit, setError } = useForm();
  const getLocation = () => {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const success = (pos) => {
      setLatLng([pos.coords.latitude, pos.coords.longitude]);
    };
    const errors = (err) => {
      window.alert(`${err.message}`);
    };
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((res) => {
        if (res.state === "granted") {
          navigator.geolocation.getCurrentPosition(success);
        } else if (res.state === "prompt") {
          navigator.geolocation.getCurrentPosition(success, errors, options);
        } else {
          window.alert("Access Denied ");
        }
      });
    } else {
      window.alert("Sorry Not available!");
    }
  };
  const locationChangeHandler = (event, idx) => {
    let newLoc = [...latlng];
    newLoc[idx] = event.target.value;
    setLatLng([...newLoc]);
  };
  const addressToLatLng = async (data) => {
    const axiosInstance = axios.create();
    const response = await axiosInstance.get("https://nominatim.openstreetmap.org/search", {
      params: { q: data, format: "json", polygon: 1, addressdetails: 1 },
    });
    if (response.status === 200) {
      if ([...response.data].length !== 0) {
        const res = response.data[0];
        return [res.lat, res.lon];
      } else {
        setError("address", { type: "custom", message: "Coordinates not found" });
        return [];
      }
    }
    return [];
  };
  const submitHandler = async (data) => {
    let res = [];
    // Address lat and lng check
    if (locationType === 0) {
      res = await addressToLatLng(data.address);
      if (res.length === 0) return;
    }
    delete data?.address;
    let macList = [...selectedDevices].map((device) => ({
      ...device,
      Bibolat: locationType === 0 ? res[0] : latlng[0],
      Bibolng: locationType === 0 ? res[1] : latlng[1],
    }));
    let formData = {
      ...data,
      client_id: userId,
      Macaddresslist: macList,
      Clientlat: locationType === 0 ? +res[0] : +latlng[0],
      Clientlng: locationType === 0 ? +res[1] : +latlng[1],
      Status: status,
      Clienttype: 8,
      Maxticket: 100,
      Quantityres: true,
      Hardwareurl: "mqtt.zig-web.com",
      Price: 10,
      Activatestatus: activateStatus,
      Scanintervalo: 10000,
      Documentverifyurl: "www.zed.digital",
      BeaconRadius: 850,
      A_macaddress: "",
      Locationpermission: true,
      Validationmode: validationMode,
      Validationmode_B: iosValidationMode,
      SendOutData: true,
      BeverageMainValidationStatus: 0,
      EnableVIP: true,
      Serviceinterval: +data.Serviceinterval,
      Paymentinfotxt: "This field cannot be blank",
      ...colors,
    };
    console.log(formData);
    onSubmit(formData);
  };
  const tabWiseErrors = [0, 0, 0, 0];
  if (Object.entries(errors).length > 0) {
    if (
      errors?.Clientname ||
      errors?.Clientuuid ||
      errors?.Clientlat ||
      errors?.Clientlng ||
      errors?.Radius ||
      errors?.Serviceinterval ||
      errors?.address
    )
      tabWiseErrors[0] = 1;

    if (errors?.freeticket || errors?.Scaninterval || errors?.Miscfee || errors?.Message) tabWiseErrors[1] = 1;
    if (errors?.device) tabWiseErrors[2] = 1;
    if (errors?.Clientimage || errors?.Clientdesc) tabWiseErrors[3] = 1;
  }
  console.log(errors);
  useEffect(() => {
    if (deviceStatus === "idle") {
      dispatch(fetchDevices(userId));
    }
  }, []);
  return (
    <Form className={formClass} onSubmit={handleSubmit(submitHandler)}>
      <PreviewCard>
        <Nav tabs className="mt-n3">
          {[
            { title: "Basic", tab: "1" },
            { title: "Ticket Payment", tab: "2" },
            { title: "Device Setup", tab: "3" },
            { title: "Branding", tab: "4" },
          ].map((item, idx) => (
            <NavItem style={{ cursor: "pointer" }}>
              <NavLink className={activeTab === item.tab ? "active" : ""} onClick={() => setActiveTab(item.tab)}>
                {item.title}
                {tabWiseErrors[idx] === 1 ? <font color="red">*</font> : null}
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        <TabContent activeTab={activeTab} className="mt-4">
          <TabPane tabId="1">
            <Row className="gy-4">
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="Clientname" className="form-label">
                    Client Name
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true })}
                      className="form-control"
                      type="text"
                      placeholder="Enter client name"
                      id="Clientname"
                      name="Clientname"
                    />
                    {errors.Clientname && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <label className="form-label" htmlFor="location">
                    Location
                  </label>
                  <div className="form-control-wrap">
                    <div className="form-control-select">
                      <Input
                        type="select"
                        name="location"
                        id="location"
                        onChange={(event) => setLocationType(+event.target.value)}
                      >
                        <option value={0}>Address</option>
                        <option value={1}>Latitude and Longitude</option>
                      </Input>
                    </div>
                  </div>
                </FormGroup>
              </Col>
              {locationType === 0 ? (
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="address">
                      Address
                    </label>
                    <div className="form-control-wrap">
                      <input
                        ref={register({ required: true })}
                        type="text"
                        name="address"
                        placeholder="Enter address"
                        className="form-control"
                      />
                      {errors.address ? (
                        <span className="invalid">{errors?.address?.message || "This field is required"}</span>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
              ) : (
                <Col sm="6">
                  <FormGroup>
                    <Label htmlFor="Clientlat" className="form-label">
                      Coordinates
                    </Label>
                    <div className="form-control-wrap">
                      <div className="input-group">
                        <input
                          ref={register({ required: true, min: -90, max: 90 })}
                          type="number"
                          className="form-control"
                          name="Clientlat"
                          id="Clientlat"
                          placeholder="Latitude"
                          value={latlng[0] ?? ""}
                          onChange={(e) => locationChangeHandler(e, 0)}
                        />
                        <input
                          type="number"
                          ref={register({ required: true, min: -180, max: 180 })}
                          className="form-control"
                          name="Clientlng"
                          id="Clientlng"
                          placeholder="Longitude"
                          value={latlng[1] ?? ""}
                          onChange={(e) => locationChangeHandler(e, 1)}
                        />
                        <div className="input-group-append">
                          <Button color="primary" onClick={() => getLocation()}>
                            <Icon name="map-pin"></Icon>
                          </Button>
                        </div>
                      </div>
                      {(errors.Clientlat || errors.Clientlng) && <span className="invalid">This field is invalid</span>}
                    </div>
                  </FormGroup>
                </Col>
              )}

              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="Clientuuid" className="form-label">
                    Client UUID
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true })}
                      className="form-control"
                      type="text"
                      id="Clientuuid"
                      name="Clientuuid"
                      defaultValue={"88b78a0c-34ae-44d0-b30c-84153fec0f9a"}
                    />
                    {errors.Clientuuid && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="Radius" className="form-label">
                    Radius (m)
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true, min: 0 })}
                      className="form-control"
                      type="number"
                      id="Radius"
                      name="Radius"
                      defaultValue={200}
                    />
                    {errors.Radius && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="Serviceinterval" className="form-label">
                    Service Interval (min)
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true, min: 0 })}
                      className="form-control"
                      defaultValue={30}
                      type="number"
                      id="Serviceinterval"
                      name="Serviceinterval"
                    />
                    {errors.Serviceinterval && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <div className="form-control-wrap">
                    <ButtonGroup>
                      <Button color="primary" outline={status === 0} onClick={() => setStatus(1)}>
                        Enable
                      </Button>
                      <Button color="primary" outline={status === 1} onClick={() => setStatus(0)}>
                        Disable
                      </Button>
                    </ButtonGroup>
                  </div>
                </FormGroup>
              </Col>
              {[
                { title: "Age Verification", name: "AgeVerification" },
                { title: "Enable Ticket", name: "EnableTicket" },
                { title: "Enable Trip Planner", name: "EnableTripPlanner" },
                { title: "Free Ticket", name: "freeticket" },
              ].map((item) => (
                <Col sm="3" key={item.name}>
                  <FormGroup>
                    <Label htmlFor={item.name} className="form-label">
                      {item.title}
                    </Label>
                    <div className="form-control-wrap">
                      <div className="custom-control custom-switch">
                        <input
                          ref={register()}
                          type="checkbox"
                          className="custom-control-input form-control"
                          id={item.name}
                          name={item.name}
                          placeholder=""
                          defaultChecked
                        />
                        <label className="custom-control-label" htmlFor={item.name}></label>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row className="gy-4">
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="Clientpayment" className="form-label">
                    Client Payment
                  </Label>
                  <div className="form-control-wrap">
                    <div className="custom-control custom-switch">
                      <input
                        ref={register()}
                        type="checkbox"
                        className="custom-control-input form-control"
                        id="Clientpayment"
                        name="Clientpayment"
                        placeholder=""
                      />
                      <label className="custom-control-label" htmlFor="Clientpayment"></label>
                    </div>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="activateStatus">
                    Activate Status
                  </label>
                  <div className="form-control-wrap">
                    <div className="custom-control custom-switch">
                      <input
                        ref={register()}
                        type="checkbox"
                        className="custom-control-input form-control"
                        id="activateStatus"
                        name="activateStatus"
                        checked={activateStatus}
                        onChange={() => setActivateStatus((prev) => !prev)}
                        placeholder=""
                      />
                      <label className="custom-control-label" htmlFor="activateStatus">
                        {activateStatus ? "Active" : "Inactive"}
                      </label>
                    </div>
                  </div>
                </div>
              </Col>

              {/* <Col sm="3">
                <FormGroup>
                  <Label htmlFor="freeticket" className="form-label">
                    Free Ticket
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true, min: 0 })}
                      className="form-control"
                      type="number"
                      id="freeticket"
                      name="freeticket"
                      defaultValue={1}
                    />
                    {errors.freeticket && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col> */}
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="Scaninterval" className="form-label">
                    Scan Interval
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true, min: 0 })}
                      className="form-control"
                      type="number"
                      id="Scaninterval"
                      name="Scaninterval"
                      defaultValue={10000}
                    />
                    {errors.Scaninterval && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="Miscfee" className="form-label">
                    Misc Fee
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true })}
                      className="form-control"
                      type="text"
                      id="Miscfee"
                      name="Miscfee"
                      defaultValue={0}
                    />
                    {errors.Miscfee && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="Message" className="form-label">
                    Activate Status Message
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true })}
                      className="form-control"
                      type="text"
                      id="Message"
                      name="Message"
                      defaultValue={"Your ticket has been activated"}
                    />
                    {errors.Message && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row className="gy-4">
              <Col sm="6">
                <FormGroup>
                  <label className="form-label">A Validation Mode</label>
                  <div className="form-control-wrap">
                    <ButtonGroup>
                      <Button color="primary" outline={validationMode !== 0} onClick={() => setValidationMode(0)}>
                        Dual Connection
                      </Button>
                      <Button color="primary" outline={validationMode !== 1} onClick={() => setValidationMode(1)}>
                        MQTT Mode
                      </Button>
                      <Button color="primary" outline={validationMode !== 2} onClick={() => setValidationMode(2)}>
                        BLE Mode
                      </Button>
                      <Button color="primary" outline={validationMode !== 3} onClick={() => setValidationMode(3)}>
                        NC
                      </Button>
                    </ButtonGroup>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <label className="form-label">B Validation Mode</label>
                  <div className="form-control-wrap">
                    <ButtonGroup>
                      <Button color="primary" outline={iosValidationMode !== 0} onClick={() => setIosValidationMode(0)}>
                        Dual Connection
                      </Button>
                      <Button color="primary" outline={iosValidationMode !== 1} onClick={() => setIosValidationMode(1)}>
                        MQTT Mode
                      </Button>
                      <Button color="primary" outline={iosValidationMode !== 2} onClick={() => setIosValidationMode(2)}>
                        BLE Mode
                      </Button>
                      <Button color="primary" outline={iosValidationMode !== 3} onClick={() => setIosValidationMode(3)}>
                        NC
                      </Button>
                    </ButtonGroup>
                  </div>
                </FormGroup>
              </Col>

              <Col sm="12">
                <OverlineTitle className="preview-title">Device Selection</OverlineTitle>
                <Row>
                  <Col sm="6">
                    <Label className="form-label">Selected Devices </Label>
                    {errors?.device ? (
                      <Badge color="danger" style={{ margin: "auto 10px" }}>
                        No devices selected
                      </Badge>
                    ) : null}
                  </Col>

                  <Col sm="6">
                    <Label className="form-label">All Devices</Label>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="g-gs">
              {deviceStatus === "succeeded" ? (
                <>
                  <MultipleListDnd
                    dndDataSet1={[]}
                    dndDataSet2={[...devices]}
                    selectDeviceHandler={selectDeviceHandler}
                  />
                  <input
                    hidden
                    ref={register({ required: true, minLength: 3 })}
                    value={JSON.stringify(selectedDevices)}
                    name="device"
                  />
                </>
              ) : null}
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row className="gy-4">
              {[
                { title: "Client Image URL", name: "Clientimage" },
                { title: "Client Description", name: "Clientdesc" },
                {
                  title: "Client Disclaimer",
                  name: "Clientdisclaimer",
                  defaultText: "NA",
                },
                { title: "Client Misc Image URL", name: "Clientmiscimage", defaultText: "NA" },
                {
                  title: "Beverage Instruction Text",
                  name: "BeverageInstructionText",
                  defaultText:
                    "Purchase you favorite beverage and proceed to counter and wait for your turn where you can get your ordered items and enjoy it.",
                },
                { title: "Beverage Title", name: "BeverageTitle", defaultText: "Food/Beverage" },
              ].map((item) => (
                <Col sm="6">
                  <FormGroup>
                    <Label htmlFor={item.name} className="form-label">
                      {item.title}
                    </Label>
                    <div className="form-control-wrap">
                      <input
                        ref={register({ required: true })}
                        className="form-control"
                        type="text"
                        id={item.name}
                        defaultValue={item?.defaultText ?? ""}
                        name={item.name}
                      />
                      {errors[item.name] && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
              ))}
              {[
                { title: "Verification Title", name: "VerificationTitle", defaultText: "Verification Title" },
                {
                  title: "Verification Sub Title",
                  name: "VerificationSubTitle",
                  defaultText: "Verification Sub Title",
                },
                {
                  title: "Verification Description",
                  name: "VerificationDesc",
                  defaultText: "Verification Description",
                },
              ].map((item) => (
                <Col sm="3">
                  <FormGroup>
                    <Label htmlFor={item.name} className="form-label">
                      {item.title}
                    </Label>
                    <div className="form-control-wrap">
                      <input
                        ref={register({ required: true })}
                        className="form-control"
                        type="text"
                        id={item.name}
                        name={item.name}
                        defaultValue={item?.defaultText ?? ""}
                      />
                      {errors[item.name] && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
              ))}
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="VerificationStatus" className="form-label">
                    Verification Status
                  </Label>
                  <div className="form-control-wrap">
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        ref={register()}
                        className="custom-control-input form-control"
                        id="VerificationStatus"
                        name="VerificationStatus"
                        placeholder=""
                        defaultChecked
                      />
                      <label className="custom-control-label" htmlFor="VerificationStatus"></label>
                    </div>
                  </div>
                </FormGroup>
              </Col>
              {[
                { title: "Primary Color Code", name: "PrimaryColorcode" },
                { title: "Secondary Color Code", name: "SecondaryColorcode" },
                { title: "Client Primary Color Code", name: "ClientPrimaryColorcode" },
                { title: "Client Secondary Color Code", name: "ClientSecondaryColorcode" },
              ].map((item) => (
                <Col sm="3" key={item.name}>
                  <FormGroup>
                    <Label htmlFor={item.name} className="form-label">
                      {item.title}
                    </Label>
                    <div className="form-control-wrap" style={{ padding: "0.25rem" }}>
                      {/*<HuePicker
                        width="75%"
                        color={colors[item.name]}
                        onChange={(color, e) => {
                          setColors((prevState) => ({ ...prevState, [item.name]: color.hex }));
                        }}
                      />*/}
                      <SketchPicker
                        color={colors[item.name]}
                        onChange={(color, e) => {
                          setColors((prevState) => ({ ...prevState, [item.name]: color.hex }));
                        }}
                      />
                    </div>
                  </FormGroup>
                </Col>
              ))}
              {[
                { title: "Step 1 Text", name: "Step1Text", defaultText: "Step1Text" },
                { title: "Step 2 Text", name: "Step2Text", defaultText: "Step2Text" },
                { title: "Pay Button Text", name: "PayButtonText", defaultText: "Get Ticket" },
              ].map((item) => (
                <Col sm="4">
                  <FormGroup>
                    <Label htmlFor={item.name} className="form-label">
                      {item.title}
                    </Label>
                    <div className="form-control-wrap">
                      <input
                        ref={register({ required: true })}
                        className="form-control"
                        type="text"
                        id={item.name}
                        defaultValue={item?.defaultText ?? ""}
                        name={item.name}
                      />
                      {errors[item.name] && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
              ))}
              {[
                { title: "Client Sub Description", name: "ClientSubDesc", defaultText: "Client Sub Description" },
                { title: "Order Confirmed Title", name: "Order_confirmed_Title", defaultText: "Order Confirmed Title" },
                {
                  title: "Order Confirmed Subtitle",
                  name: "Order_confirmed_Subtitle",
                  defaultText: "Order Confirmed Subtitle",
                },
              ].map((item) => (
                <Col sm="4">
                  <FormGroup>
                    <Label htmlFor={item.name} className="form-label">
                      {item.title}
                    </Label>
                    <div className="form-control-wrap">
                      <input
                        ref={register({ required: true })}
                        className="form-control"
                        type="text"
                        id={item.name}
                        name={item.name}
                        defaultValue={item?.defaultText ?? ""}
                      />
                      {errors[item.name] && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
              ))}
              {[
                { title: "Farepage Title", name: "FarepageTitle", defaultText: "Farepage Title" },
                { title: "Fare Message", name: "Faremessage", defaultText: "Fare Message" },
              ].map((item) => (
                <Col sm="6">
                  <FormGroup>
                    <Label htmlFor={item.name} className="form-label">
                      {item.title}
                    </Label>
                    <div className="form-control-wrap">
                      <input
                        ref={register({ required: true })}
                        className="form-control"
                        type="text"
                        id={item.name}
                        name={item.name}
                        defaultValue={item?.defaultText ?? ""}
                      />
                      {errors[item.name] && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
              ))}
            </Row>
          </TabPane>
        </TabContent>
      </PreviewCard>
      <hr className="preview-hr"></hr>
      <Row className="g-3">
        <Col lg="7" className="offset-lg-5">
          <FormGroup className="mt-2">
            <Button color="primary" size="lg" type="submit">
              Save
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default MuseumFormTwo;
