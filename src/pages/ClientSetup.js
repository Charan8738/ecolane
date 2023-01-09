import React, { useEffect, useRef, useState } from "react";
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
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { user_id } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { FormGroup, Input, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import TransitForm from "./ClientSetupForms/TransitForm";
import MuseumFormTwo from "./ClientSetupForms/MuseumFormTwo";
import Nouislider from "nouislider-react";
import axios from "axios";
import Swal from "sweetalert2";
import { Redirect } from "react-router-dom";

const ClientSetup = () => {
  const clientId = useSelector(user_id);
  const [businessType, setBusiness] = useState("Transit");
  const [loading, setLoading] = useState(false);
  const [validationRange, setValidationRange] = useState(-60);
  const [BibobRssi, setBibobRssi] = useState(-60);
  const [iosBibobRssi, setIosBibobRssi] = useState(-60);
  const [iosValidationRange, setIosValidationRange] = useState(-60);
  const [error, setError] = useState({
    businessName: false,
    Address: false,
    Rssvalue: false,
    BibobRssi: false,
    Rssi_ios: false,
    BibobRssi_ios: false,
  });
  const [redirect, setRedirect] = useState(false);
  const getRssiValueFromFt = (x) => {
    return -45 - 5 * x;
  };
  const getFtFromRssiValue = (y) => {
    let num = ((y + 45) / -5).toFixed(2);
    return isNaN(num) ? 3 : num;
  };
  const successAlert = () => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Venue added successfully",
      confirmButtonText: "Okay",
    }).then((result) => {
      if (result.isConfirmed) {
        setRedirect(true);
      }
    });
  };
  const failureAlert = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong",
      showConfirmButton: false,
      timer: 1500,
      backdrop: "static",
    });
  };

  const handleMuseumFormSubmission = (data) => {
    if (
      validationRange < -50 &&
      validationRange > -95 &&
      BibobRssi < -50 &&
      BibobRssi > -95 &&
      iosValidationRange < -50 &&
      iosValidationRange > -95 &&
      iosBibobRssi < -50 &&
      iosBibobRssi > -95
    ) {
      setError({
        businessName: false,
        Address: false,
        Rssvalue: false,
        BibobRssi: false,
        Rssi_ios: false,
        BibobRssi_ios: false,
      });
      const axiosInstanceRemote = axios.create();
      let submittedData = {
        ...data,
        Rssvalue: validationRange,
        Rssi_Ios: iosValidationRange,
        BibobRssi_ios: iosBibobRssi,
        BiboRssi_ios: iosBibobRssi,
        BibobRssi: BibobRssi,
      };
      setLoading(true);
      axiosInstanceRemote
        .post("AddNewClientVenue", submittedData)
        .then((res) => {
          setLoading(false);
          console.log(res);
          if (res.status === 201) {
            successAlert();
          } else {
            failureAlert();
          }
        })
        .catch((err) => {
          setLoading(false);
          window.alert("Error in adding new client");
        });
    } else {
      setError((prev) => ({
        ...prev,
        Rssvalue: !(validationRange < -50 && validationRange > -95),
        Rssi_ios: !(iosValidationRange < -50 && iosValidationRange > -95),
        BibobRssi: !(BibobRssi < -50 && BibobRssi > -95),
        BibobRssi_ios: !(iosBibobRssi < -50 && iosBibobRssi > -95),
      }));
    }
  };
  useEffect(() => {
    if (error) window.scrollTo(0, 0);
  }, [error]);
  if (redirect) return <Redirect to="/museum-data" />;
  return (
    <React.Fragment>
      <Head title="Profile"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Profile
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <Row className="gy-4">
              <Col sm="6">
                <FormGroup>
                  <label className="form-label" htmlFor="businessType">
                    Business Type
                  </label>
                  <div className="form-control-wrap">
                    <div className="form-control-select">
                      <Input
                        type="select"
                        name="businessType"
                        id="businessType"
                        onChange={(event) => setBusiness(event.target.value)}
                      >
                        <option value="Transit">Transit</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Hospital">Hospital</option>
                        <option value="Museum">Museum</option>
                        <option value="Bar">Bar</option>
                        <option value="University">University</option>
                        <option value="Zoo">Zoo</option>
                        <option value="Sports Event">Sports Event</option>
                        <option value="Amusement Parks">Amusement Parks</option>
                        <option value="Others">Others</option>
                      </Input>
                    </div>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6"></Col>
              <Col sm="6">
                <div className="form-group">
                  <label className="form-label">Android A Range</label>
                  <div className="form-control-wrap">
                    <Nouislider
                      className="form-range-slider"
                      accessibility
                      onChange={(props) => {
                        let num = getRssiValueFromFt(props[0]);
                        setValidationRange(num);
                      }}
                      tooltips={true}
                      padding={1}
                      connect={[true, false]}
                      start={[getFtFromRssiValue(validationRange)]}
                      step={0.01}
                      range={{
                        min: 0,
                        max: 11,
                      }}
                    ></Nouislider>
                    <div className=" d-flex justify-content-between">
                      <span>
                        {getFtFromRssiValue(validationRange)} {` ( ft ) `}
                      </span>
                      <div className="d-flex align-items-center">
                        <label className="m-2">Rssi</label>
                        <input
                          type="number"
                          name="Rssvalue"
                          value={validationRange === 0 ? "" : validationRange}
                          className="form-control"
                          onChange={(e) => setValidationRange(+e.target.value)}
                        />
                        {error.Rssvalue ? <span className="invalid">Invalid Input </span> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm="6">
                <div className="form-group">
                  <label className="form-label">Android B Range</label>
                  <div className="form-control-wrap">
                    <Nouislider
                      className="form-range-slider"
                      accessibility
                      onChange={(props) => {
                        let num = getRssiValueFromFt(props[0]);
                        setBibobRssi(num);
                      }}
                      tooltips={true}
                      padding={1}
                      connect={[true, false]}
                      start={[getFtFromRssiValue(BibobRssi)]}
                      step={0.01}
                      range={{
                        min: 0,
                        max: 11,
                      }}
                    ></Nouislider>
                    <div className=" d-flex justify-content-between">
                      <span>
                        {getFtFromRssiValue(BibobRssi)} {` ( ft ) `}
                      </span>
                      <div className="d-flex align-items-center">
                        <label className="m-2">Rssi</label>
                        <input
                          type="number"
                          name="BibobRssi"
                          value={BibobRssi === 0 ? "" : BibobRssi}
                          className="form-control"
                          onChange={(e) => setBibobRssi(+e.target.value)}
                        />
                        {error.BibobRssi ? <span className="invalid">Invalid Input </span> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm="6">
                <div className="form-group">
                  <label className="form-label">iOS A Range</label>
                  <div className="form-control-wrap">
                    <Nouislider
                      className="form-range-slider"
                      accessibility
                      onChange={(props) => {
                        let num = getRssiValueFromFt(props[0]);
                        setIosValidationRange(num);
                      }}
                      tooltips={true}
                      padding={1}
                      connect={[true, false]}
                      start={[getFtFromRssiValue(iosValidationRange)]}
                      step={0.01}
                      range={{
                        min: 0,
                        max: 11,
                      }}
                    ></Nouislider>
                    <div className=" d-flex justify-content-between">
                      <span>
                        {getFtFromRssiValue(iosValidationRange)} {` ( ft ) `}
                      </span>
                      <div className="d-flex align-items-center">
                        <label className="m-2">Rssi</label>
                        <input
                          type="number"
                          name="Rssvalue"
                          value={iosValidationRange === 0 ? "" : iosValidationRange}
                          className="form-control"
                          onChange={(e) => setIosValidationRange(+e.target.value)}
                        />
                        {error.Rssi_ios ? <span className="invalid">Invalid Input </span> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm="6">
                <div className="form-group">
                  <label className="form-label">iOS B Range</label>
                  <div className="form-control-wrap">
                    <Nouislider
                      className="form-range-slider"
                      accessibility
                      onChange={(props) => {
                        let num = getRssiValueFromFt(props[0]);
                        setIosBibobRssi(num);
                      }}
                      tooltips={true}
                      padding={1}
                      connect={[true, false]}
                      start={[getFtFromRssiValue(iosBibobRssi)]}
                      step={0.01}
                      range={{
                        min: 0,
                        max: 11,
                      }}
                    ></Nouislider>
                    <div className=" d-flex justify-content-between">
                      <span>
                        {getFtFromRssiValue(iosBibobRssi)} {` ( ft ) `}
                      </span>
                      <div className="d-flex align-items-center">
                        <label className="m-2">Rssi</label>
                        <input
                          type="number"
                          name="Rssvalue"
                          value={iosBibobRssi === 0 ? "" : iosBibobRssi}
                          className="form-control"
                          onChange={(e) => setIosBibobRssi(+e.target.value)}
                        />
                        {error.BibobRssi_ios ? <span className="invalid">Invalid Input </span> : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="12">
                {businessType === "Transit" && (
                  <TransitForm
                    clientId={clientId}
                    Rssvalue={validationRange}
                    BibobRssi={BibobRssi}
                    setError={setError}
                  />
                )}
                {businessType === "Restaurant" && (
                  //<React.Fragment>
                  //  <BlockTitle>
                  //    {businessType} Form
                  //    <form>
                  //      <Row className="gy-4">
                  //        <Col sm="6">
                  //          <FormGroup>
                  //            <Label htmlFor="default-0" className="form-label">
                  //              Restaraunt Cusine
                  //            </Label>
                  //            <div className="form-control-wrap">
                  //              <div className="custom-control custom-checkbox">
                  //                <input type="checkbox" className="custom-control-input form-control" id="chinese1" />
                  //                <label className="custom-control-label" htmlFor="chinese1">
                  //                  Chinese
                  //                </label>
                  //              </div>
                  //              &nbsp;&nbsp;
                  //              <div className="custom-control custom-checkbox">
                  //                <input type="checkbox" className="custom-control-input form-control" id="Mexican2" />
                  //                <label className="custom-control-label" htmlFor="Mexican2">
                  //                  Mexican
                  //                </label>
                  //              </div>
                  //              &nbsp;&nbsp;
                  //              <div className="custom-control custom-checkbox">
                  //                <input type="checkbox" className="custom-control-input form-control" id="Indian3" />
                  //                <label className="custom-control-label" htmlFor="Indian3">
                  //                  Indian
                  //                </label>
                  //              </div>
                  //              &nbsp;&nbsp;
                  //              <div className="custom-control custom-checkbox">
                  //                <input
                  //                  type="checkbox"
                  //                  className="custom-control-input form-control"
                  //                  id="customCheck4"
                  //                />
                  //                <label className="custom-control-label" htmlFor="customCheck4">
                  //                  Italian
                  //                </label>
                  //              </div>
                  //              &nbsp;&nbsp;
                  //              <div className="custom-control custom-checkbox">
                  //                <input
                  //                  type="checkbox"
                  //                  className="custom-control-input form-control"
                  //                  id="Continental5"
                  //                />
                  //                <label className="custom-control-label" htmlFor="Continental5">
                  //                  Continental
                  //                </label>
                  //              </div>
                  //              &nbsp;&nbsp;
                  //              <div className="custom-control custom-checkbox">
                  //                <input type="checkbox" className="custom-control-input form-control" id="Thai6" />
                  //                <label className="custom-control-label" htmlFor="Thai6">
                  //                  Thai
                  //                </label>
                  //              </div>
                  //              &nbsp;&nbsp;
                  //              <div className="custom-control custom-checkbox">
                  //                <input type="checkbox" className="custom-control-input form-control" id="Spanish7" />
                  //                <label className="custom-control-label" htmlFor="Spanish7">
                  //                  Spanish
                  //                </label>
                  //              </div>
                  //              &nbsp;&nbsp;
                  //              <div className="custom-control custom-checkbox">
                  //                <input type="checkbox" className="custom-control-input form-control" id="Japanese8" />
                  //                <label className="custom-control-label" htmlFor="Japanese8">
                  //                  Japanese
                  //                </label>
                  //              </div>
                  //              &nbsp;&nbsp;
                  //            </div>
                  //          </FormGroup>
                  //        </Col>
                  //
                  //        <Col sm="6">
                  //          <FormGroup>
                  //            <Label htmlFor="default-0" className="form-label">
                  //              Restaurant Name
                  //            </Label>
                  //            <div className="form-control-wrap">
                  //              <input
                  //                className="form-control"
                  //                type="text"
                  //                id="default-0"
                  //                placeholder="Enter Name of Restaraunt"
                  //              />
                  //            </div>
                  //          </FormGroup>
                  //        </Col>
                  //      </Row>
                  //      &nbsp;&nbsp;
                  //      <OverlineTitle tag="span" className="preview-title-lg">
                  //        Enter Restaraunt Details
                  //      </OverlineTitle>
                  //      <Row className="gy-4">
                  //        <Col sm="6">
                  //          <FormGroup>
                  //            <Label htmlFor="default-0" className="form-label">
                  //              Restaurant Address
                  //            </Label>
                  //            <div className="form-control-wrap">
                  //              <input
                  //                className="form-control"
                  //                type="text"
                  //                id="default-0"
                  //                placeholder="Enter Restaraunt address"
                  //              />
                  //            </div>
                  //          </FormGroup>
                  //        </Col>
                  //
                  //        <Col sm="6">
                  //          <FormGroup>
                  //            <Label htmlFor="default-0" className="form-label">
                  //              Pincode
                  //            </Label>
                  //            <div className="form-control-wrap">
                  //              <input
                  //                className="form-control"
                  //                type="text"
                  //                id="default-0"
                  //                placeholder="Enter Pincode"
                  //              />
                  //            </div>
                  //          </FormGroup>
                  //        </Col>
                  //
                  //        <Col sm="6">
                  //          <FormGroup>
                  //            <Label htmlFor="default-0" className="form-label">
                  //              Operational Hours
                  //            </Label>
                  //            <div className="form-control-wrap">
                  //              <input
                  //                className="form-control"
                  //                type="text"
                  //                id="default-0"
                  //                placeholder="Time of Operation"
                  //              />
                  //            </div>
                  //          </FormGroup>
                  //        </Col>
                  //
                  //        <Col sm="6">
                  //          <FormGroup>
                  //            <Label htmlFor="default-0" className="form-label">
                  //              Establishnment Type
                  //            </Label>
                  //            <div className="form-control-wrap">
                  //              <div className="form-control-select">
                  //                <Input type="select" name="select" id="default-4">
                  //                  <option value="default_option">Dine In and Delivery Only</option>
                  //                  <option value="option_select_name">Dine In</option>
                  //                  <option value="option_select_name">Delivery Only</option>
                  //                </Input>
                  //              </div>
                  //            </div>
                  //          </FormGroup>
                  //        </Col>
                  //
                  //        <Col sm="6">
                  //          <FormGroup>
                  //            <Label htmlFor="default-0" className="form-label">
                  //              Restaurant Landmark
                  //            </Label>
                  //            <div className="form-control-wrap">
                  //              <input
                  //                className="form-control"
                  //                type="text"
                  //                id="default-0"
                  //                placeholder="Restaraunt's Landmark"
                  //              />
                  //            </div>
                  //          </FormGroup>
                  //        </Col>
                  //
                  //        <Col sm="6">
                  //          <FormGroup>
                  //            <Label htmlFor="default-0" className="form-label">
                  //              FSSAI Details
                  //            </Label>
                  //            <div className="form-control-wrap">
                  //              <input
                  //                className="form-control"
                  //                type="text"
                  //                id="default-0"
                  //                placeholder="Enter FSSAI details"
                  //              />
                  //            </div>
                  //          </FormGroup>
                  //        </Col>
                  //      </Row>
                  //      <hr className="preview-hr"></hr>
                  //      <Row className="g-3">
                  <MuseumFormTwo onSubmit={handleMuseumFormSubmission} />
                  //      </Row>
                  //    </form>
                  //  </BlockTitle>
                  //</React.Fragment>
                )}
                {
                  businessType === "Hospital" && (
                    //<BlockTitle>
                    //  {businessType} Form
                    //  <form>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Hospital Name
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter Name of Hospital"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Operational Hours
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Time of Operation"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //    &nbsp;&nbsp;
                    //    <OverlineTitle tag="span" className="preview-title-lg">
                    //      Enter Hospital Details
                    //    </OverlineTitle>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Hospital Address
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter Hospital address"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Hospital Ownership
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input className="form-control" type="text" id="default-0" placeholder="Enter sector" />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Hospital Classification
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <div className="form-control-select">
                    //              <Input type="select" name="select" id="default-4">
                    //                <option value="default_option">General</option>
                    //                <option value="option_select_name">Clinics</option>
                    //                <option value="option_select_name">Teaching</option>
                    //                <option value="option_select_name">Psychiatric</option>
                    //                <option value="option_select_name">Specialty</option>
                    //                <option value="option_select_name">Super/Multi Specialty</option>
                    //              </Input>
                    //            </div>
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Basic Functions
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <div className="custom-control custom-switch">
                    //              <input
                    //                type="checkbox"
                    //                className="custom-control-input form-control"
                    //                defaultChecked
                    //                id="Ambulance2"
                    //              />
                    //              <label className="custom-control-label" htmlFor="Ambulance2">
                    //                {" "}
                    //                Ambulance{" "}
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //            <div className="custom-control custom-switch">
                    //              <input
                    //                type="checkbox"
                    //                className="custom-control-input form-control"
                    //                defaultChecked
                    //                id="customSwitch3"
                    //              />
                    //              <label className="custom-control-label" htmlFor="customSwitch3">
                    //                {" "}
                    //                ICU{" "}
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //            <div className="custom-control custom-switch">
                    //              <input
                    //                type="checkbox"
                    //                className="custom-control-input form-control"
                    //                defaultChecked
                    //                id="customSwitch4"
                    //              />
                    //              <label className="custom-control-label" htmlFor="customSwitch4">
                    //                {" "}
                    //                Critical-Care{" "}
                    //              </label>
                    //            </div>
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //    <hr className="preview-hr"></hr>
                    //    <Row className="g-3">
                    <MuseumFormTwo onSubmit={handleMuseumFormSubmission} />
                  )

                  //    </Row>
                  //  </form>
                  //</BlockTitle>
                }
                {businessType === "Museum" && <MuseumFormTwo onSubmit={handleMuseumFormSubmission} />}
                {
                  businessType === "Bar" && (
                    //<BlockTitle>
                    //  {businessType} Form
                    //  <form>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Bar Name
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter Name of the Bar"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Bar Features
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <div className="custom-control custom-switch">
                    //              <input
                    //                type="checkbox"
                    //                className="custom-control-input form-control"
                    //                defaultChecked
                    //                id="Ambulance2"
                    //              />
                    //              <label className="custom-control-label" htmlFor="Ambulance2">
                    //                {" "}
                    //                Bookings{" "}
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //            <div className="custom-control custom-switch">
                    //              <input
                    //                type="checkbox"
                    //                className="custom-control-input form-control"
                    //                defaultChecked
                    //                id="customSwitch3"
                    //              />
                    //              <label className="custom-control-label" htmlFor="customSwitch3">
                    //                {" "}
                    //                Takeaway{" "}
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //            <div className="custom-control custom-switch">
                    //              <input
                    //                type="checkbox"
                    //                className="custom-control-input form-control"
                    //                defaultChecked
                    //                id="customSwitch4"
                    //              />
                    //              <label className="custom-control-label" htmlFor="customSwitch4">
                    //                {" "}
                    //                Dine in lounge{" "}
                    //              </label>
                    //            </div>
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //    &nbsp;&nbsp;
                    //    <OverlineTitle tag="span" className="preview-title-lg">
                    //      Enter Bar Details
                    //    </OverlineTitle>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Bar Location
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter Bar address"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Party Options
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <div className="custom-control custom-checkbox">
                    //              <input type="checkbox" className="custom-control-input form-control" id="chinese1" />
                    //              <label className="custom-control-label" htmlFor="chinese1">
                    //                Live Music
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //            <div className="custom-control custom-checkbox">
                    //              <input type="checkbox" className="custom-control-input form-control" id="Mexican2" />
                    //              <label className="custom-control-label" htmlFor="Mexican2">
                    //                Games & Themed Nights.
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //            <div className="custom-control custom-checkbox">
                    //              <input type="checkbox" className="custom-control-input form-control" id="Japanese8" />
                    //              <label className="custom-control-label" htmlFor="Japanese8">
                    //                DJ & MJ
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //    <hr className="preview-hr"></hr>
                    //    <Row className="g-3">
                    <MuseumFormTwo onSubmit={handleMuseumFormSubmission} />
                  )

                  //</Col>    </Row>
                  //</PreviewCard>  </form>
                  //</BlockTitle>
                }
                {
                  businessType === "University" && (
                    //<BlockTitle>
                    //  {businessType} Form
                    //  <form>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            University Name
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter University's Name"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>

                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            City
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input className="form-control" type="text" id="default-0" placeholder="Enter City" />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //    &nbsp;&nbsp;
                    //    <OverlineTitle tag="span" className="preview-title-lg">
                    //      Enter University Details
                    //    </OverlineTitle>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            University Address
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter University address"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>

                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-4" className="form-label">
                    //            Shuttle Schedule
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <div className="custom-file">
                    //              <input
                    //                type="file"
                    //                multiple
                    //                className="custom-file-input form-control"
                    //                id="customFile"
                    //                onChange={(e) => setFile(e.target.files[0].name)}
                    //              />
                    //              <Label className="custom-file-label" htmlFor="customFile">
                    //                {file === "" ? "Choose file" : file}
                    //              </Label>
                    //            </div>
                    //          </div>
                    //        </FormGroup>
                    //      </Col>

                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Number of Schedules
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter Shuttle Schedules"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //    <hr className="preview-hr"></hr>
                    //    <Row className="g-3">
                    <MuseumFormTwo onSubmit={handleMuseumFormSubmission} />
                  )

                  //    </Row>
                  //  </form>
                  //</BlockTitle>
                }
                {
                  businessType === "Zoo" && (
                    //<BlockTitle>
                    //  {businessType} Form
                    //  <form>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Zoo Name
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter Name of the Zoo"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>

                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Zoo Location
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter Zoo Location"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //    &nbsp;&nbsp;
                    //    <OverlineTitle tag="span" className="preview-title-lg">
                    //      Enter Zoo Details
                    //    </OverlineTitle>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Zoo Type
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <div className="form-control-select">
                    //              <Input type="select" name="select" id="default-4">
                    //                <option value="default_option">General</option>
                    //                <option value="option_select_name">Wildlife Parks</option>
                    //                <option value="option_select_name">Aquariums</option>
                    //                <option value="option_select_name">Petting Zoo</option>
                    //                <option value="option_select_name">Bird Sanctuary</option>
                    //              </Input>
                    //            </div>
                    //          </div>
                    //        </FormGroup>
                    //      </Col>

                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Zoo Animals
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <div className="custom-control custom-checkbox">
                    //              <input type="checkbox" className="custom-control-input form-control" id="chinese1" />
                    //              <label className="custom-control-label" htmlFor="chinese1">
                    //                Amphibians
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //            <div className="custom-control custom-checkbox">
                    //              <input type="checkbox" className="custom-control-input form-control" id="Mexican2" />
                    //              <label className="custom-control-label" htmlFor="Mexican2">
                    //                Birds
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //            <div className="custom-control custom-checkbox">
                    //              <input type="checkbox" className="custom-control-input form-control" id="Indian3" />
                    //              <label className="custom-control-label" htmlFor="Indian3">
                    //                Invertebrates
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //            <div className="custom-control custom-checkbox">
                    //              <input
                    //                type="checkbox"
                    //                className="custom-control-input form-control"
                    //                id="customCheck4"
                    //              />
                    //              <label className="custom-control-label" htmlFor="customCheck4">
                    //                Reptiles
                    //              </label>
                    //            </div>
                    //            &nbsp;&nbsp;
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //  </form>
                    //  <Row className="g-3">
                    <MuseumFormTwo onSubmit={handleMuseumFormSubmission} />
                  )

                  //   </Row>
                  // </BlockTitle>
                }
                {
                  businessType === "Sports Event" && (
                    //BlockTitle>
                    // {businessType} Form
                    // <form>
                    //   <Row className="gy-4">
                    //     <Col sm="6">
                    //       <FormGroup>
                    //         <Label htmlFor="default-0" className="form-label">
                    //           Sport Name
                    //         </Label>
                    //         <div className="form-control-wrap">
                    //           <input
                    //             className="form-control"
                    //             type="text"
                    //             id="default-0"
                    //             placeholder="Enter Name of the sport"
                    //           />
                    //         </div>
                    //       </FormGroup>
                    //     </Col>

                    //     <Col sm="6">
                    //       <FormGroup>
                    //         <Label htmlFor="default-0" className="form-label">
                    //           Club Name
                    //         </Label>
                    //         <div className="form-control-wrap">
                    //           <input className="form-control" type="text" id="default-0" placeholder="Enter Club" />
                    //         </div>
                    //       </FormGroup>
                    //     </Col>
                    //   </Row>
                    //   &nbsp;&nbsp;
                    //   <OverlineTitle tag="span" className="preview-title-lg">
                    //     Enter Sport Details
                    //   </OverlineTitle>
                    //   <Row className="gy-4">
                    //     <Col sm="6">
                    //       <FormGroup>
                    //         <Label htmlFor="default-0" className="form-label">
                    //           Event Name
                    //         </Label>
                    //         <div className="form-control-wrap">
                    //           <input
                    //             className="form-control"
                    //             type="text"
                    //             id="default-0"
                    //             placeholder="Enter event name"
                    //           />
                    //         </div>
                    //       </FormGroup>
                    //     </Col>

                    //     <Col sm="6">
                    //       <FormGroup>
                    //         <Label htmlFor="default-0" className="form-label">
                    //           Event Location
                    //         </Label>
                    //         <div className="form-control-wrap">
                    //           <input
                    //             className="form-control"
                    //             type="text"
                    //             id="default-0"
                    //             placeholder="Enter Event Location"
                    //           />
                    //         </div>
                    //       </FormGroup>
                    //     </Col>

                    //     <Col sm="6">
                    //       <FormGroup>
                    //         <Label htmlFor="default-0" className="form-label">
                    //           Type of Sport Event
                    //         </Label>
                    //         <div className="form-control-wrap">
                    //           <div className="form-control-select">
                    //             <Input type="select" name="select" id="default-4">
                    //               <option value="default_option">Physical</option>
                    //               <option value="option_select_name">Mind</option>
                    //               <option value="option_select_name">Motorized</option>
                    //               <option value="option_select_name">Coordination</option>
                    //               <option value="option_select_name">Animal-supported</option>
                    //             </Input>
                    //           </div>
                    //         </div>
                    //       </FormGroup>
                    //     </Col>

                    //     <Col sm="6">
                    //       <FormGroup>
                    //         <Label htmlFor="default-0" className="form-label">
                    //           Sport Category
                    //         </Label>
                    //         <div className="form-control-wrap">
                    //           <input
                    //             className="form-control"
                    //             type="text"
                    //             id="default-0"
                    //             placeholder="Enter category of sport"
                    //           />
                    //         </div>
                    //       </FormGroup>
                    //     </Col>
                    //   </Row>
                    //   <hr className="preview-hr"></hr>
                    //   <Row className="g-3">
                    <MuseumFormTwo onSubmit={handleMuseumFormSubmission} />
                  )

                  //</Col>    </Row>
                  //</PreviewCard>  </form>
                  //</BlockTitle>
                }
                {
                  businessType === "Amusement Parks" && (
                    //<BlockTitle>
                    //  {businessType} Form
                    //  <form>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Amusement Park Name
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter Name of the Park"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Operational Hours
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Time of Operation"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //    &nbsp;&nbsp;
                    //    <OverlineTitle tag="span" className="preview-title-lg">
                    //      Enter Park Details
                    //    </OverlineTitle>
                    //    <Row className="gy-4">
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Park's Location
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter park's address"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Park's Landarea
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <input
                    //              className="form-control"
                    //              type="text"
                    //              id="default-0"
                    //              placeholder="Enter size of the park"
                    //            />
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-0" className="form-label">
                    //            Theme Park Type
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <div className="form-control-select">
                    //              <Input type="select" name="select" id="default-4">
                    //                <option value="default_option">General</option>
                    //                <option value="option_select_name">Water Theme Parks</option>
                    //                <option value="option_select_name">Zoological Theme Parks</option>
                    //                <option value="option_select_name">Historical Theme Parks</option>
                    //                <option value="option_select_name">Regional Theme Parks</option>
                    //                <option value="option_select_name">Pop Culture Theme Parks</option>
                    //                <option value="option_select_name">Eco theme parks</option>
                    //                <option value="option_select_name">Golf Courses</option>
                    //              </Input>
                    //            </div>
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //      <Col sm="6">
                    //        <FormGroup>
                    //          <Label htmlFor="default-4" className="form-label">
                    //            Rules & Precautions
                    //          </Label>
                    //          <div className="form-control-wrap">
                    //            <div className="custom-file">
                    //              <input
                    //                type="file"
                    //                multiple
                    //                className="custom-file-input form-control"
                    //                id="customFile"
                    //                onChange={(e) => setFile(e.target.files[0].name)}
                    //              />
                    //              <Label className="custom-file-label" htmlFor="customFile">
                    //                {file === "" ? "Choose file" : file}
                    //              </Label>
                    //            </div>
                    //          </div>
                    //        </FormGroup>
                    //      </Col>
                    //    </Row>
                    //    <hr className="preview-hr"></hr>
                    //    <Row className="g-3">
                    <MuseumFormTwo onSubmit={handleMuseumFormSubmission} />
                  )

                  //    </Row>
                  //  </form>
                  //</BlockTitle>
                }
                {
                  businessType === "Others" && (
                    //
                    //
                    //
                    //"></hr>
                    // className="preview-title-lg">
                    //
                    //
                    //
                    //
                    //
                    //ault-0" className="form-label">
                    //
                    //
                    //m-control-wrap">
                    //
                    //-control"
                    //
                    //
                    //ter name of venue"
                    //
                    //
                    //
                    //

                    //
                    //
                    //ault-0" className="form-label">
                    //
                    //
                    //m-control-wrap">
                    //
                    //-control"
                    //
                    //
                    //ter venue type"
                    //
                    //
                    //
                    //
                    //
                    //
                    //ault-4" className="form-label">
                    //
                    //
                    //m-control-wrap">
                    //ustom-file">
                    //
                    //
                    //
                    //stom-file-input form-control"
                    //e"
                    // => setFile(e.target.files[0].name)}
                    //
                    //e="custom-file-label" htmlFor="customFile">
                    //? "Choose file" : file}
                    //
                    //
                    //
                    //
                    //
                    //
                    //
                    //orm-label" htmlFor="ticket">
                    //Range
                    //
                    //m-control-wrap">
                    //orm-control-select">
                    //lect" name="select" id="default-4">
                    //="default_option">3 ft</option>
                    //="option_select_name">1 ft</option>
                    //="option_select_name">2 ft</option>
                    //="option_select_name">4 ft</option>
                    //="option_select_name">5 ft</option>
                    //="option_select_name">6 ft</option>
                    //="option_select_name">7 ft</option>
                    //="option_select_name">8 ft</option>
                    //="option_select_name">9 ft</option>
                    //="option_select_name">10 ft</option>
                    //
                    //
                    //
                    //
                    //
                    //
                    //"></hr>
                    //    <Row className="g-3">
                    <MuseumFormTwo onSubmit={handleMuseumFormSubmission} />
                  )

                  //    </Row>
                  //</PreviewCard>  </form>
                  // </BlockTitle>
                }
              </Col>
            </Row>
          </PreviewCard>
        </Block>
        <Modal isOpen={loading} backdrop={"static"}>
          <ModalHeader>Loading</ModalHeader>
          <ModalBody>
            <Spinner color="primary" />
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};

export default ClientSetup;
