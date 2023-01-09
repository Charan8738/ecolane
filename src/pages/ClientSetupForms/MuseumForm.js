import React, { useState, useEffect } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Button, Label, Form, ButtonGroup } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, OverlineTitle, Icon, PreviewCard } from "../../components/Component";
import classNames from "classnames";
import { fetchDevices, selectAllDevices, getDevicesStatus } from "../../redux/deviceSlice";
import { user_id } from "../../redux/userSlice";
import { useForm } from "react-hook-form";
import MultipleListDnd from "../../components/partials/dnd/MultipleListDnd";
import { HuePicker } from "react-color";
import axios from "axios";
const MuseumFormTwo = ({ Rssvalue, BibobRssi }) => {
  const dispatch = useDispatch();
  const [colors, setColors] = useState({
    PrimaryColorcode: "",
    SecondaryColorcode: "",
    ClientPrimaryColorcode: "",
    ClientSecondaryColorcode: "",
  });
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [latlng, setLatLng] = useState([null, null]);
  const [status, setStatus] = useState(1);
  const [validationMode, setValidationMode] = useState(1);
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
      // Clientid: device.client_id,
      Bus_serialno: device.DeviceSerialNo,
    }));
    setSelectedDevices([...newDeviceList]);
  };
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const { errors, register, handleSubmit } = useForm();
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
  const submitHandler = (data) => {
    let macList = [...selectedDevices].map((device) => ({
      ...device,
      Bibolat: latlng[0],
      Bibolng: latlng[1],
      Major: "101",
      Minor: "7",
    }));
    let formData = {
      ...data,
      Macaddresslist: macList,
      Clientlat: latlng[0],
      Clientlng: latlng[1],
      Status: status,
      Clienttype: 8,
      Rssvalue: Rssvalue,
      Maxticket: 100,
      Quantityres: true,
      Hardwareurl: "mqtt.zig-web.com",
      Price: 10,
      Activatestatus: true,
      Message: "Sample string",
      Scanintervalo: 1,
      Documentverifyurl: "www.zed.digital",
      BeaconRadius: 1,
      A_macaddress: "",
      Locationpermission: true,
      Validationmode: validationMode,
      EnableTripPlanner: true,
      SendOutData: true,
      BeverageMainValidationStatus: 0,
      BibobRssi: BibobRssi,
      ...colors,
    };
    console.log(formData);
    console.log("test");
    /*axios
      .post("url", { ...formData })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => window.alert("Error in posting"));*/
  };
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
          ].map((item) => (
            <NavItem style={{ cursor: "pointer" }}>
              <NavLink className={activeTab === item.tab ? "active" : ""} onClick={() => setActiveTab(item.tab)}>
                {item.title}
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
                      id="Clientname"
                      name="Clientname"
                    />
                    {errors.Clientname && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
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
                    />
                    {errors.Clientuuid && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>

              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="Clientlat" className="form-label">
                    Location
                  </Label>
                  <div className="form-control-wrap">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        name="Clientlat"
                        id="Clientlat"
                        placeholder="Latitude"
                        value={latlng[0] ?? ""}
                        onChange={(e) => locationChangeHandler(e, 0)}
                      />
                      <input
                        type="text"
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
                    {errors.Clientname && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <Label htmlFor="Radius" className="form-label">
                    Radius
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true, min: 0 })}
                      className="form-control"
                      type="number"
                      id="Radius"
                      name="Radius"
                    />
                    {errors.Radius && <span className="invalid">This field is required</span>}
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
                    />
                    {errors.freeticket && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
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
                    />
                    {errors.Miscfee && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row className="gy-4">
              <Col sm="6">
                <FormGroup>
                  <label className="form-label">Validation Mode</label>
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

              <Col sm="12">
                <OverlineTitle className="preview-title">Device Selection</OverlineTitle>
                <Row>
                  <Col sm="6">
                    <Label className="form-label">Selected Devices</Label>
                  </Col>

                  <Col sm="6">
                    <Label className="form-label">All Devices</Label>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="g-gs">
              {deviceStatus === "succeeded" ? (
                <MultipleListDnd
                  dndDataSet1={[]}
                  dndDataSet2={[...devices]}
                  selectDeviceHandler={selectDeviceHandler}
                />
              ) : null}
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row className="gy-4">
              {[
                { title: "Client Image URL", name: "Clientimage" },
                { title: "Client Description", name: "Client Description" },
                { title: "Client Disclaimer", name: "Client Disclaimer" },
                { title: "Client Misc Image URL", name: "Clientmiscimage" },
                { title: "Beverage Instruction Text", name: "BeverageInstructionText" },
                { title: "Beverage Title", name: "BeverageTitle" },
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
                      />
                      {errors[item.name] && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
              ))}
              {[
                { title: "Verification Title", name: "VerificationTitle" },
                { title: "Verification Sub Title", name: "VerificationSubTitle" },
                { title: "Verification Description", name: "VerificationDesc" },
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
                      <HuePicker
                        width="75%"
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
                { title: "Step 1 Text", name: "Step1Text" },
                { title: "Step 2 Text", name: "Step2Text" },
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
                { title: "Client Sub Description", name: "ClientSubDesc" },
                { title: "Order Confirmed Title", name: "Order_confirmed_Title" },
                { title: "Order Confirmed Subtitle", name: "Order_confirmed_Subtitle" },
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
                      />
                      {errors[item.name] && <span className="invalid">This field is required</span>}
                    </div>
                  </FormGroup>
                </Col>
              ))}
              {[
                { title: "FarepageTitle", name: "FarepageTitle" },
                { title: "Fare Message", name: "Faremessage" },
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
