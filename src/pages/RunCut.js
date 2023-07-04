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
import { Link } from "react-router-dom";

import { useLocation, Redirect } from "react-router-dom";
import Content from "../layout/content/Content";
import Moment from "react-moment";
import axios from "axios";

import Head from "../layout/head/Head";
import Select from "react-select";
import MyDropDown from "./MyDropDown";
import WeeklyDatePicker from "./WeeklyDatePicker";
const RunCut = () => {
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
  const [isLoading, setLoading] = useState(false);

  const driverId = location.state?.id;

  useEffect(() => {
    const getSchedules = async () => {
      const response = await axios.get("getSchedule?driver_id=" + driverId);
      return response.data;
    };
    setLoading(true);
    getSchedules()
      .then((res) => {
        setData([...res]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
                    <li></li>
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
                          <tr>
                            <th style={{ textAlign: "center", verticalAlign: "middle" }} scope="row">
                              {item.day}
                            </th>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              {item.coach_no}
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              {item.line_no}
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <Moment format="hh:mm a">{item.time_in}</Moment>
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <Moment format="hh:mm a">{item.time_out}</Moment>
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <Moment format="hh:mm a">{item.break_in}</Moment>
                            </StyledTableData>
                            <StyledTableData style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <Moment format="hh:mm a">{item.break_out}</Moment>
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
            </CardBody>
          </Card>
        </Block>
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

export default RunCut;
