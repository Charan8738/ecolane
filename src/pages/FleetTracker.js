import React, { useEffect, useRef, useState } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { successAlert, failureAlert } from "../utils/Utils";
import SimpleBar from "simplebar-react";
import DataCard from "../components/partials/default/DataCard";
import { DefaultOrderChart, DefaultRevenueChart } from "../components/partials/charts/default/DefaultCharts";
import TrafficSources from "../components/partials/e-commerce/traffic-sources/FleetTrackingChart";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  BlockBetween,
  PaginationComponent,
  Col,
  Row,
} from "../components/Component";
import styled from "styled-components";

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
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import DiagnoseTrackerModal from "./components/DiagnoseTrackerModal/DiagnoseTrackerModal";
// import AddTrackerModal from "../pages/components/AddTrackerModal/AddTrackerModal";
import { user_id } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import backgroundImage from "../assets/images/fleet_tracking.png";

import axios from "axios";
const FleetTracker = () => {
  const history = useHistory();
  const VEHICLE_TYPES = { 1: "Truck", 2: "Car", 3: "Maxi Cab", 4: "Bike", 5: "Bus", 10: "Tanker" };
  const DEVICE_MODE_BADGE = { PARKED: "warning", MOVING: "success", OFFLINE: "danger" };
  const userId = useSelector(user_id);
  const [clients, setClients] = useState([]);
  const initialTrackers = useRef([]);
  const [view, setView] = useState({
    edit: false,
    add: false,
    diagnose: false,
  });
  const [viewOption, setViewOption] = useState("");
  const [formData, setFormData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [onSearchText, setSearchText] = useState("");
  const [trackers, setTrackers] = useState([]);
  const [sm, updateSm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [diagnoseImei, setDiagnoseImei] = useState();
  const [itemPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const [filteredTrackers, setFilteredTrackers] = useState([]);
  let currentItems = filteredTrackers.slice(indexOfFirstItem, indexOfLastItem);
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
          successAlert("Tracker added successfully");
        } else {
          failureAlert("Error");
        }
      });
  };

  const onEditClick = (id) => {
    const selectedTracker = trackers.find((item) => item.id === id);
    setFormData({
      ...selectedTracker,
    });
  };
  const onEditSubmit = (data) => {
    console.log(data);
    axios
      .put("api/RegisterDevice", {
        imei: data.imei,
        client_id: data.client_id,
        vehicleNo: data.vehicleNo,
        OdometerValue: data.OdometerValue,
        vehicleType: data.vehicleType,
      })
      .then((res) => {
        if (res.status === 200) {
          const newTrackers = [...trackers];
          const editedIdx = newTrackers.findIndex((item) => item.id === data.id);
          newTrackers[editedIdx] = { ...data };
          setTrackers(newTrackers);
          setView({
            edit: false,
            add: false,
            diagnose: false,
          });
          successAlert("Tracker edited successfully");
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
  const redirectToWidget = (imei) => {
    const tracker = trackers.find((item) => item.imei === imei);
    console.log(tracker.vehicleType);
    history.push("/vehicle-info", {
      imei: imei,
      vehicleType: tracker.vehicleType,
      vehicleNo: tracker.vehicleNo,
      DeviceType: tracker.DeviceType,
    });
  };

  useEffect(() => {
    console.log(viewOption);
    console.log(filteredTrackers.length);
    let defaultData = trackers;
    if (viewOption !== "" && viewOption !== "All") {
      defaultData = trackers.filter((item) => {
        return item?.Devicemode.toString().toLowerCase().includes(viewOption.toLowerCase());
      });
      setFilteredTrackers(defaultData);
    } else {
      setFilteredTrackers(trackers);
    }
  }, [viewOption, trackers]);

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
    const getTrackers = async () => {
      const response = await axios.get("gpsData?client_id=" + userId);
      return response.data;
    };
    setLoading(true);
    getTrackers()
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
    const getClients = async () => {
      const response = await axios.get("api/getUserDetails");
      return response.data;
    };
    getClients().then((res) => {
      setClients([...res]);
    });
  }, []);
  return (
    <React.Fragment>
      <Head title="Add Tracker"></Head>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "300px",
          paddingTop: "125px",
        }}
      >
        <BlockTitle page tag="h3">
          <Title>Fleet Tracking</Title>
        </BlockTitle>
      </div>

      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent></BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Col sm="4">
            <TrafficSources device={trackers} />
          </Col>
        </Block>
        <Block>
          <Label className="form-label" style={{ display: "flex", alignItems: "center", height: "100%" }}>
            Sort By
          </Label>
          <Row className="gy-4">
            <Col sm="1">
              <FormGroup>
                <div className="form-control-wrap">
                  <div className="form-control-select">
                    <Input
                      type="select"
                      name="select"
                      id="view-options"
                      onChange={(event) => setViewOption(event.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Moving">Moving</option>
                      <option value="Parked">Parked</option>
                      <option value="Idle">Idle</option>
                      <option value="Offline">Offline</option>
                    </Input>
                  </div>
                </div>
              </FormGroup>
            </Col>
            <Col sm="2" lg="2">
              <div className="form-control-wrap">
                <div className="form-icon form-icon-right">
                  <Icon name="search"></Icon>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="default-04"
                  placeholder="Search by coach no"
                  onChange={(e) => onFilterChange(e)}
                />
              </div>
            </Col>

            {/* <div
              className="total"
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginLeft: "auto",
                marginRight: "15px",
              }}
            >
              <h5>Total: {trackers.length}</h5>
            </div> */}
          </Row>
        </Block>
        {/* <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="4">
              <DataCard
                title="Total Vehicles"
                percentChange={"2.5"}
                up={true}
                chart={<DefaultOrderChart />}
                amount="22"
                // amount={devices ? `${devices.length}` : "NA"}
              />
            </Col>
            <Col xxl="3" sm="4">
              <DataCard
                title="Vehicles Running"
                percentChange={"2.5"}
                up={false}
                chart={<DefaultRevenueChart />}
                amount="100"
                // amount={devices ? `${devices.filter((i) => i.DeviceStatus === "Online").length}` : "NA"}
              />
            </Col>
          </Row>
        </Block> */}
        <Block>
          {/* {" "} */}
          <Card className="card-bordered card-preview">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <table style={{ width: "100%", tableLayout: "auto", textAlign: "center" }} className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Coach No</th>
                      <th className="d-none d-md-table-cell">Vehicle Type</th>
                      <th className="d-sm-none">IMEI and Sim No</th>
                      <th className="d-none d-sm-table-cell">IMEI</th>
                      <th className="d-none d-sm-table-cell">Sim No</th>
                      <th>Device Mode</th>
                      <th className="d-none d-sm-table-cell">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0
                      ? currentItems.map((item) => {
                          return (
                            <tr key={item.vehicleNo} className="tb-tnx-item">
                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                <span style={{ fontWeight: "bold" }}>{item.vehicleNo}</span>
                                {/* <span className="d-block d-md-none">{VEHICLE_TYPES[item.vehicleType]}</span> */}
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {VEHICLE_TYPES[item.vehicleType]}
                              </td>
                              {/* <td className="d-sm-none" style={{ padding: "0.75rem 0.25rem" }}>
                                <span className="d-block">{item.imei}</span>
                              </td> */}
                              <td className="d-none d-sm-table-cell" style={{ padding: "0.75rem 0.25rem" }}>
                                {item.imei}
                              </td>
                              <td className="d-none d-sm-table-cell" style={{ padding: "0.75rem 0.25rem" }}>
                                {item.simno}
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-sm-table-cell">
                                <span className="tb-sub">
                                  <Badge color={DEVICE_MODE_BADGE[item?.Devicemode.toString().toUpperCase()]}>
                                    {item?.Devicemode.toString().toUpperCase()}
                                  </Badge>
                                </span>
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                <span className="tb-sub d-block d-sm-none ">
                                  <Badge color={DEVICE_MODE_BADGE[item?.Devicemode.toString().toUpperCase()]}>
                                    {item?.Devicemode.toString().toUpperCase()}
                                  </Badge>
                                </span>
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
                                      {/* <li>
                                        <DropdownItem
                                          tag="a"
                                          href="#edit"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            onEditClick(item.id);
                                            toggle("edit");
                                          }}
                                        >
                                          <Icon name="edit"></Icon>
                                          <span>Edit Tracker</span>
                                        </DropdownItem>
                                      </li>
                                      <li>
                                        <DropdownItem
                                          tag="a"
                                          href="#diagnose"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            setDiagnoseImei(item.imei);
                                            toggle("diagnose");
                                          }}
                                        >
                                          <Icon name="activity-round" />
                                          <span>Diagonise</span>
                                        </DropdownItem>
                                      </li> */}
                                      <li>
                                        <DropdownItem
                                          tag="a"
                                          href="#more"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            redirectToWidget(item.imei);
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
        {/* Below is the Edit Modal*/}
        <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
            {/* <div className="p-2">
              <AddTrackerModal onSubmitHandler={onEditSubmit} isEdit={true} formData={formData} clients={clients} />
            </div> */}
          </ModalBody>
        </Modal>
        {/* Below is the add tracker modal */}
        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${
            view.add ? "content-active" : ""
          }`}
        >
          {/* <AddTrackerModal onSubmitHandler={onSubmitHandler} /> */}
        </SimpleBar>

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

export default FleetTracker;
