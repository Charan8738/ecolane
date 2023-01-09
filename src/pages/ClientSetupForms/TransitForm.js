import React, { useState } from "react";
import { BlockTitle, Row, Col, OverlineTitle } from "../../components/Component";
import { FormGroup, Button, Label, Form } from "reactstrap";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

const TransitForm = ({ clientId, Rssvalue, BibobRssi, setError }) => {
  const INITIAL_DATA = {
    businessName: "",
    address: "",
    BibobRssi: BibobRssi,
    city: "",
    gtfsFileURL: "",
    vehiclePositionURL: "",
    tripUpdateURL: "",
    alertsURL: "",
    bikeShare: false,
    bikeShareName: "",
    bikeShareURL: "",
    rideShare: false,
    rideShareName: "",
    rideShareURL: "",
    microTransit: false,
    microTransitName: "",
    microTransitURL: "",
    paraTransit: false,
    paraTransitName: "",
    paraTransitURL: "",
  };
  const [transitData, setTransitData] = useState(INITIAL_DATA);
  const clientAddedSuccess = () => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Client has been added",
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
    setTransitData((prevState) => ({ ...prevState, [name]: value }));
  };
  const onSubmitHandler = () => {
    let data = {
      ...transitData,
      client_id: clientId,

      Rssvalue: Rssvalue,
      BibobRssi: BibobRssi,
    };
    axios
      .post("AddTransitdata", data)
      .then((res) => {
        if (res.status === 200) {
          setTransitData(INITIAL_DATA);
          clientAddedSuccess();
        } else throw new Error();
      })
      .catch((err) => {
        failure();
      })
      .finally(() => {
        setError(false);
      });
  };
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });

  const { errors, register, handleSubmit } = useForm();
  return (
    <BlockTitle>
      <Form className={formClass} onSubmit={handleSubmit(onSubmitHandler)}>
        <Row className="gy-4">
          <Col sm="6">
            <FormGroup>
              <label className="form-label" htmlFor="businessName">
                Business Name
              </label>
              <div className="form-control-wrap">
                <input
                  className="form-control"
                  name="businessName"
                  placeholder="Enter business name"
                  value={transitData.businessName}
                  onChange={onChangeHandler}
                  id="businessName"
                />
                {errors.businessName ? <span className="invalid">This field is required</span> : null}
              </div>
            </FormGroup>
          </Col>
          <Col sm="6">
            <FormGroup>
              <label className="form-label" htmlFor="address">
                Address
              </label>
              <div className="form-control-wrap">
                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={transitData.address}
                  onChange={onChangeHandler}
                  className="form-control"
                  id="address"
                />
                {errors.address ? <span className="invalid">This field is required</span> : null}
              </div>
            </FormGroup>
          </Col>

          <Col sm="6">
            <FormGroup>
              <Label htmlFor="default-0" className="form-label">
                City
              </Label>
              <div className="form-control-wrap">
                <input
                  ref={register({ required: true })}
                  className="form-control"
                  type="text"
                  id="city"
                  name="city"
                  value={transitData.city}
                  onChange={onChangeHandler}
                  placeholder="Enter city name"
                />
                {errors.city && <span className="invalid">This field is required</span>}
              </div>
            </FormGroup>
          </Col>

          <Col sm="6">
            <FormGroup>
              <Label htmlFor="default-0" className="form-label">
                GTFS File Upload
              </Label>
              <div className="form-control-wrap">
                <input
                  ref={register({ required: true })}
                  name="gtfsFileURL"
                  className="form-control"
                  type="text"
                  id="gtfsFileURL"
                  value={transitData.gtfsFileURL}
                  onChange={onChangeHandler}
                  placeholder="Enter GTFS File URL"
                />
                {errors.gtfsFileURL && <span className="invalid">This field is required</span>}
              </div>
            </FormGroup>
          </Col>
        </Row>
        &nbsp;&nbsp;
        <OverlineTitle tag="span" className="preview-title-lg">
          Enter Realtime Feed URL (.pb)
        </OverlineTitle>
        <Row className="gy-4">
          <Col sm="6">
            <FormGroup>
              <Label htmlFor="default-0" className="form-label">
                Vehicle Position
              </Label>
              <div className="form-control-wrap">
                <input
                  ref={register({ required: true })}
                  name="vehiclePositionURL"
                  className="form-control"
                  type="text"
                  id="vehiclePositionURL"
                  value={transitData.vehiclePositionURL}
                  onChange={onChangeHandler}
                  placeholder="Enter vehicle position"
                />
                {errors.vehiclePositionURL && <span className="invalid">This field is required</span>}
              </div>
            </FormGroup>
          </Col>

          <Col sm="6">
            <FormGroup>
              <Label htmlFor="default-0" className="form-label">
                Trip Update
              </Label>
              <div className="form-control-wrap">
                <input
                  ref={register({ required: true })}
                  className="form-control"
                  name="tripUpdateURL"
                  type="text"
                  id="tripUpdateURL"
                  value={transitData.tripUpdateURL}
                  onChange={onChangeHandler}
                  placeholder="Enter trip update"
                />
                {errors.tripUpdateURL && <span className="invalid">This field is required</span>}
              </div>
            </FormGroup>
          </Col>
          <Col sm="6">
            <FormGroup>
              <Label htmlFor="default-0" className="form-label">
                Alert
              </Label>
              <div className="form-control-wrap">
                <input
                  ref={register({ required: true })}
                  className="form-control"
                  type="text"
                  id="alertsURL"
                  name="alertsURL"
                  value={transitData.alertsURL}
                  onChange={onChangeHandler}
                  placeholder="Enter alert"
                />
                {errors.alertsURL && <span className="invalid">This field is required</span>}
              </div>
            </FormGroup>
          </Col>
          <hr className="preview-hr"></hr>
          {OPTIONS.map((item) => (
            <Col sm="12" key={item.title}>
              <FormGroup>
                <Label htmlFor="default-0" className="form-label">
                  {item.title}
                </Label>
                <Row>
                  <Col sm="4">
                    <FormGroup>
                      <div className="form-control-wrap">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input form-control"
                            id={item.value}
                            name={item.value}
                            checked={transitData[item.value]}
                            onChange={(event) => {
                              console.log(event);
                              setTransitData((prevState) => ({
                                ...prevState,
                                [item.value]: !prevState[item.value],
                                [item.name]: prevState[item.value] ? "" : prevState[item.name],
                                [item.url]: prevState[item.value] ? "" : prevState[item.url],
                              }));
                            }}
                            placeholder=""
                          />

                          <label className="custom-control-label" htmlFor={item.value}></label>
                        </div>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm="4">
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-md">
                          Name
                        </span>
                      </div>
                      <input
                        ref={register({ required: transitData[item.value] })}
                        type="text"
                        name={item.name}
                        value={transitData[item.name]}
                        onChange={(event) =>
                          setTransitData((prevState) => ({ ...prevState, [item.name]: event.target.value }))
                        }
                        className="form-control"
                      />
                      {errors[item.name] && <span className="invalid">This field is required</span>}
                    </div>
                  </Col>
                  <Col sm="4">
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-md">
                          URL
                        </span>
                      </div>
                      <input
                        ref={register({ required: transitData[item.value] })}
                        type="text"
                        className="form-control"
                        name={item.url}
                        value={transitData[item.url]}
                        onChange={(event) =>
                          setTransitData((prevState) => ({ ...prevState, [item.url]: event.target.value }))
                        }
                      />
                      {errors[item.name] && <span className="invalid">This field is required</span>}
                    </div>
                  </Col>
                </Row>
              </FormGroup>
            </Col>
          ))}
        </Row>
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
    </BlockTitle>
  );
};
const OPTIONS = [
  { title: "Bike Share", value: "bikeShare", name: "bikeShareName", url: "bikeShareURL" },
  { title: "Ride Share", value: "rideShare", name: "rideShareName", url: "rideShareURL" },
  { title: "Micro Transit", value: "microTransit", name: "microTransitName", url: "microTransitURL" },
  { title: "Para Transit", value: "paraTransit", name: "paraTransitName", url: "paraTransitURL" },
];

export default TransitForm;
