import React, { useEffect, useRef, useState } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { successAlert, failureAlert } from "../utils/Utils";
import SimpleBar from "simplebar-react";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  BlockBetween,
  PaginationComponent,
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
} from "reactstrap";
import DiagnoseTrackerModal from "./components/DiagnoseTrackerModal/DiagnoseTrackerModal";
// import AddTrackerModal from "../pages/components/AddTrackerModal/AddTrackerModal";
import { user_id } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
const AlertManage = () => {
  const history = useHistory();
  const VEHICLE_TYPES = { 1: "Truck", 2: "Car", 3: "Maxi Cab", 4: "Bike", 5: "Bus" };
  const DEVICE_MODE_BADGE = { PARKED: "warning", MOVING: "success", OFFLINE: "danger" };
  const userId = useSelector(user_id);
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
  const [itemPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = trackers.slice(indexOfFirstItem, indexOfLastItem);
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
    history.push("/vehicle-info", { imei: imei, vehicleType: tracker.vehicleType, vehicleNo: tracker.vehicleNo });
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
      const response = await axios.get("https://ecolane-api.zig-web.com/api/GetRealtimeAlertspb");
      return response.data;
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
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Alerts Management
              </BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="total">
                <h5>Total: {currentItems.length}</h5>
              </div>
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
                          placeholder="Search by coach no"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>

                    {/* <li className="nk-block-tools-opt">
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
                        <span>Add Tracker</span>
                      </Button>
                    </li> */}
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          {/* {" "} */}
          <Card className="card-bordered card-preview">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <table style={{ width: "100%", tableLayout: "auto", textAlign: "center" }} className="table">
                  <thead>
                    <tr>
                      <th>Route ID</th>
                      <th className="d-none d-md-table-cell">Description</th>
                      <th className="d-sm-none">Start Date</th>
                      <th className="d-none d-sm-table-cell">Start Date</th>
                      <th className="d-none d-sm-table-cell">End Date</th>
                      <th className="d-none d-sm-table-cell">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0
                      ? currentItems.map((item) => {
                          return (
                            <tr key={item.route_id}>
                              <th style={{ padding: "0.75rem 0.25rem" }}>
                                <span>{item.route_id}</span>
                                <span className="d-block d-md-none">{VEHICLE_TYPES[item.DescriptionText]}</span>
                              </th>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {item.DescriptionText}
                              </td>
                              <td className="d-sm-none" style={{ padding: "0.75rem 0.25rem" }}>
                                <span className="d-block">{item.Start_Date}</span>
                                <span className="d-block">{item.End_Date}</span>
                              </td>
                              <td className="d-none d-sm-table-cell" style={{ padding: "0.75rem 0.25rem" }}>
                                {item.Start_Date}
                              </td>
                              <td className="d-none d-sm-table-cell" style={{ padding: "0.75rem 0.25rem" }}>
                                {item.End_Date}
                              </td>
                              {/* <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-sm-table-cell">
                                {" "}
                                <span className="tb-sub">
                                  <Badge color={DEVICE_MODE_BADGE[item?.Devicemode.toString().toUpperCase()]}>
                                    {item?.Devicemode.toString().toUpperCase()}
                                  </Badge>
                                </span>
                              </td> */}
                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                {/* <span className="tb-sub d-block d-sm-none ">
                                  <Badge color={DEVICE_MODE_BADGE[item?.Devicemode.toString().toUpperCase()]}>
                                    {item?.Devicemode.toString().toUpperCase()}
                                  </Badge>
                                </span> */}
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

export default AlertManage;
