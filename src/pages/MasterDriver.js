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
} from "reactstrap";
import DiagnoseTrackerModal from "./components/DiagnoseTrackerModal/DiagnoseTrackerModal";
import CreateScheduleModalFinal from "./components/CreateScheduleModalFinal/CreateScheduleModalFinal";
import { user_id } from "../redux/userSlice";

import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import backgroundImage from "../assets/images/schedules.png";

import axios from "axios";
const MasterDriver = () => {
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
  const [formData, setFormData] = useState({});
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
  const userId = useSelector(user_id);
  const location = useLocation();
  const mid = location.state?.mid;
  console.log(mid);

  //   const [driverList, setDriverList] = useState([]);
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
          failureAlert((msg = "Test"));
        }
      });
  };

  const onEditClick = (id) => {
    const selectedTracker = trackers.find((item) => item.id === id);
    setFormData({
      ...selectedTracker,
    });
  };

  const closeModal = () => {
    setView({
      edit: false,
      add: false,
      diagnose: false,
    });
  };
  const onEditSubmit = (data, driverId) => {
    console.log(data);
    let js = { driver_id: driverId, schedules: data };
    // console.log(updatedDate);
    // const updatedVehicle = {
    //   id: data.id,
    //   coach_no: data.Coachno,
    //   route_name: data.routeno,
    //   driver_name: data.Odometer,
    //   schedule_date: updatedDate,
    // };
    console.log(data.length);
    console.log(js);
    axios
      .post("addschedule", js)
      .then((res) => {
        if (res.status === 201) {
          const newTrackers = [...trackers];
          newTrackers.push(js);
          // const editedIdx = newTrackers.findIndex((item) => item.id === data.id);
          // newTrackers[editedIdx] = { ...data };
          // setTrackers(newTrackers);
          console.log(newTrackers);
          setTrackers(newTrackers);
          setCreatedSchedule(true);
          setView({
            edit: false,
            add: false,
            diagnose: false,
          });
          successAlert("Schedule created successfully");
        } else {
          failureAlert("Please select a driver");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFormCancel = () => {
    setView({ edit: false, add: false, diagnose: false });
  };
  const redirectToWidget = (id, dname) => {
    console.log(id);
    history.push("/master-run-cutting", { id: id, dname: dname, mid: mid });
  };
  const redirectToCreateSchedulePage = () => {
    history.push("/create-schedule");
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
        const filteredData = response.data.filter((driver) => driver.schedule);
        return response.data;
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
        const filteredData = response.data.filter((driver) => driver.schedule);
        return response.data;
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
  }, [createdSchedule]);
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

      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Master Schedule for Drivers
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="gy-4">
            {/* <Col sm="2" lg="2">
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
                  redirectToCreateSchedulePage();
                }}
              >
                <Icon name="plus"></Icon>
                <span>Create Schedule</span>
              </Button>
            </Col> */}
            {/* <Col lg="10">
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
            </Col> */}
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
                      <th className="d-none d-sm-table-cell">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0
                      ? currentItems.map((item) => {
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
                                            redirectToWidget(
                                              item.id,
                                              item.driver_first_name + " " + item.driver_last_name
                                            );
                                          }}
                                        >
                                          <Icon name="more-v-alt" />
                                          <span>View more</span>
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
                        {isLoading ? <Spinner color="primary" /> : "No trackers found"}
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
              <DiagnoseTrackerModal imei={diagnoseImei} />
            </div>
          </ModalBody>
        </Modal>
        {/* Below is the Create Modal*/}
        <Modal isOpen={view.add} toggle={() => onFormCancel()} className="modal-dialog-centered" size="xl">
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
              <CreateScheduleModalFinal
                onSubmitHandler={closeModal}
                isEdit={false}
                // formData={formData}
                clients={clients}
              />
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

export default MasterDriver;
