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
import styled from "styled-components";
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

  return (
    <React.Fragment>
      <Head title="Run Cutting"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle className="text-primary" page tag="h3">
                {/* Schedule for <Moment format="MMMM Do YYYY">{scheduleDate}</Moment> */}
              </BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <div className="toggle-expand-content">
                  <ul className="nk-block-tools g-3">
                    <li></li>
                    <li className="nk-block-tools-opt">
                      <BlockHeadContent>
                        <Link to={`${process.env.PUBLIC_URL}/bus-schedules`}>
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
          <br></br>
          <BlockBetween>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <div className="toggle-expand-content">
                  <ul className="nk-block-tools g-3">
                    <li>
                      {/* <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Quick search by SKU"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div> */}
                      <MyDropDown />
                    </li>
                    <li>
                      <WeeklyDatePicker />
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <div className="toggle-expand-content">
                  <ul className="nk-block-tools g-3">
                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle btn-icon d-md-none"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                      </Button>
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Product</span>
                      </Button>
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
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Sun</th>
                    <th scope="col">Mon</th>
                    <th scope="col">Tue</th>
                    <th scope="col">Wed</th>
                    <th scope="col">Thu</th>
                    <th scope="col">Fri</th>
                    <th scope="col">Sat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th style={{ width: "500px" }} scope="row">
                      <form style={{ width: "300px" }}>
                        <FormGroup className="form-group">
                          <div className="form-control-wrap">
                            <MyDropDown />
                          </div>
                        </FormGroup>

                        <FormGroup className="form-group">
                          <label className="form-label" htmlFor="pay-amount">
                            Amount
                          </label>
                          <div className="form-control-wrap">
                            <input type="number" id="pay-amount" className="form-control" />
                          </div>
                        </FormGroup>

                        <FormGroup className="form-group">
                          <Button color="primary" size="lg">
                            Save Informations
                          </Button>
                        </FormGroup>
                      </form>
                    </th>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input form-control" id="customCheck1" />
                          <label className="custom-control-label" htmlFor="customCheck1"></label>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input form-control" id="customCheck1" />
                          <label className="custom-control-label" htmlFor="customCheck1"></label>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input form-control" id="customCheck1" />
                          <label className="custom-control-label" htmlFor="customCheck1"></label>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input form-control" id="customCheck1" />
                          <label className="custom-control-label" htmlFor="customCheck1"></label>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input form-control" id="customCheck1" />
                          <label className="custom-control-label" htmlFor="customCheck1"></label>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input form-control" id="customCheck1" />
                          <label className="custom-control-label" htmlFor="customCheck1"></label>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input form-control" id="customCheck1" />
                          <label className="custom-control-label" htmlFor="customCheck1"></label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@fat</td>
                    <td>@fat</td>
                    <td>@fat</td>
                    <td>@fat</td>
                  </tr>
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default RunCut;
