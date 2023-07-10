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
import MyDropDown from "../../../pages/MyDropDown";

import DatePicker from "react-datepicker";
import axios from "axios";
import { Form, FormGroup, Label, Input, Card, CardBody } from "reactstrap";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { RenderComponent, FormControlMap } from "../../form-components/FormComponents";
import { user_id } from "../../../redux/userSlice";
import { successAlert, failureAlert } from "../../../utils/Utils";

import { useSelector } from "react-redux";
const CreateScheduleModalFinal = ({ onSubmitHandler, ...props }) => {
  const { errors, register, handleSubmit, reset } = useForm();
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
  const [updatedDate, setUpdatedDate] = useState(new Date());
  const [formFields, setFormFields] = useState(INITIAL_ADD_FORM);
  const [formData, setFormData] = useState(props.isEdit ? props.formData : INITIAL_ADD_FORM);
  const [routeList, setRouteList] = useState([]);
  const [coachList, setCoachList] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [driverId, setDriverId] = useState();
  const coachL = [
    1013,
    1043,
    1049,
    1055,
    1056,
    1060,
    1070,
    1071,
    1072,
    1073,
    1074,
    1075,
    1076,
    1077,
    1078,
    "off",
    "Day Off",
  ];

  const LineL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [driverList, setDriverList] = useState([]);

  const userId = useSelector(user_id);
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });

  useEffect(() => {
    const getDriverList = async () => {
      const response = await axios.get("/getDriverList?venueRefId=" + userId);
      return response.data;
    };
    getDriverList().then((res) => {
      setDriverList([...res]);
    });
  }, []);
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
      const diffInMilliseconds = timeOut.getTime() - timeIn.getTime();
      const breakInMilliseconds = breakOut.getTime() - breakIn.getTime();

      const totalHours = diffInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
      const breakHours = breakInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours

      data[index].total_hours = (totalHours - breakHours).toFixed(2); // Round to 2 decimal places
    }
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

  const onChangeHandler = (data) => {
    console.log("Handler");
    console.log(data);
    setDriverId(data.value);
  };
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
        onSubmitHandler();
      } else {
        resetform();
        failureAlert("Please select a driver");
      }
    } catch (err) {
      console.log(err);
    }
  };
  // test comment
  return (
    <div>
      <Block>
        <h3>Create Schedule</h3>
        <MyDropDown onChangeHandle={onChangeHandler} driverlist={driverList} />
        <div style={{ textAlign: "right" }}>
          <h5>
            Total Hours: <span style={{ fontSize: "25px" }}>{totalHoursSum.toFixed(2)}</span>
          </h5>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <StyledTableHeader style={{ textAlign: "center", verticalAlign: "middle" }} scope="col">
                Day
              </StyledTableHeader>
              <StyledTableHeader style={{ textAlign: "center", verticalAlign: "middle" }} scope="col">
                Coach No
              </StyledTableHeader>
              <StyledTableHeader style={{ textAlign: "center", verticalAlign: "middle" }} scope="col">
                Line No
              </StyledTableHeader>

              <StyledTableHeader style={{ textAlign: "center", verticalAlign: "middle" }} scope="col">
                Time In
              </StyledTableHeader>
              <StyledTableHeader style={{ textAlign: "center", verticalAlign: "middle" }} scope="col">
                Break
              </StyledTableHeader>
              <StyledTableHeader style={{ textAlign: "center", verticalAlign: "middle" }} scope="col">
                Break
              </StyledTableHeader>
              <StyledTableHeader style={{ textAlign: "center", verticalAlign: "middle" }} scope="col">
                Time Out
              </StyledTableHeader>
              <StyledTableHeader style={{ textAlign: "center", verticalAlign: "middle" }} scope="col">
                Total Hours
              </StyledTableHeader>
            </tr>
          </thead>
          <tbody>
            {formData.length > 0
              ? formData.map((item, index) => {
                  const isOff = item.coach_no === "off" || item.coach_no === "Day Off";
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
                            disabled={isOff || item.time_in === ""}
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
                            disabled={isOff || item.break_in === ""}
                            minTime={item.break_in ? new Date(item.break_in) : undefined} // Set the minimum time based on time_in
                            maxTime={new Date(9999, 0, 1, 23, 59)} // Set a high value as the maximum time
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
                            disabled={isOff || item.break_out === ""}
                            minTime={item.break_out ? new Date(item.break_out) : undefined} // Set the minimum time based on time_in
                            maxTime={new Date(9999, 0, 1, 23, 59)} // Set a high value as the maximum time
                          />
                        </div>
                      </StyledTableData>
                      <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                        {item.total_hours}
                      </StyledTableData>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </Block>
      <Row className="g-4">
        <Col xl="12">
          <Button color="primary" size="lg" type="submit" onClick={() => onEditSubmit(formFields, driverId)}>
            Create Schedule
          </Button>
        </Col>
      </Row>
    </div>
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
export default CreateScheduleModalFinal;
