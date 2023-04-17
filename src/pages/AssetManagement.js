import React, { useState, useEffect, useRef } from "react";
import {
  Icon,
  BlockHead,
  Row,
  Col,
  Button,
  Block,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  BlockHeadContent,
  BlockTitle,
  BlockBetween,
  PaginationComponent,
  PreviewCard,
} from "../components/Component";
import "moment-timezone";
import Moment from "react-moment";
import Content from "../layout/content/Content";
import classNames from "classnames";
import {
  Card,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  Spinner,
  FormGroup,
} from "reactstrap";
import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";
import Head from "../layout/head/Head";
import axios from "axios";
import Swal from "sweetalert2";
import { successAlert } from "../utils/Utils";

const failure = (msg) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: msg,
    focusConfirm: true,
  });
};
const AssetManagement = () => {
  const INITIAL_ADD_FORM = {
    route_id: "",
    DescriptionText: "",
  };
  const TABLE_HEADING = [
    {
      name: "Route id",
      value: "route_id",
    },
    {
      name: "Description",
      value: "DescriptionText",
    },
  ];
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({ ...INITIAL_ADD_FORM });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);

  const { errors, register, handleSubmit } = useForm();
  const [editId, setEditedId] = useState();
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(new Date());

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  const resetForm = () => {
    setFormData(INITIAL_ADD_FORM);
    setRangeStart(new Date());
    setRangeEnd(new Date());
  };
  const onCreateAlertHandler = () => {
    const newAlert = { ...formData, Start_Date: rangeStart.toISOString(), End_Date: rangeEnd.toISOString() };
    axios
      .post("AddAlerts", { ...newAlert })
      .then((res) => {
        if (res.status === 200) {
          setData((prev) => [...prev, res.data]);
          resetForm();
          successAlert("Alert created successfully");
        } else {
          throw new Error(res.data);
        }
      })
      .catch((err) => {
        window.alert("Error in creating alerts");
        console.log(err);
      });
  };
  const onDeleteHandler = (route_id) => {
    console.log("tets");
    axios.delete("DeleteVehicleAlerts?route_id=" + route_id).then((res) => {
      if (res.status == 200) {
        successAlert("Alert Deleted successfully");
      } else {
        // throw new Error(res.data);
        failureAlert("Unable to delete alert");
      }
    });
  };
  const onEditAlertHandler = () => {
    const newAlert = { ...formData, Start_Date: rangeStart.toISOString(), End_Date: rangeEnd.toISOString() };
    axios
      .post("UpdateVehicleAlerts", { ...newAlert })
      .then((res) => {
        if (res.status === 200) {
          // setData((prev) => [...prev, res.data]);
          const index = data.findIndex((item) => item.route_id === newAlert.route_id);
          let newItems = [...data];
          newItems[index] = { ...newItems[index], ...newAlert };
          // console.log(newItems);
          setData(newItems);
          resetForm();
          setShowModal(false);
          successAlert("Alert Edited successfully");
        } else {
          throw new Error(res.data);
        }
      })
      .catch((err) => {
        window.alert("Error in Editing alerts");
        console.log(err);
      });
  };

  const fetchAlerts = async () => {
    const response = await axios.get("GetRealtimeAlertspb");
    return [...response.data];
  };
  const fetchRoutes = async () => {
    const response = await axios.get("lima/GetStandardBusLines");
    return [...response.data];
  };
  useEffect(() => {
    fetchAlerts().then((res) => {
      setData(res);
    });
  }, []);
  useEffect(() => {
    fetchRoutes()
      .then((res) => {
        setRoutes(res);
        setFormData((prev) => ({ ...prev, route_id: res.length > 0 ? res[0]?.RouteName : null }));
      })
      .catch((err) => {
        console.log("Error in fetiching route list");
      });
  }, []);
  return (
    <React.Fragment>
      <Head title="Alerts"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Alerts Management
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <div className="card-head">
              <h5 className="card-title">Create an Alert</h5>
            </div>
            <form className="gy-3" onSubmit={handleSubmit(onCreateAlertHandler)}>
              {/*  <Row className="g-3 align-center">
                <Col lg="5">
                  <FormGroup>
                    <label className="form-label" htmlFor="alert-name">
                      Alert Name
                    </label>
                    <span className="form-note">Specify the name of your Alert.</span>
                  </FormGroup>
                </Col>
                <Col lg="7">
                  <FormGroup>
                    <div className="form-control-wrap">
                      <input type="text" id="alert-name" className="form-control" required />
                    </div>
                  </FormGroup>
                </Col>
              </Row>*/}
              <Row className="g-3 align-center">
                <Col lg="5">
                  <FormGroup>
                    <label className="form-label">Route Name</label>
                    <span className="form-note">Specify the Route Name.</span>
                  </FormGroup>
                </Col>
                <Col lg="7">
                  <FormGroup>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <select
                          ref={register({
                            required: true,
                          })}
                          value={formData.route_id}
                          onChange={(e) => setFormData((prev) => ({ ...prev, route_id: e.target.value }))}
                          className="form-control form-select"
                          id="route-id"
                          name="route_id"
                          disabled={routes.length === 0}
                        >
                          {" "}
                          {routes.map((route) => (
                            <option key={route.RouteID} value={route.RouteName}>
                              {route.RouteName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <Row className="g-3 align-center">
                <Col lg="5">
                  <FormGroup>
                    <label className="form-label">Alert Message</label>
                    <span className="form-note">
                      The following alert message will be published for the above specified route.
                    </span>
                  </FormGroup>
                </Col>
                <Col lg="7">
                  <FormGroup>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="alert-msg"
                        required
                        value={formData.DescriptionText}
                        className="form-control"
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, DescriptionText: e.target.value }));
                        }}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="g-3 align-center">
                <Col lg="5">
                  <FormGroup>
                    <label className="form-label" htmlFor="site-off">
                      Alert Start Date to End Date
                    </label>
                  </FormGroup>
                </Col>
                <Col lg="7">
                  <FormGroup>
                    <div className="form-control-wrap">
                      <div className="input-daterange date-picker-range input-group">
                        <DatePicker
                          selected={rangeStart}
                          onChange={setRangeStart}
                          selectsStart
                          startDate={rangeStart}
                          endDate={rangeEnd}
                          wrapperClassName="start-m"
                          className="form-control"
                        />{" "}
                        <div className="input-group-addon">TO</div>
                        <DatePicker
                          selected={rangeEnd}
                          onChange={setRangeEnd}
                          startDate={rangeStart}
                          endDate={rangeEnd}
                          selectsEnd
                          minDate={rangeStart}
                          wrapperClassName="end-m"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="form-note">
                      Date Format <code>mm/dd/yyyy</code>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="g-3">
                <Col lg="7" className="offset-lg-5">
                  <FormGroup className="mt-2">
                    <Button color="primary" size="lg" type="submit">
                      Create
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </form>
          </PreviewCard>
          <Card>
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <DataTableBody>
                  <DataTableHead>
                    <DataTableRow size="sm">
                      <h6>Route ID</h6>
                    </DataTableRow>
                    <DataTableRow>
                      <h6>Description</h6>
                    </DataTableRow>
                    <DataTableRow>
                      <h6>Start Date</h6>
                    </DataTableRow>
                    <DataTableRow>
                      <h6>End Date</h6>
                    </DataTableRow>

                    <DataTableRow className="nk-tb-col-tools">
                      <h6>Actions</h6>
                    </DataTableRow>
                  </DataTableHead>

                  {currentItems.length > 0
                    ? currentItems.map((item, idx) => {
                        return (
                          <DataTableItem key={item.route_id}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="title">{item.route_id}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow>
                              <span className="tb-sub">{item.DescriptionText}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-odr-date">
                                <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                                  {item.Start_Date}
                                </Moment>
                              </span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-odr-date">
                                <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                                  {item.End_Date}
                                </Moment>
                              </span>
                            </DataTableRow>
                            <DataTableRow className="nk-tb-col-tools">
                              <ul className="gx-1 my-n1">
                                <li className="">
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      tag="a"
                                      href="#more"
                                      onClick={(ev) => ev.preventDefault()}
                                      className="dropdown-toggle btn btn-icon btn-trigger"
                                    >
                                      <Icon name="more-h"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                      <ul className="link-list-opt no-bdr">
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#edit"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              setEditedId(idx);
                                              setFormData((prev) => ({
                                                ...prev,
                                                route_id: item.route_id,
                                                DescriptionText: item.DescriptionText,
                                              }));
                                              setRangeStart(new Date(item.Start_Date));
                                              setRangeEnd(new Date(item.End_Date));
                                              setShowModal(true);
                                            }}
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Edit </span>
                                          </DropdownItem>
                                        </li>
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#edit"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              let newArr = [...data];
                                              newArr.splice(idx, 1);
                                              setData([...newArr]);
                                              onDeleteHandler(item.route_id);
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Delete </span>
                                          </DropdownItem>
                                        </li>
                                      </ul>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </li>
                              </ul>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })
                    : null}
                </DataTableBody>

                <div className="card-inner">
                  {data.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={data.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">No Alerts found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>
        <Modal isOpen={showModal} toggle={() => setShowModal(false)} size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  setShowModal((prev) => {
                    resetForm();
                    return false;
                  });
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Edit Alert</h5>
              <div className="mt-4">
                <form noValidate className={formClass} onSubmit={handleSubmit(onEditAlertHandler)}>
                  <Row className="g-3">
                    {TABLE_HEADING.map((item) => (
                      <Col sm="4">
                        <label className="form-label" htmlFor={item}>
                          {item.name}
                        </label>
                        <div className="form-control-wrap">
                          <input
                            ref={register({ required: true })}
                            className="form-control"
                            name={item.value}
                            value={formData[item.value]}
                            onChange={onChangeHandler}
                            id={item}
                          />
                          {errors[item] && <span className="invalid">This field is required</span>}
                        </div>
                      </Col>
                    ))}
                    <Col lg="7">
                      <FormGroup>
                        <div className="form-control-wrap">
                          <div className="input-daterange date-picker-range input-group">
                            <DatePicker
                              selected={rangeStart}
                              onChange={setRangeStart}
                              selectsStart
                              startDate={rangeStart}
                              endDate={rangeEnd}
                              wrapperClassName="start-m"
                              className="form-control"
                            />{" "}
                            <div className="input-group-addon">TO</div>
                            <DatePicker
                              selected={rangeEnd}
                              onChange={setRangeEnd}
                              startDate={rangeStart}
                              endDate={rangeEnd}
                              selectsEnd
                              minDate={rangeStart}
                              wrapperClassName="end-m"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="form-note">
                          Date Format <code>mm/dd/yyyy</code>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="g-3">
                    <Col lg="7">
                      <Button color="primary" size="lg" type="submit">
                        Edit Alert
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default AssetManagement;
