import React, { useEffect, useState } from "react";
import MyDropdown from "./MyDropDown";
import { Link, useHistory } from "react-router-dom";

import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  BlockBetween,
  PaginationComponent,
  Col,
  ReactDataTable,
  Button,
  Row,
} from "../components/Component";
import axios from "axios";

import styled from "styled-components";
import DatePicker from "react-datepicker";

import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import { useSelector } from "react-redux";
import { user_id } from "../redux/userSlice";
import { Form, FormGroup, Label, Input, Card, CardBody } from "reactstrap";
import { successAlert, failureAlert } from "../utils/Utils";

const CreateSchedule = () => {
  const history = useHistory();
  const INITIAL_ADD_FORM = [
    {
      day: "Monday",
      coach_no: "",
      line_no: "",
      time_in: "",
      time_out: "",
      break_in: "",
      break_out: "",
      total_hours: "",
    },
    {
      day: "Tuesday",
      coach_no: "",
      line_no: "",
      time_in: "",
      time_out: "",
      break_in: "",
      break_out: "",
      total_hours: "",
    },
    {
      day: "Wednesday",
      coach_no: "",
      line_no: "",
      time_in: "",
      time_out: "",
      break_in: "",
      break_out: "",
      total_hours: "",
    },
    {
      day: "Thursday",
      coach_no: "",
      line_no: "",
      time_in: "",
      time_out: "",
      break_in: "",
      break_out: "",
      total_hours: "",
    },
    {
      day: "Friday",
      coach_no: "",
      line_no: "",
      time_in: "",
      time_out: "",
      break_in: "",
      break_out: "",
      total_hours: "",
    },
    {
      day: "Saturday",
      coach_no: "",
      line_no: "",
      time_in: "",
      time_out: "",
      break_in: "",
      break_out: "",
      total_hours: "",
    },
    {
      day: "Sunday",
      coach_no: "",
      line_no: "",
      time_in: "",
      time_out: "",
      break_in: "",
      break_out: "",
      total_hours: "",
    },
  ];

  const redirectToRunCuttingPage = () => {
    history.push("/run-cutting-scheduler");
  };
  const [driverId, setDriverId] = useState();
  const [driverList, setDriverList] = useState([]);
  const [formFields, setFormFields] = useState(INITIAL_ADD_FORM);

  const [formData, setFormData] = useState(INITIAL_ADD_FORM);
  const [fieldCounts, setFieldCounts] = useState({});
  const mondayCount = formFields.reduce((count, item) => {
    if (item.day === "Monday") {
      return count + 1;
    }
    return count;
  }, 0);
  const tuesdayCount = formFields.reduce((count, item) => {
    if (item.day === "Tuesday") {
      return count + 1;
    }
    return count;
  }, 0);
  const wednesdayCount = formFields.reduce((count, item) => {
    if (item.day === "Wednesday") {
      return count + 1;
    }
    return count;
  }, 0);
  const thursdayCount = formFields.reduce((count, item) => {
    if (item.day === "Thursday") {
      return count + 1;
    }
    return count;
  }, 0);
  const fridayCount = formFields.reduce((count, item) => {
    if (item.day === "Friday") {
      return count + 1;
    }
    return count;
  }, 0);
  const saturdayCount = formFields.reduce((count, item) => {
    if (item.day === "Saturday") {
      return count + 1;
    }
    return count;
  }, 0);
  const sundayCount = formFields.reduce((count, item) => {
    if (item.day === "Sunday") {
      return count + 1;
    }
    return count;
  }, 0);
  const coachL = ["Select", 1055, 1056, 1060, 1070, 1071, 1073, 1074, 1076, 1077, 1078, "off", "Day Off", "TBD"];

  const addFields = (day, index) => {
    let newField = {
      day: day,
      coach_no: "",
      line_no: "",
      time_in: "",
      time_out: "",
      break_in: "",
      break_out: "",
      total_hours: "",
    };
    console.log(newField);

    // Splice the new field at the desired index
    const updatedFields = [...formFields];
    updatedFields.splice(index + 1, 0, newField);

    setFormFields(updatedFields);
  };

  const removeFields = (index) => {
    console.log(index);
    console.log("Inside remove fields");
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };
  const LineL = ["Select", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "1 & 4", "9 & 10"];
  const userId = useSelector(user_id);
  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;

    const timeIn = data[index].time_in;
    const timeOut = data[index].time_out;
    const breakIn = data[index].break_in;
    const breakOut = data[index].break_out;

    // Compare and update the times
    if (timeIn && timeOut && timeOut < timeIn) {
      data[index].time_out = timeIn; // Set time_out to be greater than time_in
    }

    if (timeIn && breakIn && breakIn < timeIn) {
      data[index].break_in = timeIn; // Set break_in to be greater than time_in
    }

    if (timeIn && breakOut && breakOut < timeIn) {
      data[index].break_out = timeIn; // Set break_out to be greater than time_in
    }

    if (breakIn && breakOut && breakOut < breakIn) {
      data[index].break_out = breakIn; // Set break_out to be greater than break_in
    }

    if (breakOut && timeOut && timeOut < breakOut) {
      data[index].time_out = breakOut; // Set time_out to be greater than break_out
    }

    // Calculate total hours
    if (timeIn && timeOut) {
      if (breakIn && breakOut) {
        const diffInMilliseconds = timeOut.getTime() - timeIn.getTime();
        const breakInMilliseconds = breakOut.getTime() - breakIn.getTime();
        const totalHours = diffInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
        const breakHours = breakInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours

        data[index].total_hours = (totalHours - breakHours).toFixed(2); // Round to 2 decimal places
      } else {
        const diffInMilliseconds = timeOut.getTime() - timeIn.getTime();
        const totalHours = diffInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours

        data[index].total_hours = totalHours.toFixed(2); // Round to 2 decimal places
      }
    }
    console.log(data);
    setFormFields(data);
  };

  const onChangeHandler = (data) => {
    console.log("Handler");
    console.log(data);
    setDriverId(data.value);
  };

  useEffect(() => {
    const getDriverList = async () => {
      const response = await axios.get("/getDriverList?venueRefId=" + userId);
      return response.data;
    };
    getDriverList().then((res) => {
      setDriverList([...res]);
    });
  }, []);
  const calculateTotalHoursForRow = (item) => {
    const timeIn = item.time_in;
    const timeOut = item.time_out;
    const breakIn = item.break_in;
    const breakOut = item.break_out;

    if (timeIn && timeOut && breakIn && breakOut) {
      const diffInMilliseconds = timeOut.getTime() - timeIn.getTime();
      const breakInMilliseconds = breakOut.getTime() - breakIn.getTime();

      const totalHours = diffInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
      const breakHours = breakInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours

      return (totalHours - breakHours).toFixed(2); // Round to 2 decimal places
    }

    return "";
  };

  const totalHoursSum = formData.reduce((acc, item) => {
    const totalHoursForRow = calculateTotalHoursForRow(item);
    if (totalHoursForRow !== "") {
      acc += parseFloat(totalHoursForRow);
    }
    return acc;
  }, 0);

  const resetform = () => {
    console.log("inside reset");
    setFormData([...INITIAL_ADD_FORM]);
    setFormFields(INITIAL_ADD_FORM);
  };
  const onEditSubmit = async (data, driverId) => {
    try {
      console.log(data);
      let js = { driver_id: driverId, schedules: data };
      console.log(data.length);
      console.log(js);
      const res = await axios.post("addschedule", js);
      if (res.status === 201) {
        // const newTrackers = [...trackers];
        // newTrackers.push(js);
        // console.log(newTrackers);
        // setTrackers(newTrackers);
        // setCreatedSchedule(true);
        // setView({
        //   edit: false,
        //   add: false,
        //   diagnose: false,
        // });
        resetform();
        successAlert("Schedule created successfully");
        redirectToRunCuttingPage();
        // onSubmitHandler();
      } else {
        resetform();
        failureAlert("Please select a driver");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <Head title="Create Schedule"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle className="text-primary" page tag="h3">
                Create Schedule
              </BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <div className="toggle-expand-content">
                  <ul className="nk-block-tools g-3">
                    <li className="nk-block-tools-opt">
                      <BlockHeadContent>
                        <Link to={`${process.env.PUBLIC_URL}/run-cutting-scheduler`}>
                          <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                            <Icon name="arrow-left"></Icon>
                            <span>Back</span>
                          </Button>
                          <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                            <Icon name="arrow-left"></Icon>
                          </Button>
                        </Link>
                      </BlockHeadContent>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Card>
          <CardBody>
            <Block>
              {/* <h3>Create Schedule </h3> */}
              <MyDropdown onChangeHandle={onChangeHandler} driverlist={driverList} />
              {/* <MyDropDown onChangeHandle={onChangeHandler} driverlist={driverList} /> */}
              <div className="m-2" style={{ textAlign: "right" }}>
                <h5>
                  Total Hours: <span style={{ fontSize: "25px" }}>{totalHoursSum.toFixed(2)}</span>
                </h5>
              </div>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <StyledTableHeader
                      className=" table-dark"
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      scope="col"
                    >
                      Day
                    </StyledTableHeader>
                    <StyledTableHeader
                      className=" table-dark"
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      scope="col"
                    >
                      Coach No
                    </StyledTableHeader>
                    <StyledTableHeader
                      className=" table-dark"
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      scope="col"
                    >
                      Line No
                    </StyledTableHeader>

                    <StyledTableHeader
                      className=" table-dark"
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      scope="col"
                    >
                      Time In
                    </StyledTableHeader>
                    <StyledTableHeader
                      className=" table-dark"
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      scope="col"
                    >
                      Break
                    </StyledTableHeader>
                    <StyledTableHeader
                      className=" table-dark"
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      scope="col"
                    >
                      Break
                    </StyledTableHeader>
                    <StyledTableHeader
                      className=" table-dark"
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      scope="col"
                    >
                      Time Out
                    </StyledTableHeader>
                    <StyledTableHeader
                      className=" table-dark"
                      cla
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      scope="col"
                    >
                      Total Hours
                    </StyledTableHeader>
                  </tr>
                </thead>
                <tbody>
                  {formFields.length > 0
                    ? formFields.map((item, index) => {
                        const isOff = item.coach_no === "off" || item.coach_no === "Day Off";
                        const count = fieldCounts[item.day] || 0;
                        const shouldDisplayRemoveButton = index !== 0 && count > 1;
                        return (
                          <tr key={index}>
                            <th style={{ textAlign: "center", verticalAlign: "middle" }} scope="row">
                              {item.day}
                            </th>
                            <StyledTableData
                              style={{ width: "100px", textAlign: "center", verticalAlign: "middle" }}
                              scope="col"
                            >
                              <div className="form-control-select">
                                <Input
                                  type="select"
                                  name="coach_no"
                                  id="coach_no"
                                  value={item.coach_no}
                                  onChange={(event) => {
                                    handleFormChange(event, index);
                                  }}
                                  // disabled={isOff}
                                >
                                  {coachL.map((item) => (
                                    <option key={item}>{item}</option>
                                  ))}
                                </Input>
                              </div>
                            </StyledTableData>
                            <StyledTableData style={{ width: "100px", textAlign: "center", verticalAlign: "middle" }}>
                              <div className="form-control-select">
                                <Input
                                  type="select"
                                  name="line_no"
                                  id="line_no"
                                  value={item.line_no}
                                  onChange={(event) => {
                                    handleFormChange(event, index);
                                  }}
                                  disabled={isOff}
                                >
                                  {LineL.map((item) => (
                                    <option key={item}>{item}</option>
                                  ))}
                                </Input>
                              </div>
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <div className="form-control-select">
                                <DatePicker
                                  selected={item.time_in}
                                  onChange={(date) => {
                                    handleFormChange({ target: { name: "time_in", value: date } }, index);
                                  }}
                                  name="time_in"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  value={item.start_time}
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="h:mm aa"
                                  className="form-control date-picker"
                                  autoComplete="off"
                                  disabled={isOff}
                                />
                              </div>
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <div className="form-control-select">
                                <DatePicker
                                  selected={item.break_in}
                                  onChange={(date) => {
                                    handleFormChange({ target: { name: "break_in", value: date } }, index);
                                  }}
                                  name="break_in"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  value={item.break_in}
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="h:mm aa"
                                  className="form-control date-picker"
                                  autoComplete="off"
                                  // disabled={isOff || item.time_in === ""}
                                  minTime={item.time_in ? new Date(item.time_in) : undefined} // Set the minimum time based on start_time
                                  maxTime={new Date(9999, 0, 1, 23, 59)}
                                />
                              </div>
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              {" "}
                              <div className="form-control-select">
                                <DatePicker
                                  selected={item.break_out}
                                  onChange={(date) => {
                                    handleFormChange({ target: { name: "break_out", value: date } }, index);
                                  }}
                                  name="break_out"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  value={item.break_out}
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="h:mm aa"
                                  className="form-control date-picker"
                                  autoComplete="off"
                                  // disabled={isOff || item.break_in === ""}
                                  minTime={item.break_in ? new Date(item.break_in) : undefined} // Set the minimum time based on time_in
                                  maxTime={item.break_in ? new Date(9999, 0, 1, 23, 59) : undefined} // Set a high value as the maximum time
                                />
                              </div>
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <div className="form-control-select">
                                <DatePicker
                                  selected={item.time_out}
                                  onChange={(date) => {
                                    handleFormChange({ target: { name: "time_out", value: date } }, index);
                                  }}
                                  name="time_out"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  value={item.time_out}
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="h:mm aa"
                                  className="form-control date-picker"
                                  autoComplete="off"
                                  disabled={isOff || item.time_in === ""}
                                  minTime={item.break_out ? new Date(item.break_out) : new Date(item.time_in)} // Set the minimum time based on time_in
                                  maxTime={new Date(9999, 0, 1, 23, 59)} // Set a high value as the maximum time
                                />
                              </div>
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              {item.total_hours}
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <Row>
                                <Col className="m-2" sm="3">
                                  <Button
                                    onClick={() => addFields(item.day, index)}
                                    className="btn-square btn-icon"
                                    color="primary"
                                    size="sm"
                                  >
                                    <Icon name="plus" />
                                  </Button>
                                </Col>
                                {item.day === "Monday" && mondayCount > 1 ? (
                                  <Col className="m-2" sm="3">
                                    <Button
                                      onClick={() => removeFields(index)}
                                      className="btn-square btn-icon"
                                      color="danger"
                                      size="sm"
                                    >
                                      <Icon name="minus" />
                                    </Button>
                                  </Col>
                                ) : item.day === "Tuesday" && tuesdayCount > 1 ? (
                                  <Col className="m-2" sm="3">
                                    <Button
                                      onClick={() => removeFields(index)}
                                      className="btn-square btn-icon"
                                      color="danger"
                                      size="sm"
                                    >
                                      <Icon name="minus" />
                                    </Button>
                                  </Col>
                                ) : item.day === "Wednesday" && wednesdayCount > 1 ? (
                                  <Col className="m-2" sm="3">
                                    <Button
                                      onClick={() => removeFields(index)}
                                      className="btn-square btn-icon"
                                      color="danger"
                                      size="sm"
                                    >
                                      <Icon name="minus" />
                                    </Button>
                                  </Col>
                                ) : item.day === "Thursday" && thursdayCount > 1 ? (
                                  <Col className="m-2" sm="3">
                                    <Button
                                      onClick={() => removeFields(index)}
                                      className="btn-square btn-icon"
                                      color="danger"
                                      size="sm"
                                    >
                                      <Icon name="minus" />
                                    </Button>
                                  </Col>
                                ) : item.day === "Friday" && fridayCount > 1 ? (
                                  <Col className="m-2" sm="3">
                                    <Button
                                      onClick={() => removeFields(index)}
                                      className="btn-square btn-icon"
                                      color="danger"
                                      size="sm"
                                    >
                                      <Icon name="minus" />
                                    </Button>
                                  </Col>
                                ) : item.day === "Saturday" && saturdayCount > 1 ? (
                                  <Col className="m-2" sm="3">
                                    <Button
                                      onClick={() => removeFields(index)}
                                      className="btn-square btn-icon"
                                      color="danger"
                                      size="sm"
                                    >
                                      <Icon name="minus" />
                                    </Button>
                                  </Col>
                                ) : item.day === "Sunday" && sundayCount > 1 ? (
                                  <Col className="m-2" sm="3">
                                    <Button
                                      onClick={() => removeFields(index)}
                                      className="btn-square btn-icon"
                                      color="danger"
                                      size="sm"
                                    >
                                      <Icon name="minus" />
                                    </Button>
                                  </Col>
                                ) : null}
                              </Row>
                            </StyledTableData>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </Block>
            <div className="m-2">
              <Row className="g-4">
                <Col xl="12">
                  <Button color="primary" size="lg" type="submit" onClick={() => onEditSubmit(formFields, driverId)}>
                    Create Schedule
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Content>
    </React.Fragment>
  );
};
const StyledTableHeader = styled.th`
  text-align: center;
  vertical-align: middle;
`;
const StyledTableData = styled.td`
  text-align: center;
  vertical-align: middle;
`;
export default CreateSchedule;
