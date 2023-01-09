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
} from "reactstrap";
import { useForm } from "react-hook-form";
import Head from "../layout/head/Head";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
const alertAddedSuccess = (msg) => {
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
const Alerts = () => {
  const dispatch = useDispatch();
  const [sm, updateSm] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState({ add: false, edit: false });
  const devices = useSelector(selectAllDevices);
  const [data, setData] = useState([]);
  const initialAlerts = useRef([]);
  const userId = useSelector(user_id);
  const deviceStatus = useSelector(getDevicesStatus);
  const [error, setError] = useState(false);
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const [isLoading, setLoading] = useState(false);
  const { errors, register, handleSubmit } = useForm();
  const [alertTypes, setAlertTypes] = useState([]);
  const [editId, setEditedId] = useState();
  const INITIAL_ADD_FORM = {
    client_id: userId,
    WifiMacAddress: null,
    SpeedThresholdValue: null,
    Duration: null,
    Status: false,
  };
  const [formData, setFormData] = useState({ ...INITIAL_ADD_FORM });
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };
  const onSubmitHandler = () => {
    console.log(formData);
    if (showAlertModal.add) {
      axios
        .post("CreateOSAlert", { ...formData })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setData((prev) => [...prev, res.data]);
            setFormData(INITIAL_ADD_FORM);
            setShowAlertModal({ add: false, edit: false });
            alertAddedSuccess("Your Alert has been added");
          } else throw new Error();
        })
        .catch((err) => {
          failure("Alert isn't added");
        });
    } else {
      let newData = [...data];
      newData[editId] = { id: newData[editId].id, ...formData };
      console.log(newData[editId]);
      axios
        .put("OVerspeedAlertUpdate", { id: newData[editId].id, ...formData })
        .then((res) => {
          if (res.status === 200) {
            setData([...newData]);
            setEditedId(null);
            setShowAlertModal({ add: false, edit: false });
            setFormData(INITIAL_ADD_FORM);
            alertAddedSuccess("Your Alert has been edited");
          } else throw new Error();
        })
        .catch((err) => {
          failure("Editing Alert Failed");
        });
    }
  };
  useEffect(() => {
    const getAlerts = async () => {
      const response = await axios.get("getOSAlerts?client_id=" + userId);
      if (response.status === 200) {
        setData([...response.data]);
        initialAlerts.current = [...response.data];
      } else throw new Error();
    };
    try {
      setLoading(true);
      getAlerts();
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    if (deviceStatus === "idle") {
      dispatch(fetchDevices(userId));
    }
  }, []);
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item.WifiMacAddress.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialAlerts.current]);
    }
  }, [onSearchText]);
  useEffect(() => {
    const getAlertTypes = async () => {
      const response = await axios.get("GetAllAlertTypes");
      if (response.status === 200) setAlertTypes([...response.data]);
    };
    getAlertTypes();
  }, []);
  return (
    <React.Fragment>
      <Head title="Alerts"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Alerts
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
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Search by Wifi Mac Address"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    <li>
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => setShowAlertModal({ add: true, edit: false })}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Alert</span>
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
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <DataTableBody>
                  <DataTableHead>
                    <DataTableRow size="sm">
                      <span>Wifi Mac Address</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Speed Limit</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Status</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Duration</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Added Date</span>
                    </DataTableRow>
                    <DataTableRow className="nk-tb-col-tools">
                      <span>Actions</span>
                    </DataTableRow>
                  </DataTableHead>

                  {currentItems.length > 0
                    ? currentItems.map((item, idx) => {
                        return (
                          <DataTableItem key={item.id}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="title">{item.WifiMacAddress}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow>
                              <span className="tb-sub">{item.SpeedThresholdValue}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">
                                {item.Status ? (
                                  <Badge pill color="success">
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge pill color="danger">
                                    Idle
                                  </Badge>
                                )}
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.Duration}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-odr-date">
                                <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                                  {item.added_date}
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
                                                WifiMacAddress: item.WifiMacAddress,
                                                SpeedThresholdValue: item.SpeedThresholdValue,
                                                Duration: item.Duration,
                                                Status: item.Status,
                                              }));
                                              setShowAlertModal({ add: false, edit: true });
                                            }}
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Edit </span>
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
                      <span className="text-silent">
                        {isLoading ? <Spinner /> : error ? "Error in loading alerts" : "No alerts found"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>
        <Modal
          isOpen={showAlertModal.add || showAlertModal.edit}
          toggle={() => setShowAlertModal({ add: false, edit: false })}
          size="lg"
        >
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  setShowAlertModal({ add: false, edit: false });
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">{showAlertModal.add ? "Add Alert" : "Edit Alert"}</h5>
              <div className="mt-4">
                <form noValidate className={formClass} onSubmit={handleSubmit(onSubmitHandler)}>
                  <Row className="g-3">
                    <Col sm="12">
                      <label className="form-label" htmlFor="CategoryId">
                        Alert Type
                      </label>
                      <div className="form-control-wrap">
                        <div className="form-control-select">
                          <Input type="select" name="AlertType" id="AlertType" disabled={alertTypes.length === 0}>
                            {alertTypes.length > 0 &&
                              alertTypes.map((item, idx) => (
                                <option key={idx} value={item?.alert}>
                                  {item?.alert}
                                </option>
                              ))}
                          </Input>
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <label className="form-label" htmlFor="SpeedThresholdValue">
                        Speed Limit
                      </label>
                      <div className="input-group input-group-md">
                        <input
                          ref={register({ required: true, min: 0 })}
                          type="number"
                          name="SpeedThresholdValue"
                          id="SpeedThresholdValue"
                          className="form-control"
                          value={formData.SpeedThresholdValue ?? ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, SpeedThresholdValue: +e.target.value }))}
                        />
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="inputGroup-sizing-md">
                            km/hr
                          </span>
                        </div>
                        {errors.SpeedThresholdValue && <span className="invalid">This field is required</span>}
                      </div>
                    </Col>
                    <Col sm="6">
                      <label className="form-label" htmlFor="Duration">
                        Duration
                      </label>
                      <div className="input-group input-group-md">
                        <input
                          name="Duration"
                          id="Duration"
                          ref={register({ required: true, min: 0 })}
                          type="number"
                          step=".1"
                          className="form-control"
                          value={formData.Duration ?? ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, Duration: +e.target.value }))}
                        />
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="inputGroup-sizing-md">
                            seconds
                          </span>
                        </div>
                        {errors.Duration && <span className="invalid">This field is required</span>}
                      </div>
                    </Col>
                    <Col sm="4">
                      <label className="form-label" htmlFor="Status">
                        Status
                      </label>
                      <div className="form-control-wrap">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input form-control"
                            id="Status"
                            placeholder=""
                            checked={formData.Status}
                            onChange={() => setFormData((prev) => ({ ...prev, Status: !prev.Status }))}
                          />
                          <label className="custom-control-label" htmlFor="Status">
                            {formData.Status ? "Active" : "Idle"}
                          </label>
                        </div>
                      </div>
                    </Col>
                    <Col sm="12">
                      <label className="form-label">Device Selection</label>
                      <ul className="custom-control-group custom-control-vertical w-100">
                        {devices.length > 0 ? (
                          devices.map((item) => (
                            <li key={item.DeviceSerialNo}>
                              <div className="custom-control custom-control-sm custom-radio custom-control-pro checked">
                                <input
                                  ref={register({ required: true })}
                                  type="radio"
                                  className="custom-control-input"
                                  id={item.DeviceSerialNo}
                                  name="WifiMacAddress"
                                  value={item.WifiMacAddress}
                                  checked={formData.WifiMacAddress === item.WifiMacAddress}
                                  onChange={(e) => {
                                    setFormData((prev) => ({ ...prev, WifiMacAddress: e.target.value }));
                                  }}
                                />
                                <label className="custom-control-label" htmlFor={item.DeviceSerialNo}>
                                  <span className="user-card">
                                    <span className="user-info">
                                      <span className="lead-text">{item.DeviceName}</span>
                                      <span className="sub-text">{item.DeviceSerialNo}</span>
                                    </span>
                                  </span>
                                </label>
                              </div>
                            </li>
                          ))
                        ) : (
                          <label className="custom-control-label">
                            <span className="lead-text">No Devices Available</span>
                          </label>
                        )}
                      </ul>
                      {errors.WifiMacAddress && <span className="invalid">This field is required</span>}
                    </Col>
                  </Row>
                  <Row className="g-3">
                    <Col lg="7">
                      <Button color="primary" size="lg" type="submit">
                        {showAlertModal.add ? "Add Alert" : "Edit Alert"}
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
export default Alerts;
