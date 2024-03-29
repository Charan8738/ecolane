import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import "moment-timezone";
import { Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label, ButtonGroup } from "reactstrap";
import Moment from "react-moment";
import Nouislider from "nouislider-react";
import classNames from "classnames";
import Swal from "sweetalert2";
import { SketchPicker } from "react-color";
import Head from "../layout/head/Head";
import {
  PreviewCard,
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
} from "../components/Component";
import { useSelector } from "react-redux";
import { user_id } from "../redux/userSlice";
import {
  Card,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  Spinner,
} from "reactstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
const successAlert = () => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Venue updated successfully",
  });
};
const failureAlert = () => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong",
    showConfirmButton: false,
    timer: 1500,
  });
};
const MuseumData = () => {
  const client_id = useSelector(user_id);
  const [formData, setFormData] = useState({});

  const [data, setData] = useState([]);
  const initialData = useRef([]);
  const [onSearchText, setSearchText] = useState("");
  const [sm, updateSm] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { errors, register, handleSubmit } = useForm();
  const [view, setView] = useState(false);

  const getRssiValueFromFt = (x) => {
    return -45 - 5 * x;
  };
  const getFtFromRssiValue = (y) => {
    let num = ((y + 45) / -5).toFixed(2);
    return isNaN(num) ? 3 : num;
  };
  const onFormCancel = () => {
    setView(false);
    resetForm();
  };
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const resetForm = () => {
    setFormData({});
  };
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };
  const onEditClick = (id) => {
    const selected = data.find((i) => i.id === id);
    delete selected?.ClientID;
    delete selected?.Macaddresslist;
    delete selected?.Activatedate;
    delete selected?.Createddate;
    delete selected?.Payment;

    setFormData({
      ...selected,
      BiboRssi_ios:
        selected?.BibobRssi_ios && selected?.BibobRssi_ios.length === 0 ? selected?.BibobRssi : selected?.BibobRssi_ios,
      BibobRssi_ios:
        selected?.BibobRssi_ios && selected?.BibobRssi_ios.length === 0 ? selected?.BibobRssi : selected?.BibobRssi_ios,
      ClientPrimaryColorcode: selected?.ClientPrimaryColorcode ?? "#333333",
      ClientSecondaryColorcode: selected?.ClientSecondaryColorcode ?? "#333333",
      PrimaryColorcode: selected?.PrimaryColorcode ?? "#333333",
      SecondaryColorcode: selected?.SecondaryColorcode ?? "#333333",
      activateStatus: selected?.Activatestatus,
    });
    setView(true);
  };
  const onEditSubmit = async () => {
    let submittedData = {
      ...formData,

      BiboRssi_ios: formData.BibobRssi_ios,
    };
    console.log(submittedData);
    const response = await axios.put("UpdateNewClientVenue", { ...submittedData });
    if (response.data === true) {
      const newData = [...data];
      const newIdx = newData.findIndex((item) => item.Id === formData.Id);
      newData[newIdx] = { ...submittedData };
      setData([...newData]);
      onFormCancel();
      successAlert();
    } else {
      failureAlert();
    }
  };
  const tabWiseErrors = [0, 0, 0, 0, 0];
  if (Object.entries(errors).length > 0) {
    window.scrollTo(100, 100);
    if (
      errors?.Clientname ||
      errors?.Clientuuid ||
      errors?.Clientlat ||
      errors?.Clientlng ||
      errors?.Radius ||
      errors?.Serviceinterval
    )
      tabWiseErrors[0] = 1;
    if (errors?.freeticket || errors?.Scaninterval || errors?.Miscfee || errors?.Message) tabWiseErrors[1] = 1;
    if (errors?.Clientimage || errors?.Clientdesc) tabWiseErrors[3] = 1;
    if (errors?.BibobRssi_ios || errors?.Rssi_Ios || errors?.BibobRssi || errors?.Rssvalue) tabWiseErrors[4] = 1;
  }
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item?.Clientname.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialData.current]);
    }
  }, [onSearchText]);
  useEffect(() => {
    const getMuseumData = async () => {
      setLoading(true);
      const response = await axios.get("getVenueDetails?client_id=" + client_id);
      setLoading(false);
      if (response.status === 200) {
        setData([...response.data]);
        initialData.current = [...response.data];
      } else throw new Error();
    };
    try {
      getMuseumData();
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  }, []);
  return (
    <React.Fragment>
      <Head title=" venues"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Venue Data
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
                          placeholder="Search by Client Name"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
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
                      <span>Client Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Latitude {"&"} Longitude</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Status</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>BibobRssi</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>RssValue</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Active Date</span>
                    </DataTableRow>
                    <DataTableRow className="nk-tb-col-tools">
                      <span>Actions</span>
                    </DataTableRow>
                  </DataTableHead>

                  {currentItems.length > 0
                    ? currentItems.map((item) => {
                        return (
                          <DataTableItem key={item.id}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="title">{item.Clientname.length > 0 ? item.Clientname : "NA"}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">
                                {item.Clientlat}
                                <br />
                                {item.Clientlng}
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.Status}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.BibobRssi}</span>
                            </DataTableRow>

                            <DataTableRow>
                              <span className="tb-sub">{item.Rssvalue}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-odr-date">
                                <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                                  {item.Activatedate}
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
                                              onEditClick(item.id);
                                            }}
                                          >
                                            <Icon name="edit-fill"></Icon>
                                            <span>Edit</span>
                                          </DropdownItem>
                                        </li>

                                        {/* <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove </span>
                                          </DropdownItem>
                                        </li> */}
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
                      <span className="text-silent">{isLoading ? <Spinner color="primary" /> : "No Data found"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>
        <Modal isOpen={view} toggle={() => onFormCancel()} className="modal-dialog-centered" size="xl">
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
              <h5 className="title">Edit</h5>
              <form onSubmit={handleSubmit(onEditSubmit)}>
                <PreviewCard>
                  <Nav tabs>
                    {[
                      { title: "Basic", tab: "1" },
                      { title: "Ticket Payment", tab: "2" },
                      { title: "Device Setup", tab: "3" },
                      { title: "Branding", tab: "4" },
                      { title: "Rssi", tab: "5" },
                      { title: "Config", tab: "6" },
                    ].map((item, idx) => (
                      <NavItem style={{ cursor: "pointer" }}>
                        <NavLink
                          className={activeTab === item.tab ? "active" : ""}
                          onClick={() => setActiveTab(item.tab)}
                        >
                          {item.title}
                          {tabWiseErrors[idx] === 1 ? <font color="red">*</font> : null}
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Row>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Clientname" className="form-label">
                              Client Name
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Clientname"
                                name="Clientname"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.Clientname}
                              />
                              {errors.Clientname && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Clientuuid" className="form-label">
                              Client UUID
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Clientuuid"
                                name="Clientuuid"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.Clientuuid}
                              />
                              {errors.Clientuuid && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          <FormGroup>
                            <Label htmlFor="Clientlat" className="form-label">
                              Location
                            </Label>
                            <div className="form-control-wrap">
                              <div className="input-group">
                                <input
                                  ref={register({ required: true })}
                                  type="text"
                                  className="form-control"
                                  name="Clientlat"
                                  id="Clientlat"
                                  onChange={(e) => setFormData((prev) => ({ ...prev, Clientlat: +e.target.value }))}
                                  placeholder="Latitude"
                                  value={formData?.Clientlat}
                                />
                                <input
                                  type="text"
                                  ref={register({ required: true })}
                                  className="form-control"
                                  name="Clientlng"
                                  id="Clientlng"
                                  onChange={(e) => setFormData((prev) => ({ ...prev, Clientlng: +e.target.value }))}
                                  placeholder="Longitude"
                                  value={formData?.Clientlng}
                                />
                                {(errors.Clientlat || errors.Clientlng) && (
                                  <span className="invalid">This field is required</span>
                                )}
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Radius" className="form-label">
                              Radius
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true, min: 0 })}
                                className="form-control"
                                type="number"
                                id="Radius"
                                name="Radius"
                                onChange={(e) => setFormData((prev) => ({ ...prev, Radius: +e.target.value }))}
                                value={formData?.Radius}
                              />
                              {errors.Radius && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Serviceinterval" className="form-label">
                              Serviceinterval
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true, min: 0 })}
                                className="form-control"
                                defaultValue={1}
                                type="number"
                                onChange={(e) => setFormData((prev) => ({ ...prev, Serviceinterval: +e.target.value }))}
                                value={formData?.Serviceinterval}
                                id="Serviceinterval"
                                name="Serviceinterval"
                              />
                              {errors.Serviceinterval && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="status">
                              Status
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  color="primary"
                                  outline={formData?.Status === 0}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Status: 1 }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  color="primary"
                                  outline={formData?.Status === 1}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Status: 0 }));
                                  }}
                                >
                                  Disable
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        {[
                          { title: "Age Verification", name: "AgeVerification" },
                          { title: "Enable Ticket", name: "EnableTicket" },
                          { title: "Enable Trip Planner", name: "EnableTripPlanner" },
                          { title: "Free Ticket", name: "freeticket" },
                        ].map((item) => (
                          <Col sm="3" key={item.name}>
                            <FormGroup>
                              <Label htmlFor={item.name} className="form-label">
                                {item.title}
                              </Label>
                              <div className="form-control-wrap">
                                <div className="custom-control custom-switch">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input form-control"
                                    id={item.name}
                                    name={item.name}
                                    onChange={(e) =>
                                      setFormData((prev) => ({ ...prev, [item.name]: !formData[item.name] }))
                                    }
                                    checked={formData[item.name]}
                                    placeholder=""
                                  />
                                  <label className="custom-control-label" htmlFor={item.name}></label>
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                        ))}
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row className="gy-4">
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Clientpayment" className="form-label">
                              Client Payment
                            </Label>
                            <div className="form-control-wrap">
                              <div className="custom-control custom-switch">
                                <input
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  id="Clientpayment"
                                  name="Clientpayment"
                                  placeholder=""
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      Clientpayment: !formData?.Clientpayment,
                                    }))
                                  }
                                  checked={formData?.Clientpayment}
                                />
                                <label className="custom-control-label" htmlFor="Clientpayment"></label>
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="activateStatus">
                              Activate Status
                            </label>
                            <div className="form-control-wrap">
                              <div className="custom-control custom-switch">
                                <input
                                  ref={register()}
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  id="activateStatus"
                                  name="activateStatus"
                                  checked={formData?.activateStatus}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, activateStatus: !formData?.activateStatus }))
                                  }
                                  placeholder=""
                                />
                                <label className="custom-control-label" htmlFor="activateStatus">
                                  {formData?.activateStatus ? "Active" : "Inactive"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </Col>
                        {/* <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="freeticket" className="form-label">
                              Free Ticket
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true, min: 0 })}
                                className="form-control"
                                type="number"
                                id="freeticket"
                                name="freeticket"
                                onChange={(e) => setFormData((prev) => ({ ...prev, freeticket: +e.target.value }))}
                                value={formData?.freeticket}
                              />
                              {errors.freeticket && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col> */}
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Scaninterval" className="form-label">
                              Scan Interval
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true, min: 0 })}
                                className="form-control"
                                type="number"
                                id="Scaninterval"
                                name="Scaninterval"
                                onChange={(e) => setFormData((prev) => ({ ...prev, Scaninterval: +e.target.value }))}
                                value={formData?.Scaninterval}
                              />
                              {errors.Scaninterval && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Miscfee" className="form-label">
                              Misc Fee
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Miscfee"
                                name="Miscfee"
                                onChange={(e) => setFormData((prev) => ({ ...prev, Miscfee: +e.target.value }))}
                                value={formData?.Miscfee}
                              />
                              {errors.Miscfee && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Message" className="form-label">
                              Activate Status Message
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Message"
                                name="Message"
                                value={formData?.Message ?? "NA"}
                                onChange={(e) => onInputChange(e)}
                              />
                              {errors.Message && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3">
                      <Row className="gy-4">
                        <Col sm="6">
                          <FormGroup>
                            <label className="form-label">A Validation Mode</label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  color="primary"
                                  outline={formData?.Validationmode !== 0}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode: 0 }))}
                                >
                                  Dual Connection
                                </Button>
                                <Button
                                  color="primary"
                                  outline={formData?.Validationmode !== 1}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode: 1 }))}
                                >
                                  MQTT Mode
                                </Button>
                                <Button
                                  color="primary"
                                  outline={formData?.Validationmode !== 2}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode: 2 }))}
                                >
                                  BLE Mode
                                </Button>
                                <Button
                                  color="primary"
                                  outline={formData?.Validationmode !== 3}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode: 3 }))}
                                >
                                  NC
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <FormGroup>
                            <label className="form-label">B Validation Mode</label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  color="primary"
                                  outline={formData?.Validationmode_B !== 0}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode_B: 0 }))}
                                >
                                  Dual Connection
                                </Button>
                                <Button
                                  color="primary"
                                  outline={formData?.Validationmode_B !== 1}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode_B: 1 }))}
                                >
                                  MQTT Mode
                                </Button>
                                <Button
                                  color="primary"
                                  outline={formData?.Validationmode_B !== 2}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode_B: 2 }))}
                                >
                                  BLE Mode
                                </Button>
                                <Button
                                  color="primary"
                                  outline={formData?.Validationmode_B !== 3}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode_B: 3 }))}
                                >
                                  NC
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="12">
                          <ul className="custom-control-group custom-control-vertical w-100">
                            {formData?.Macaddresslist?.length > 0
                              ? formData?.Macaddresslist?.map((item) => (
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio custom-control-pro">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        checked
                                        id={item.Bus_serialno}
                                      />
                                      <label className="custom-control-label" htmlFor="paymentCheck1">
                                        <span>{item.Bus_serialno} </span>
                                      </label>
                                    </div>
                                  </li>
                                ))
                              : null}
                          </ul>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="4">
                      <Row className="gy-4">
                        {[
                          { title: "Client Image URL", name: "Clientimage" },
                          { title: "Client Description", name: "Clientdesc" },
                          { title: "Client Disclaimer", name: "Clientdisclaimer" },
                          { title: "Client Misc Image URL", name: "Clientmiscimage" },
                          { title: "Beverage Instruction Text", name: "BeverageInstructionText" },
                          { title: "Beverage Title", name: "BeverageTitle" },
                        ].map((item) => (
                          <Col sm="6">
                            <FormGroup>
                              <Label htmlFor={item.name} className="form-label">
                                {item.title}
                              </Label>
                              <div className="form-control-wrap">
                                <input
                                  ref={register({ required: true })}
                                  className="form-control"
                                  type="text"
                                  id={item.name}
                                  name={item.name}
                                  onChange={(e) => setFormData((prev) => ({ ...prev, [item.name]: e.target.value }))}
                                  value={formData[item.name] ?? "NA"}
                                />
                                {errors[item.name] && <span className="invalid">This field is required</span>}
                              </div>
                            </FormGroup>
                          </Col>
                        ))}
                        {[
                          { title: "Verification Title", name: "VerificationTitle" },
                          { title: "Verification Sub Title", name: "VerificationSubTitle" },
                          { title: "Verification Description", name: "VerificationDesc" },
                        ].map((item) => (
                          <Col sm="3">
                            <FormGroup>
                              <Label htmlFor={item.name} className="form-label">
                                {item.title}
                              </Label>
                              <div className="form-control-wrap">
                                <input
                                  ref={register({ required: true })}
                                  className="form-control"
                                  type="text"
                                  id={item.name}
                                  name={item.name}
                                  onChange={(e) => setFormData((prev) => ({ ...prev, [item.name]: e.target.value }))}
                                  value={formData[item.name] ?? "NA"}
                                />
                                {errors[item.name] && <span className="invalid">This field is required</span>}
                              </div>
                            </FormGroup>
                          </Col>
                        ))}
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="VerificationStatus" className="form-label">
                              Verification Status
                            </Label>
                            <div className="form-control-wrap">
                              <div className="custom-control custom-switch">
                                <input
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  id="VerificationStatus"
                                  name="VerificationStatus"
                                  onChange={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      VerificationStatus: !formData?.VerificationStatus,
                                    }))
                                  }
                                  checked={formData?.VerificationStatus ?? false}
                                  placeholder=""
                                />
                                <label className="custom-control-label" htmlFor="VerificationStatus"></label>
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                        {[
                          { title: "Primary Color Code", name: "PrimaryColorcode" },
                          { title: "Secondary Color Code", name: "SecondaryColorcode" },
                          { title: "Client Primary Color Code", name: "ClientPrimaryColorcode" },
                          { title: "Client Secondary Color Code", name: "ClientSecondaryColorcode" },
                        ].map((item) => (
                          <Col sm="3" key={item.name}>
                            <FormGroup>
                              <Label htmlFor={item.name} className="form-label">
                                {item.title}
                              </Label>
                              <div className="form-control-wrap" style={{ padding: "0.25rem" }}>
                                <SketchPicker
                                  color={formData[item.name] ?? "#333333"}
                                  onChange={(color, e) => {
                                    setFormData((prevState) => ({ ...prevState, [item.name]: color.hex }));
                                  }}
                                />
                              </div>
                            </FormGroup>
                          </Col>
                        ))}
                        {[
                          { title: "Step 1 Text", name: "Step1Text" },
                          { title: "Step 2 Text", name: "Step2Text" },
                          { title: "Pay Button Text", name: "PayButtonText", defaultText: "Get Ticket" },
                        ].map((item) => (
                          <Col sm="4">
                            <FormGroup>
                              <Label htmlFor={item.name} className="form-label">
                                {item.title}
                              </Label>
                              <div className="form-control-wrap">
                                <input
                                  ref={register({ required: true })}
                                  className="form-control"
                                  type="text"
                                  id={item.name}
                                  onChange={(e) => onInputChange(e)}
                                  value={formData[item.name] ?? "NA"}
                                  name={item.name}
                                />
                                {errors[item.name] && <span className="invalid">This field is required</span>}
                              </div>
                            </FormGroup>
                          </Col>
                        ))}
                        {[
                          { title: "Client Sub Description", name: "ClientSubDesc" },
                          { title: "Order Confirmed Title", name: "Order_confirmed_Title" },
                          { title: "Order Confirmed Subtitle", name: "Order_confirmed_Subtitle" },
                        ].map((item) => (
                          <Col sm="4">
                            <FormGroup>
                              <Label htmlFor={item.name} className="form-label">
                                {item.title}
                              </Label>
                              <div className="form-control-wrap">
                                <input
                                  ref={register({ required: true })}
                                  className="form-control"
                                  type="text"
                                  id={item.name}
                                  name={item.name}
                                  onChange={(e) => onInputChange(e)}
                                  value={formData[item.name] ?? "NA"}
                                />
                                {errors[item.name] && <span className="invalid">This field is required</span>}
                              </div>
                            </FormGroup>
                          </Col>
                        ))}
                        {[
                          { title: "FarepageTitle", name: "FarepageTitle" },
                          { title: "Fare Message", name: "Faremessage" },
                        ].map((item) => (
                          <Col sm="6">
                            <FormGroup>
                              <Label htmlFor={item.name} className="form-label">
                                {item.title}
                              </Label>
                              <div className="form-control-wrap">
                                <input
                                  ref={register({ required: true })}
                                  className="form-control"
                                  type="text"
                                  id={item.name}
                                  onChange={(e) => onInputChange(e)}
                                  value={formData[item.name] ?? "NA"}
                                  name={item.name}
                                />
                                {errors[item.name] && <span className="invalid">This field is required</span>}
                              </div>
                            </FormGroup>
                          </Col>
                        ))}
                      </Row>
                    </TabPane>
                    <TabPane tabId="5">
                      <Row>
                        <Col sm="6">
                          <div className="form-group">
                            <label className="form-label">Android A Range</label>
                            <div className="form-control-wrap">
                              <Nouislider
                                className="form-range-slider"
                                accessibility
                                onChange={(props) => {
                                  let num = `${getRssiValueFromFt(props[0])}`;
                                  setFormData((prev) => ({ ...prev, Rssvalue: num }));
                                }}
                                tooltips={true}
                                padding={1}
                                connect={[true, false]}
                                start={[getFtFromRssiValue(+formData?.Rssvalue)]}
                                step={0.01}
                                range={{
                                  min: 0,
                                  max: 11,
                                }}
                              ></Nouislider>
                              <div className=" d-flex justify-content-between">
                                <span>
                                  {formData?.Rssvalue ? getFtFromRssiValue(+formData?.Rssvalue) + " ( ft )" : "Null"}
                                </span>
                                <div className="d-flex align-items-center">
                                  <label className="m-2">Rssi</label>
                                  <input
                                    type="number"
                                    name="Rssvalue"
                                    ref={register({ required: true })}
                                    value={+formData?.Rssvalue === 0 ? "" : +formData?.Rssvalue}
                                    className="form-control"
                                    onChange={(e) => setFormData((prev) => ({ ...prev, Rssvalue: e.target.value }))}
                                  />
                                  {errors.Rssvalue ? <span className="invalid">Invalid Input </span> : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="form-group">
                            <label className="form-label">Android B Range</label>
                            <div className="form-control-wrap">
                              <Nouislider
                                className="form-range-slider"
                                accessibility
                                onChange={(props) => {
                                  let num = `${getRssiValueFromFt(props[0])}`;
                                  setFormData((prev) => ({ ...prev, BibobRssi: num }));
                                }}
                                tooltips={true}
                                padding={1}
                                connect={[true, false]}
                                start={[getFtFromRssiValue(+formData?.BibobRssi)]}
                                step={0.01}
                                range={{
                                  min: 0,
                                  max: 11,
                                }}
                              ></Nouislider>
                              <div className=" d-flex justify-content-between">
                                <span>
                                  {formData?.BibobRssi ? getFtFromRssiValue(+formData?.BibobRssi) + " ( ft )" : "Null"}
                                </span>
                                <div className="d-flex align-items-center">
                                  <label className="m-2">Rssi</label>
                                  <input
                                    type="number"
                                    name="BibobRssi"
                                    ref={register({ required: true })}
                                    value={+formData?.BibobRssi === 0 ? "" : +formData?.BibobRssi}
                                    className="form-control"
                                    onChange={(e) => setFormData((prev) => ({ ...prev, BibobRssi: e.target.value }))}
                                  />
                                  {errors.BibobRssi ? <span className="invalid">Invalid Input </span> : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="form-group">
                            <label className="form-label">iOS A Range</label>
                            <div className="form-control-wrap">
                              <Nouislider
                                className="form-range-slider"
                                accessibility
                                onChange={(props) => {
                                  let num = `${getRssiValueFromFt(props[0])}`;
                                  setFormData((prev) => ({ ...prev, Rssi_Ios: num }));
                                }}
                                tooltips={true}
                                padding={1}
                                connect={[true, false]}
                                start={[getFtFromRssiValue(+formData?.Rssi_Ios)]}
                                step={0.01}
                                range={{
                                  min: 0,
                                  max: 11,
                                }}
                              ></Nouislider>
                              <div className=" d-flex justify-content-between">
                                <span>
                                  {formData?.Rssi_Ios ? getFtFromRssiValue(+formData?.Rssi_Ios) + " ( ft )" : "Null"}
                                </span>
                                <div className="d-flex align-items-center">
                                  <label className="m-2">Rssi</label>
                                  <input
                                    type="number"
                                    name="Rssi_Ios"
                                    ref={register({ required: true })}
                                    value={+formData?.Rssi_Ios === 0 ? "" : +formData?.Rssi_Ios}
                                    className="form-control"
                                    onChange={(e) => setFormData((prev) => ({ ...prev, Rssi_Ios: e.target.value }))}
                                  />
                                  {errors.Rssi_Ios ? <span className="invalid">Invalid Input </span> : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="form-group">
                            <label className="form-label">iOS B Range</label>
                            <div className="form-control-wrap">
                              <Nouislider
                                className="form-range-slider"
                                accessibility
                                onChange={(props) => {
                                  let num = `${getRssiValueFromFt(props[0])}`;
                                  setFormData((prev) => ({ ...prev, BibobRssi_ios: num }));
                                }}
                                tooltips={true}
                                padding={1}
                                connect={[true, false]}
                                start={[getFtFromRssiValue(+formData?.BibobRssi_ios)]}
                                step={0.01}
                                range={{
                                  min: 0,
                                  max: 11,
                                }}
                              ></Nouislider>
                              <div className=" d-flex justify-content-between">
                                <span>
                                  {formData?.BibobRssi_ios
                                    ? getFtFromRssiValue(+formData?.BibobRssi_ios) + " ( ft )"
                                    : "Null"}
                                </span>
                                <div className="d-flex align-items-center">
                                  <label className="m-2">Rssi</label>
                                  <input
                                    type="number"
                                    name="BibobRssi_ios"
                                    ref={register({ required: true })}
                                    value={+formData?.BibobRssi_ios === 0 ? "" : +formData?.BibobRssi_ios}
                                    className="form-control"
                                    onChange={(e) =>
                                      setFormData((prev) => ({ ...prev, BibobRssi_ios: e.target.value }))
                                    }
                                  />
                                  {errors.BibobRssi_ios ? <span className="invalid">Invalid Input </span> : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="6">
                      <br></br>
                      <Row>
                        <Col sm="3">
                          <Label htmlFor="service_enable" className="form-label">
                            Service Enable
                          </Label>
                          <div className="form-control-wrap">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input form-control"
                                id="service_enable"
                                name="service_enable"
                                placeholder=""
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    service_enable: !formData?.service_enable,
                                  }))
                                }
                                checked={formData?.service_enable}
                              />
                              <label className="custom-control-label" htmlFor="service_enable"></label>
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="ibeacon_Status">
                              IOS iBeacon Status
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.ibeacon_Status === 0}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeacon_Status: 1 }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.ibeacon_Status === 1}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeacon_Status: 0 }));
                                  }}
                                >
                                  Disable
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="ibeaconAndroidStatus">
                              Android iBeacon Status
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.ibeaconAndroidStatus === 0}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeaconAndroidStatus: 1 }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.ibeaconAndroidStatus === 1}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeaconAndroidStatus: 0 }));
                                  }}
                                >
                                  Disable
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="Smart_Venues">
                              Smart Venues
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.Smart_Venues === 0}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Smart_Venues: 1 }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.Smart_Venues === 1}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Smart_Venues: 0 }));
                                  }}
                                >
                                  Disable
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        </Row>
                      <br></br>
                      <Row className="gy-4">
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Avg RSSI Value</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="averageRSSIvalue"
                                name="averageRSSIvalue"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.averageRSSIvalue}
                              />
                              {errors.averageRSSIvalue && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">TX Power</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="tx_power"
                                name="tx_power"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.tx_power}
                              />
                              {errors.tx_power && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Distance</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="distance"
                                name="distance"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.distance}
                              />
                              {errors.distance && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Measure Power</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="measurePower"
                                name="measurePower"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.measurePower}
                              />
                              {errors.measurePower && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Power Value</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="powerValue"
                                name="powerValue"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.powerValue}
                              />
                              {errors.powerValue && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Distance Times</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="distanceTimes"
                                name="distanceTimes"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.distanceTimes}
                              />
                              {errors.distanceTimes && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="Frequency_Interval_Line">Freq Interval Line</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Frequency_Interval_Line"
                                name="Frequency_Interval_Line"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.Frequency_Interval_Line}
                              />
                              {errors.Frequency_Interval_Line && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="Frequency_Interval_Realtime_Bus">Freq Interval Realtime Bus</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Frequency_Interval_Realtime_Bus"
                                name="Frequency_Interval_Realtime_Bus"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.Frequency_Interval_Realtime_Bus}
                              />
                              {errors.Frequency_Interval_Realtime_Bus && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        
                      </Row>
                      <br></br>
                      <Row className="gy-4">
                        <Col sm="3">
                            <div className="form-group">
                              <label className="form-label">BLE Rssi 4</label>
                              <div className="form-control-wrap">
                                <input
                                  ref={register({ required: true })}
                                  className="form-control"
                                  type="text"
                                  id="ble_rssi_4"
                                  name="ble_rssi_4"
                                  onChange={(e) => onInputChange(e)}
                                  value={formData?.ble_rssi_4}
                                />
                                {errors.ble_rssi_4 && <span className="invalid">This field is required</span>}
                              </div>
                            </div>
                          </Col>
                          <Col sm="3">
                            <div className="form-group">
                              <label className="form-label">BLE Rssi 5a</label>
                              <div className="form-control-wrap">
                                <input
                                  ref={register({ required: true })}
                                  className="form-control"
                                  type="text"
                                  id="ble_rssi_5a"
                                  name="ble_rssi_5a"
                                  onChange={(e) => onInputChange(e)}
                                  value={formData?.ble_rssi_5a}
                                />
                                {errors.ble_rssi_5a && <span className="invalid">This field is required</span>}
                              </div>
                            </div>
                          </Col>
                          <Col sm="3">
                            <div className="form-group">
                              <label className="form-label">BLE Rssi 5b</label>
                              <div className="form-control-wrap">
                                <input
                                  ref={register({ required: true })}
                                  className="form-control"
                                  type="text"
                                  id="ble_rssi_5b"
                                  name="ble_rssi_5b"
                                  onChange={(e) => onInputChange(e)}
                                  value={formData?.ble_rssi_5b}
                                />
                                {errors.ble_rssi_5b && <span className="invalid">This field is required</span>}
                              </div>
                            </div>
                          </Col>
                          <Col sm="3">
                            <div className="form-group">
                              <label className="form-label">BLE Rssi 5c</label>
                              <div className="form-control-wrap">
                                <input
                                  ref={register({ required: true })}
                                  className="form-control"
                                  type="text"
                                  id="ble_rssi_5c"
                                  name="ble_rssi_5c"
                                  onChange={(e) => onInputChange(e)}
                                  value={formData?.ble_rssi_5c}
                                />
                                {errors.ble_rssi_5c && <span className="invalid">This field is required</span>}
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <hr className="preview-hr"></hr>
                      <BlockTitle tag="h5">Suggested Route</BlockTitle>
                      <Row className="gy-4">
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Uber_Status" className="form-label">
                              Uber Status
                            </Label>
                            <div className="form-control-wrap">
                              <div className="custom-control custom-switch">
                                <input
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  id="Uber_Status"
                                  name="Uber_Status"
                                  placeholder=""
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      Uber_Status: !formData?.Uber_Status,
                                    }))
                                  }
                                  checked={formData?.Uber_Status}
                                />
                                <label className="custom-control-label" htmlFor="Uber_Status">
                                  {formData?.Uber_Status ? "True" : "False"}
                                </label>
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="Lyft_Status">
                              Lyft Status
                            </label>
                            <div className="form-control-wrap">
                              <div className="custom-control custom-switch">
                                <input
                                  ref={register()}
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  id="Lyft_Status"
                                  name="Lyft_Status"
                                  checked={formData?.Lyft_Status}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, Lyft_Status: !formData?.Lyft_Status }))
                                  }
                                  placeholder=""
                                />
                                <label className="custom-control-label" htmlFor="Lyft_Status">
                                  {formData?.Lyft_Status ? "True" : "False"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="Louvelo_Status">
                              Louvelo Status
                            </label>
                            <div className="form-control-wrap">
                              <div className="custom-control custom-switch">
                                <input
                                  ref={register()}
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  id="Louvelo_Status"
                                  name="Louvelo_Status"
                                  checked={formData?.Louvelo_Status}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, Louvelo_Status: !formData?.Louvelo_Status }))
                                  }
                                  placeholder=""
                                />
                                <label className="custom-control-label" htmlFor="Louvelo_Status">
                                  {formData?.Louvelo_Status ? "True" : "False"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="Enable_Payment">
                              Enable Payment
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.Enable_Payment === 0}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Enable_Payment: 1 }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.Enable_Payment === 1}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Enable_Payment: 0 }));
                                  }}
                                >
                                  Disable
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="Microtransit_Full_Trip">
                              Microtransit Full Trip
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.Microtransit_Full_Trip === 0}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Microtransit_Full_Trip: 1 }));
                                  }}
                                >
                                  Show
                                </Button>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.Microtransit_Full_Trip === 1}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Microtransit_Full_Trip: 0 }));
                                  }}
                                >
                                  Hide
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="Microtransit_First_Mile">
                              Microtransit First Mile
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.Microtransit_First_Mile === 0}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Microtransit_First_Mile: 1 }));
                                  }}
                                >
                                  Show
                                </Button>
                                <Button type="button"
                                  color="primary"
                                  outline={formData?.Microtransit_First_Mile === 1}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Microtransit_First_Mile: 0 }));
                                  }}
                                >
                                  Hide
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        {/* <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="freeticket" className="form-label">
                              Free Ticket
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true, min: 0 })}
                                className="form-control"
                                type="number"
                                id="freeticket"
                                name="freeticket"
                                onChange={(e) => setFormData((prev) => ({ ...prev, freeticket: +e.target.value }))}
                                value={formData?.freeticket}
                              />
                              {errors.freeticket && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col> */}
                        </Row>
                        <hr className="preview-hr"></hr>
                      <BlockTitle tag="h5">Permission</BlockTitle>
                      <Row className="gy-4">
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="Force_Permission">
                              Force Permission
                            </label>
                            <div className="form-control-wrap">
                              <div className="custom-control custom-switch">
                                <input
                                  ref={register()}
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  id="Force_Permission"
                                  name="Force_Permission"
                                  checked={formData?.Force_Permission}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, Force_Permission: !formData?.Force_Permission }))
                                  }
                                  placeholder=""
                                />
                                <label className="custom-control-label" htmlFor="Force_Permission">
                                  {formData?.Force_Permission ? "True" : "False"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Permission_Title" className="form-label">
                              Permission Title
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Permission_Title"
                                name="Permission_Title"
                                value={formData?.Permission_Title ?? "NA"}
                                onChange={(e) => onInputChange(e)}
                              />
                              {errors.Permission_Title && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Permission_Message" className="form-label">
                              Permission Message
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Permission_Message"
                                name="Permission_Message"
                                value={formData?.Permission_Message ?? "NA"}
                                onChange={(e) => onInputChange(e)}
                              />
                              {errors.Permission_Message && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <Label htmlFor="Permission_Description" className="form-label">
                              Permission Description
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Permission_Description"
                                name="Permission_Description"
                                value={formData?.Permission_Description ?? "NA"}
                                onChange={(e) => onInputChange(e)}
                              />
                              {errors.Permission_Description && <span className="invalid">This field is required</span>}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </PreviewCard>
                <hr className="preview-hr"></hr>
                <Row className="g-3">
                  <Col lg="7" className="offset-lg-5">
                    <FormGroup className="mt-2">
                      <Button color="primary" size="lg" type="submit">
                        Update
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </form>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default MuseumData;
