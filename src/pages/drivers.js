import React, { useEffect, useRef, useState } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { successAlert, failureAlert } from "../utils/Utils";
import SimpleBar from "simplebar-react";
import Moment from "react-moment";
import styled from "styled-components";

import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  BlockBetween,
  PaginationComponent,
  SpecialTable,
  RSelect,
} from "../components/Component";
import {
  Button,
  Card,
  Spinner,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Badge,
  Modal,
  ModalBody,
  Label,
  FormGroup,
  Input,
  ModalHeader,
} from "reactstrap";
import DiagnoseTrackerModal from "./components/DiagnoseTrackerModal/DiagnoseTrackerModal";
import CreateScheduleModalFinal from "./components/CreateScheduleModalFinal/CreateScheduleModalFinal";
import { user_id } from "../redux/userSlice";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import backgroundImage from "../assets/images/users_background.png";
import { useForm } from "react-hook-form";

import axios from "axios";
const drivers = () => {
  const { errors, register, handleSubmit } = useForm();
  const history = useHistory();
  const VEHICLE_TYPES = { 1: "Truck", 2: "Car", 3: "Maxi Cab", 4: "Bike", 5: "Bus" };
  const DEVICE_MODE_BADGE = { PARKED: "warning", MOVING: "success", OFFLINE: "danger" };
  const [clients, setClients] = useState([]);
  const initialTrackers = useRef([]);
  const [view, setView] = useState({
    edit: false,
    add: false,
    diagnose: false,
  });
  const userId = useSelector(user_id);
  const INITIAL_ADD_FORM = {
    venueRefId: userId,
    driver_first_name: "",
    driver_last_name: "",
    account_status: "Active",
  };

  const [formData, setFormData] = useState(INITIAL_ADD_FORM);
  const [addedData, setAddedData] = useState(false);
  const [EditedDriver, setEditedDriver] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [onSearchText, setSearchText] = useState("");
  const [trackers, setTrackers] = useState([]);
  const [sm, updateSm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [diagnoseImei, setDiagnoseImei] = useState();
  const [createdSchedule, setCreatedSchedule] = useState(false);
  const [itemPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = trackers.slice(indexOfFirstItem, indexOfLastItem);

  const onViewClick = (index) => {
    console.log(index);
    console.log(currentItems[index]);
    setFormData(currentItems[index]);
  };
  const resetForm = () => {
    setFormData(INITIAL_ADD_FORM);
    onFormCancel();
    // setModalForm(false);
  };

  const toggleAddedData = () => {
    setAddedData(!addedData);
  };
  const toggleEditedDriver = () => {
    setEditedDriver(!EditedDriver);
  };
  const filterStatus = [
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Suspend", label: "Suspend" },
  ];
  //   const [driverList, setDriverList] = useState([]);

  const onFormSubmit = (e) => {
    console.log(formData);
    axios
      .post("addDriver", formData)
      .then((res) => {
        if (res.status === 201) {
          // setData((prev) => [...prev, res.data]);
          resetForm();
          toggleAddedData();
          successAlert("New Driver added successfully");
          // setAddedData(true);
        } else {
          throw new Error(res.data);
        }
      })
      .catch((err) => {
        window.alert("Error in creating alerts");
        console.log(err);
      });
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      diagnose: type === "diagnose" ? true : false,
    });
  };
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };
  const onSubmitHandler = (data) => {
    axios
      .post("api/Device", { ...data, DeviceType: 1, OdometerValueNew: 0, Devicemode: "offline", client_id: userId })
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          let newTrackers = [...trackers];
          newTrackers.push(res.data);
          console.log(newTrackers);
          setTrackers(newTrackers);
          setView({
            edit: false,
            add: false,
            diagnose: false,
          });
          successAlert("Schedule created successfully");
        } else {
          failureAlert("Error");
        }
      });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    console.log(formData);
  };
  const onEditClick = (id) => {
    const selectedTracker = trackers.find((item) => item.id === id);
    setFormData({
      ...selectedTracker,
    });
  };

  const onEditSubmit = () => {
    console.log(formData);

    axios
      .put("EditDriver", formData)
      .then((res) => {
        if (res.status === 201) {
          // console.log(newTrackers);
          // setTrackers(newTrackers);
          toggleEditedDriver();
          setView({
            edit: false,
            add: false,
            diagnose: false,
          });
          successAlert("Driver edited successfully");
        } else {
          failureAlert("Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFormCancel = () => {
    setView({ edit: false, add: false, diagnose: false });
  };
  const redirectToWidget = (id) => {
    console.log(id);
    history.push("/run", { id: id });
  };
  const deleteDriver = async (id) => {
    console.log(id);
    const response = await axios.delete("DeleteDriver?id=" + id);
    successAlert("Driver deleted successfully");
    toggleEditedDriver();
  };
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = trackers.filter((item) => {
        return item.vehicleNo.toLowerCase().includes(onSearchText.toLowerCase());
      });

      setTrackers([...filteredObject]);
    } else {
      setTrackers([...initialTrackers.current]);
    }
  }, [onSearchText]);
  useEffect(() => {
    const getAlerts = async () => {
      try {
        const response = await axios.get("getDriverList?venueRefId=" + userId);
        const filteredData = response.data.filter((driver) => driver.id);
        return filteredData;
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    setLoading(true);
    getAlerts()
      .then((res) => {
        setTrackers([...res]);
        initialTrackers.current = [...res];
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    const getAlerts = async () => {
      try {
        const response = await axios.get("getDriverList?venueRefId=" + userId);
        const filteredData = response.data.filter((driver) => driver.id);
        return filteredData;
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    setLoading(true);
    getAlerts()
      .then((res) => {
        setTrackers([...res]);
        initialTrackers.current = [...res];
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [addedData]);
  useEffect(() => {
    const getAlerts = async () => {
      try {
        const response = await axios.get("getDriverList?venueRefId=" + userId);
        const filteredData = response.data.filter((driver) => driver.id);
        return filteredData;
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    setLoading(true);
    getAlerts()
      .then((res) => {
        setTrackers([...res]);
        initialTrackers.current = [...res];
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [EditedDriver]);
  //   useEffect(() => {
  //     const getDriverList = async () => {
  //       const response = await axios.get("/getDriverList?venueRefId=" + userId);
  //       return response.data;
  //     };
  //     getDriverList().then((res) => {
  //       setDriverList([...res]);
  //     });
  //   }, []);
  return (
    <React.Fragment>
      <Head title="Run Cutting"></Head>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "300px",
          paddingTop: "105px",
        }}
      >
        <BlockTitle page tag="h3">
          <Title>Bus Operators</Title>
        </BlockTitle>
      </div>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent></BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="gy-4">
            <Col sm="2" lg="2">
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
                <span>New Driver</span>
              </Button>
            </Col>
            <Col lg="10">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                <h5>Total: {currentItems.length}</h5>
              </div>
            </Col>
          </Row>
        </Block>
        <Block>
          {/* {" "} */}
          <Card className="card-bordered card-preview">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                {/* Table */}
                <table style={{ width: "100%", tableLayout: "auto", textAlign: "center" }} className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Driver Id</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Status</th>
                      <th className="d-none d-sm-table-cell">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0
                      ? currentItems.map((item, index) => {
                          return (
                            <tr key={item.id} className="tb-tnx-item">
                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                <strong>{item.id}</strong>
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                <strong>{item.driver_first_name}</strong>
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                <strong>{item.driver_last_name}</strong>
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                <strong>
                                  <span
                                    className={`tb-status text-${
                                      item.account_status === "Active"
                                        ? "success"
                                        : item.account_status === "Pending"
                                        ? "warning"
                                        : "danger"
                                    }`}
                                  >
                                    {item.account_status}
                                  </span>
                                </strong>
                              </td>

                              <td style={{ padding: "0.75rem 0.25rem" }}>
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
                                          href="#more"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            // redirectToWidget(item.id);
                                            toggle("edit");
                                            onViewClick(index);
                                          }}
                                        >
                                          <Icon name="edit-alt" />
                                          <span>Edit</span>
                                        </DropdownItem>
                                      </li>
                                      <li>
                                        <DropdownItem
                                          tag="a"
                                          href="#more"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            deleteDriver(item.id);
                                          }}
                                        >
                                          <Icon name="trash-empty" />
                                          <span>Delete</span>
                                        </DropdownItem>
                                      </li>
                                    </ul>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
                <div className="card-inner">
                  {trackers.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={trackers.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">
                        {isLoading ? <Spinner color="primary" /> : "No Data available"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>
        {/* Below is the Diagnose Modal */}
        <Modal isOpen={view.diagnose} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <DiagnoseTrackerModal imei={diagnoseImei} />
            </div>
          </ModalBody>
        </Modal>
        {/* Below is the Create Modal*/}
        <Modal isOpen={view.add} toggle={() => onFormCancel()} className="modal-dialog-centered" size="m">
          <ModalHeader
            close={
              <a href="#cancel" className="close">
                <Icon
                  name="cross-sm"
                  onClick={(ev) => {
                    ev.preventDefault();
                    onFormCancel();
                  }}
                ></Icon>
              </a>
            }
          >
            Add Driver
          </ModalHeader>
          <ModalBody>
            <div className="p-2">
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <FormGroup>
                  <label className="form-label" htmlFor="first-name">
                    First Name
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      id="driver_first_name"
                      name="driver_first_name"
                      value={formData.driver_first_name}
                      onChange={onChangeHandler}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <label className="form-label" htmlFor="last-name">
                    Last Name
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      id="driver_last_name"
                      name="driver_last_name"
                      value={formData.driver_last_name}
                      onChange={onChangeHandler}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <label className="form-label">Status</label>
                  <div className="form-control-wrap">
                    <RSelect
                      options={filterStatus}
                      defaultValue={{
                        value: "Active",
                        label: "Active",
                      }}
                      onChange={(e) => setFormData({ ...formData, account_status: e.value })}
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <Button color="primary" type="submit" size="lg">
                    Add Driver
                  </Button>
                </FormGroup>
              </form>
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="m">
          <ModalHeader
            close={
              <a href="#cancel" className="close">
                <Icon
                  name="cross-sm"
                  onClick={(ev) => {
                    ev.preventDefault();
                    onFormCancel();
                  }}
                ></Icon>
              </a>
            }
          >
            Edit Driver
          </ModalHeader>
          <ModalBody>
            <div className="p-2">
              <form onSubmit={handleSubmit(onEditSubmit)}>
                <FormGroup>
                  <label className="form-label" htmlFor="first-name">
                    First Name
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      id="driver_first_name"
                      name="driver_first_name"
                      value={formData.driver_first_name}
                      onChange={onChangeHandler}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <label className="form-label" htmlFor="last-name">
                    Last Name
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      id="driver_last_name"
                      name="driver_last_name"
                      value={formData.driver_last_name}
                      onChange={onChangeHandler}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <label className="form-label">Status</label>
                  <div className="form-control-wrap">
                    <RSelect
                      options={filterStatus}
                      defaultValue={{
                        value: "Active",
                        label: "Active",
                      }}
                      onChange={(e) => setFormData({ ...formData, account_status: e.value })}
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <Button color="primary" type="submit" size="lg">
                    Edit Driver
                  </Button>
                </FormGroup>
              </form>
            </div>
          </ModalBody>
        </Modal>
        {/* Below is the add tracker modal */}

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

const Title = styled.h3`
  font-size: 112px;
  font-weight: 900;
  padding-left: 32px;
`;

export default drivers;
