import React, { useEffect, useState } from "react";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockHeadContent,
  Row,
  Col,
  Button,
  PreviewCard,
  Icon,
} from "../../../components/Component";
import DatePicker from "react-datepicker";
import axios from "axios";
import { Form, FormGroup, Label, Input } from "reactstrap";
import classNames from "classnames";
import { useForm } from "react-hook-form";

import { RenderComponent, FormControlMap } from "../../form-components/FormComponents";
const CreateScheduleModal = ({ onSubmitHandler, ...props }) => {
  const { errors, register, handleSubmit } = useForm();
  const INITIAL_ADD_FORM = [
    {
      coach_no: "",
      route_no: "1",
      driver_name: "",
    },
  ];
  const [updatedDate, setUpdatedDate] = useState(new Date());
  const [formFields, setFormFields] = useState(INITIAL_ADD_FORM);
  const [formData, setFormData] = useState(props.isEdit ? props.formData : INITIAL_ADD_FORM);
  const [routeList, setRouteList] = useState([]);
  const [coachList, setCoachList] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const coachL = [1013, 1043, 1049, 1055, 1056, 1060, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078];
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  /* Fetching Route details*/
  useEffect(() => {
    axios
      .get("lima/GetStandardBusLines")
      .then((res) => {
        const sortedRouteList = [...res.data].sort((a, b) => parseInt(a.RouteName) - parseInt(b.RouteName));
        setRouteList(sortedRouteList);
      })
      .catch((err) => {
        console.log("Error in fetching Bus mapping");
      })
      .finally(() => {
        // console.log("zig");
      });
  }, []);
  /* Fetching coach details*/
  useEffect(() => {
    axios
      .get("getCoachlist")
      .then((res) => {
        const sortedCoachList = [...res.data].sort((a, b) => a.Coachno - b.Coachno);
        setCoachList(sortedCoachList);
      })
      .catch((err) => {
        console.log("Error in fetching Bus mapping");
      })
      .finally(() => {
        // console.log("zig");
      });
  }, []);
  const handleFormChange = (event, index) => {
    console.log(index, event.target.name);
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    console.log(data);
    setFormFields(data);
  };

  const addFields = (event) => {
    let newField = { coach_no: "", route_no: "", driver_name: "", start_time: "" };
    setFormFields([...formFields, newField]);
  };
  const removeFields = (index) => {
    console.log(index);
    console.log("Inside remove fields");
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };
  //   const onInputChange = (e) => {
  //     console.log(e.target.name);
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  //   };
  const onFormSubmit = () => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div>
      <Block>
        {/* <PreviewCard> */}
        <BlockHead>
          <BlockHeadContent>
            <BlockTitle tag="h5">{props.isEdit ? "Edit" : "Create"} Schedule</BlockTitle>
          </BlockHeadContent>
        </BlockHead>
        <Form onSubmit={handleSubmit(() => onSubmitHandler(formFields, updatedDate))}>
          <Row className="g-4">
            <Col lg="6">
              <FormGroup>
                <label className="form-label">Scheduled Date</label>
                <div className="form-control-wrap">
                  <DatePicker selected={updatedDate} onChange={setUpdatedDate} className="form-control date-picker" />{" "}
                </div>
              </FormGroup>
            </Col>
          </Row>
          {/* form starts */}
          {formFields.map((form, index) => {
            return (
              <div key={index}>
                <Row className="g-4">
                  <Col lg="2">
                    <FormGroup className="form-group">
                      <label className="form-label" htmlFor="full-name-1">
                        Coach Number
                      </label>
                      <div className="form-control-select">
                        <Input
                          type="select"
                          name="coach_no"
                          id="coach_no"
                          value={form.coach_no}
                          onChange={(event) => {
                            handleFormChange(event, index);
                          }}
                        >
                          {coachL.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg="2">
                    <FormGroup className="form-group">
                      <label className="form-label" htmlFor="full-name-1">
                        Route Number
                      </label>
                      <div className="form-control-select">
                        <Input
                          type="select"
                          name="route_no"
                          id="route_no"
                          value={form.route_no}
                          onChange={(event) => {
                            handleFormChange(event, index);
                          }}
                        >
                          {routeList.map((item) => (
                            <option key={item?.Id}>{item?.RouteName}</option>
                          ))}
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg="2">
                    <FormGroup className="form-group">
                      <label className="form-label" htmlFor="full-name-1">
                        Driver Name
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          id="full-name-1"
                          className="form-control"
                          name="driver_name"
                          value={form.driver_name}
                          onChange={(event) => {
                            handleFormChange(event, index);
                          }}
                          ref={register({
                            required: true,
                          })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg="2">
                    <FormGroup className="form-group">
                      <label className="form-label" htmlFor="full-name-1">
                        Start Time
                      </label>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={form.start_time}
                          onChange={(date) => {
                            handleFormChange({ target: { name: "start_time", value: date } }, index);
                          }}
                          name="start_time"
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          className="form-control date-picker"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg="2">
                    <FormGroup className="form-group">
                      <label className="form-label" htmlFor="full-name-1">
                        End Time
                      </label>
                      <div className="form-control-wrap">
                        <DatePicker
                          selected={form.end_time}
                          onChange={(date) => {
                            handleFormChange({ target: { name: "end_time", value: date } }, index);
                          }}
                          name="end_time"
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          className="form-control date-picker"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg="0">
                    <label className="form-label" htmlFor="full-name-1">
                      {/* Driver Name */}
                    </label>
                    <div style={{ marginTop: "10px" }} className="form-control-wrap ">
                      <FormGroup className="form-group">
                        <Button onClick={() => addFields()} className="btn-square btn-icon" color="primary" size="sm">
                          <Icon name="plus" />
                        </Button>
                      </FormGroup>
                    </div>
                  </Col>
                  {index >= 1 ? (
                    <Col lg="0">
                      <label className="form-label" htmlFor="full-name-1">
                        {/* Driver Name */}
                      </label>
                      <div style={{ marginTop: "10px" }} className="form-control-wrap ">
                        <FormGroup className="form-group">
                          <Button
                            onClick={() => removeFields(index)}
                            className="btn-square btn-icon"
                            color="primary"
                            size="sm"
                          >
                            <Icon name="minus" />
                          </Button>
                        </FormGroup>
                      </div>
                    </Col>
                  ) : (
                    <span></span>
                  )}
                </Row>
              </div>
            );
          })}
          <Row className="g-4">
            <Col xl="12">
              <Button color="primary" size="lg" type="submit">
                Create Schedule
              </Button>
            </Col>
          </Row>
        </Form>
        {/* <Row className="g-4">
            <Col lg="6">
              <FormGroup>
                <label className="form-label"> Scheduled Date</label>
                <div className="form-control-wrap">
                  <DatePicker selected={updatedDate} onChange={setUpdatedDate} className="form-control date-picker" />{" "}
                </div>
              </FormGroup>

              <FormGroup className="form-group">
                <label className="form-label" htmlFor="full-name-1">
                  Coach Number
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="full-name-1"
                    className="form-control"
                    name="coach_no"
                    onChange={(e) => onInputChange(e)}
                    ref={register({
                      required: true,
                    })}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup className="form-group">
                <label className="form-label" htmlFor="email-address-1">
                  Route Number
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="email-address-1"
                    name="route_no"
                    className="form-control"
                    onChange={(e) => onInputChange(e)}
                    ref={register({
                      required: true,
                    })}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup className="form-group">
                <label className="form-label" htmlFor="phone-no-1">
                  Driver name
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    name="driver_name"
                    id="phone-no-1"
                    className="form-control"
                    required
                    onChange={(e) => onInputChange(e)}
                    ref={register({
                      required: true,
                    })}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup className="form-group">
                <label className="form-label" htmlFor="pay-amount-1">
                  Schedule date
                </label>
                <div className="form-control-wrap">
                  <input
                    type="textsd"
                    id="pay-amount-1"
                    name="scheduled_date"
                    className="form-control"
                    onChange={(e) => onInputChange(e)}
                    ref={register({
                      required: true,
                    })}
                  />
                </div>
              </FormGroup>
            </Col>

            <Col xl="12">
              <Button color="primary" size="lg" type="submit">
                Create Schedule
              </Button>
            </Col>
          </Row> */}
        {/* </PreviewCard> */}
      </Block>
    </div>
  );
};

export default CreateScheduleModal;
