import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Input,
  FormGroup,
  Label,
  Spinner,
  CardLink,
  CardText,
  CardSubtitle,
  Modal,
  ModalBody,
} from "reactstrap";
import { successAlert, failureAlert } from "../utils/Utils";
import styled from "styled-components";

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
import { Link, useHistory } from "react-router-dom";

import { useLocation, Redirect } from "react-router-dom";
import Content from "../layout/content/Content";
import Moment from "react-moment";
import axios from "axios";

import Head from "../layout/head/Head";
import Select from "react-select";
import MyDropDown from "./MyDropDown";
import WeeklyDatePicker from "./WeeklyDatePicker";
import EditScheduleModal from "./components/EditScheduleModal/EditScheduleModal";
import EditScheduleModalFinal from "./components/EditScheduleModalFinal/EditScheduleModalFinal";
import Swal from "sweetalert2";

const MasterRunCut = () => {
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
  };
  const [sm, updateSm] = useState(false);
  const location = useLocation();
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();

  const [view, setView] = useState({
    edit: false,
    add: false,
    diagnose: false,
  });
  const [clients, setClients] = useState([]);
  const driverId = location.state?.id;
  const dname = location.state?.dname;
  const mid = location.state?.mid;
  console.log(dname);
  const imei = location.state?.Macaddress;
  const handleWarning = () => {
    Swal.fire({
      title: "No Schedule Found for this driver",
      text: "Would you like to create a new schedule?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Create Schedule",
    }).then((result) => {
      if (result.isConfirmed) {
        redirectToCreateSchedule();
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        redirectMasterDrivers();
      }
    });
  };
  const redirectToRunCuttingPage = () => {
    console.log(data);
    history.push("/edit-schedule", { data: data, driverId: driverId });
  };
  const redirectToCreateSchedule = () => {
    console.log(data);
    history.push("/create-ms-schedule", { data: data, driverId: driverId, dname: dname, mid: mid });
  };
  const redirectMasterDrivers = () => {
    console.log(data);
    history.push("/master-driver", { data: data, driverId: driverId, dname: dname, mid: mid });
  };
  useEffect(() => {
    const getSchedules = async () => {
      const response = await axios.get("getMasterDriverSchedule?driver_id=" + driverId + "&m_id=" + mid);
      return response.data;
    };
    setLoading(true);
    getSchedules()
      .then((res) => {
        if (res.message === "No data found") {
          handleWarning();
        } else {
          setData([...res]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    const getSchedules = async () => {
      const response = await axios.get("getMasterDriverSchedule?driver_id=" + driverId + "&m_id=" + mid);
      return response.data;
    };
    setLoading(true);
    getSchedules()
      .then((res) => {
        if (res.message === "No data found") {
          handleWarning();
        } else {
          setData([...res]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [updateData]);
  const onFormCancel = () => {
    setView({ edit: false, add: false, diagnose: false });
  };
  const onEditSubmit = (data) => {
    let newData = { driver_id: driverId, schedules: data };
    console.log(newData);

    axios
      .put("addschedule", newData)
      .then((res) => {
        if (res.status === 200) {
          setUpdateData(true);
          setView({
            edit: false,
            add: false,
            diagnose: false,
          });
          successAlert("Schedule edited successfully");
        } else {
          failureAlert("Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <React.Fragment>
      <Head title="Run Cutting"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle className="text-primary" page tag="h3">
                Driver Schedule
              </BlockTitle>
            </BlockHeadContent>

            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <div className="toggle-expand-content">
                  <ul className="nk-block-tools g-3">
                    <li>
                      {" "}
                      {/* <Button
                        color="primary"
                        className="mr-4"
                        onClick={() =>
                          setView({
                            edit: false,
                            add: true,
                            diagnose: false,
                          })
                        }
                      > */}
                      <Button color="primary" className="mr-4" onClick={() => redirectToRunCuttingPage()}>
                        <Icon name="edit" className="mr-0.5"></Icon>
                        <span>Edit Schedule</span>
                      </Button>
                    </li>
                    <li className="nk-block-tools-opt">
                      <BlockHeadContent>
                        {/* <Link to={`${process.env.PUBLIC_URL}/master-driver`}> */}
                        <Button
                          onClick={redirectMasterDrivers}
                          color="light"
                          outline
                          className="bg-white d-none d-sm-inline-flex"
                        >
                          <Icon name="arrow-left"></Icon>
                          <span>Back</span>
                        </Button>
                        {/* <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                          <Icon name="arrow-left"></Icon>
                        </Button> */}
                        {/* </Link> */}
                      </BlockHeadContent>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card>
            <CardBody className="card-inner">
              {/* <MyDropDown /> */}
              <br></br>
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

                    <StyledTableHeader scope="col">Time In</StyledTableHeader>
                    <StyledTableHeader scope="col">Break</StyledTableHeader>
                    <StyledTableHeader scope="col">Break</StyledTableHeader>
                    <StyledTableHeader scope="col">Time Out</StyledTableHeader>
                    <StyledTableHeader scope="col">Total Hours</StyledTableHeader>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0
                    ? data.map((item) => {
                        return (
                          <React.Fragment>
                            <tr>
                              <th style={{ textAlign: "center", verticalAlign: "middle" }} scope="row">
                                {item.day}
                              </th>
                              <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                                {item.coach_no === "off" ? "Off" : item.coach_no}
                              </StyledTableData>
                              <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                                {item.line_no === "" ? "Off" : item.line_no}
                              </StyledTableData>
                              <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                                {item.time_in === "" ? "Off" : <Moment format="hh:mm a">{item.time_in}</Moment>}
                              </StyledTableData>
                              <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                                {item.break_in === "" ? "Off" : <Moment format="hh:mm a">{item.break_in}</Moment>}
                              </StyledTableData>
                              <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                                {item.break_out === "" ? "Off" : <Moment format="hh:mm a">{item.break_out}</Moment>}
                              </StyledTableData>
                              <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                                {item.time_out === "" ? "Off" : <Moment format="hh:mm a">{item.time_out}</Moment>}
                              </StyledTableData>
                              <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                                {item.total_hours}
                              </StyledTableData>
                            </tr>
                            <tr style={item.comments ? { color: "red", fontWeight: 800 } : {}}>
                              <td colSpan="8">{item.comments ? item.comments : "No Comments"}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Block>
      </Content>
      <Modal isOpen={view.add} toggle={() => onFormCancel()} className="modal-dialog-centered" size="xl">
        <ModalBody>
          <a href="#cancel" className="close">
            {" "}
            <Icon
              name="cross-sm"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
            ></Icon>
          </a>
          <div className="p-2">
            <EditScheduleModalFinal onSubmitHandler={onEditSubmit} isEdit={true} formData={data} clients={clients} />
          </div>
        </ModalBody>
      </Modal>
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

const TestData = [
  {
    day: "Sunday",
    coach_no: "1077",
    line_no: "7",
    time_in: "10:30 am",
    time_out: "10:30 pm",
    break_in: "01:00 am",
    break_out: "02:00 am",
    total_hours: "10 hours",
  },
  {
    day: "Monday",
    coach_no: "1077",
    line_no: "7",
    time_in: "10:30 am",
    time_out: "10:30 pm",
    break_in: "01:00 am",
    break_out: "02:00 am",
    total_hours: "10 hours",
  },
  {
    day: "Tuesday",
    coach_no: "1077",
    line_no: "7",
    time_in: "10:30 am",
    time_out: "10:30 pm",
    break_in: "01:00 am",
    break_out: "02:00 am",
    total_hours: "10 hours",
  },
  {
    day: "Wednesday",
    coach_no: "1077",
    line_no: "7",
    time_in: "10:30 am",
    time_out: "10:30 pm",
    break_in: "01:00 am",
    break_out: "02:00 am",
    total_hours: "10 hours",
  },
  {
    day: "Thursday",
    coach_no: "1077",
    line_no: "7",
    time_in: "10:30 am",
    time_out: "10:30 pm",
    break_in: "01:00 am",
    break_out: "02:00 am",
    total_hours: "10 hours",
  },
  {
    day: "Friday",
    coach_no: "1077",
    line_no: "7",
    time_in: "10:30 am",
    time_out: "10:30 pm",
    break_in: "01:00 am",
    break_out: "02:00 am",
    total_hours: "10 hours",
  },
  {
    day: "Saturday",
    coach_no: "1077",
    line_no: "7",
    time_in: "10:30 am",
    time_out: "10:30 pm",
    break_in: "01:00 am",
    break_out: "02:00 am",
    total_hours: "10 hours",
  },
];

export default MasterRunCut;
