import React, { useState, useEffect, useRef } from "react";
import {
  Icon,
  BlockHead,
  OverlineTitle,
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
import { user_id } from "..//redux/userSlice";
import { fetchDevices, selectAllDevices, getDevicesStatus } from "../redux/deviceSlice";
import {
  Card,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Badge,
  Modal,
  ModalBody,
  Spinner,
  Input,
  ButtonGroup,
  FormGroup,
} from "reactstrap";
import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";
import Head from "../layout/head/Head";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
const Success = (msg) => {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: msg,
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
const DUMMY_DATA = [{ ID: "1", Serial: "S12", Vehicle: "Vehicle 1", Notes: "Sample Notes", Date: new Date() }];
const AssetManagement = () => {
  const [sm, updateSm] = useState(false);
  const [showModal, setShowModal] = useState({ add: false, edit: false });
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);

  const { errors, register, handleSubmit } = useForm();
  const [editId, setEditedId] = useState();
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState();

  const onFormSubmit = () => {
    console.log("test");
  };
  const INITIAL_ADD_FORM = {
    route_id: "",
    DescriptionText: "",
    Start_Date: "",
    End_Date: "",
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
    {
      name: "Start Date",
      value: "Start_Date",
    },
    {
      name: "End Date",
      value: "End_Date",
    },
    // {
    //   name: "Read More URL",
    //   value: "readmore",
    // },
  ];
  const [formData, setFormData] = useState({ ...INITIAL_ADD_FORM });
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
  const onSubmitHandler = () => {
    console.log(formData);
    const response = axios.put("EditAdmincms", formData);
    if (showModal.add) {
      let newArr = [...data];
      newArr.push({ ...formData, Date: new Date() });
      setData(newArr);
      Success("Added Successfully");
    } else {
      let newData = [...data];
      newData[editId] = { ...formData };
      setData([...newData]);
      if (response.status === 201) {
        Success("Edited Successfully");
      }
    }
    setShowModal({ add: false, edit: false });
  };
  const fetchCategories = async () => {
    const response = await axios.get("GetRealtimeAlertspb");
    // setCategories([...response.data]);
    return [...response.data];
  };
  useEffect(() => {
    fetchCategories().then((res) => {
      setFormData(res[0]);
      console.log(res[0]);
      setData(res);
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
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand mr-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      {/* <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => setShowModal({ add: true, edit: false })}
                      >
                        <Icon name="plus"></Icon>
                        <span>Create Alert</span>
                      </Button> */}
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <div className="card-head">
              <h5 className="card-title">Create an Alert</h5>
            </div>
            <form className="gy-3" onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3 align-center">
                <Col lg="5">
                  <FormGroup>
                    <label className="form-label" htmlFor="site-name">
                      Alert Name
                    </label>
                    <span className="form-note">Specify the name of your Alert.</span>
                  </FormGroup>
                </Col>
                <Col lg="7">
                  <FormGroup>
                    <div className="form-control-wrap">
                      <input type="text" id="site-name" className="form-control" />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="g-3 align-center">
                <Col lg="5">
                  <FormGroup>
                    <label className="form-label">Route Number</label>
                    <span className="form-note">Specify the Route Number.</span>
                  </FormGroup>
                </Col>
                <Col lg="7">
                  {/* <FormGroup>
                    <div className="form-control-wrap">
                      <input type="text" id="site-email" className="form-control" />
                    </div>
                  </FormGroup> */}
                  <FormGroup>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <select
                          ref={register({
                            required: true,
                          })}
                          className="form-control form-select"
                          id="fv-topics"
                          name="topics"
                          placeholder="Select a option"
                        >
                          <option label="Select a route" value=""></option>
                          <option value="fv-209">209</option>
                          <option value="fv-208">208</option>
                          <option value="fv-409">409</option>
                          <option value="fv-968">968</option>
                        </select>
                        {errors.topics && <span className="invalid">This field is required</span>}
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
                      <input type="text" name="site-url" className="form-control" />
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
                    <Button color="primary" size="lg" type="submit" onClick={(e) => e.preventDefault()}>
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
                      <span>Route id</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Description</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Start Date</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>End Date</span>
                    </DataTableRow>
                    {/* <DataTableRow size="md">
                      <span>Date</span>
                    </DataTableRow> */}
                    <DataTableRow className="nk-tb-col-tools">
                      <span>Actions</span>
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

                            {/* <DataTableRow>
                              <span className="tb-sub">{item.title}</span>
                            </DataTableRow> */}
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
                                                ID: item.ID,
                                                Serial: item.Serial,
                                                Vehicle: item.Vehicle,
                                                Notes: item.Notes,
                                              }));
                                              setShowModal({ add: false, edit: true });
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
                      <span className="text-silent">No Assets found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>
        <Modal
          isOpen={showModal.add || showModal.edit}
          toggle={() => setShowModal({ add: false, edit: false })}
          size="lg"
        >
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  setShowModal((prev) => {
                    if (prev.edit) setFormData({ ...INITIAL_ADD_FORM });
                    return { add: false, edit: false };
                  });
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">{showModal.add ? "Create Alert" : "Edit Alert"}</h5>
              <div className="mt-4">
                <form noValidate className={formClass} onSubmit={handleSubmit(onSubmitHandler)}>
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
                  </Row>
                  <Row className="g-3">
                    <Col lg="7">
                      <Button color="primary" size="lg" type="submit">
                        {showModal.add ? "Add Asset" : "Edit Alert"}
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
