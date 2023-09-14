import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import "moment-timezone";
import { Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label, ButtonGroup,Badge } from "reactstrap";
import Moment from "react-moment";
import Nouislider from "nouislider-react";
import classNames from "classnames";
import Swal from "sweetalert2";
import { SketchPicker } from "react-color";
import { toast } from "react-toastify";
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
  CheckboxRadio,
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
import './total.css'
const successAlert = () => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Venue updated successfully",
  });
};
const successAuthAlert = () => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Authenticated successfully",
  });
};
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const CustomAuthToast = () => {
  return (
    <div className="toastr-text">
      <h5>Authenticated Successfully</h5>
      <p>Your have Access to update.</p>
    </div>
  );
};
const messageAuthToast = () => {
  toast.success(<CustomAuthToast />, {
    position: "bottom-right",
    autoClose: true,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: false,
    closeButton: <CloseButton />,
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
const failureAuthAlert = () => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Authentication Failed",
    showConfirmButton: false,
    timer: 1500,
  });
};
const AllVenues = () => {
  const client_id = useSelector(user_id);
  const [formData, setFormData] = useState({});
  const [authFormData, setAuthFormData] = useState({});

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [approvedChecked, setApprovedChecked] = useState(false);
  const [pendingChecked, setPendingChecked] = useState(false);
  const [enabledChecked, setEnabledChecked] = useState(false);
  const [disabledChecked, setDisabledChecked] = useState(false);
  const handleApprovedChange = () => {
    setApprovedChecked(!approvedChecked);
  };
  const handlePendingChange = () => {
    setPendingChecked(!pendingChecked);
  };
  const handleApprovedChange2 = () => {
    setEnabledChecked(!enabledChecked);
  };
  const handlePendingChange2 = () => {
    setDisabledChecked(!disabledChecked);
  };
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
  const onAuthFormCancel = () => {
    setShowAuthModal(false);
    setAuthFormData({});
  };
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onAuthInputChange = (e) => {
    setAuthFormData({ ...authFormData, [e.target.name]: e.target.value });
    console.log(authFormData);
  };

  const resetForm = () => {
    setFormData({});
  };
  const onFilterChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    if (e.nativeEvent.inputType === "deleteContentBackward" && searchText.length === 0) {
      setData([...initialData.current]);
    } else {
      const filteredData = initialData.current.filter((item) =>
        item.Clientname.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    }
  };
  const onEditClick = (id) => {
    console.log(id);
    const selected = data.find((i) => i.Id === id);
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

  const checkAuthentication = async () => {
    // if (activeTab && !isAuthenticated) {
    setShowAuthModal(true);
    //   console.log("Not Authenticated, Please Authenticate");
    //   return false;
    // }

    console.log("Authenticated!");
    //return true;
  };

  const onAuthSubmit = () => {
    //console.log(authFormData.userName);
    if (
      authFormData.userName.toLowerCase() === "Karthik@zed.digital".toLowerCase() &&
      authFormData.userPasscode === "Polgara!@12"
    ) {
      console.log("Authenticated Successfully");
      setShowAuthModal(false);
      messageAuthToast();
      onEditSubmit();
    } else {
      console.log("Authentication has Failed");
      failureAuthAlert();
    }
  };

  const onEditSubmit = async () => {
    let submittedData = {
      ...formData,

      BiboRssi_ios: formData.BibobRssi_ios,
    };
    console.log(submittedData);
    const response = await axios.put("UpdateClientConfiguration", { ...submittedData });
    if (response.data === true) {
      const newData = [...data];
      const newIdx = newData.findIndex((item) => item.Id === formData.Id);
      newData[newIdx] = { ...submittedData };
      setData([...newData]);
      onFormCancel();
      const refresh2 = await axios.get("ResetConfigSettingNew");
      const refresh1 = await axios.get("ResetConfigSetting");

      const refresh3 = await axios.get("ConfigAPIV2ios/api/Client/ResetConfigSettingNew");
      const refresh4 = await axios.get("ConfigAPIV2ios/api/Client/ResetConfigSetting");

      if (refresh1.status && refresh2.status && refresh3.status && refresh4.status) {
        successAlert();
      }
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
    setCurrentPage(1)
  }, [onSearchText]);
  
  
  useEffect(() => {
    const getMuseumData = async () => {
      setLoading(true);
      const response = await axios.get("Getallclientconfig");
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
  useEffect(() => {
    let filteredData = [...initialData.current];
  
    if (approvedChecked && !pendingChecked) {
      filteredData = filteredData.filter((item) => item.Status);
    } else if (!approvedChecked && pendingChecked) {
      filteredData = filteredData.filter((item) => !item.Status);
    }
  
    if (enabledChecked && !disabledChecked) {
      filteredData = filteredData.filter((item) => item.Smart_Venues);
    } else if (!enabledChecked && disabledChecked) {
      filteredData = filteredData.filter((item) => !item.Smart_Venues);
    }
  
    setData(filteredData);
    setCurrentPage(1);
  }, [approvedChecked, pendingChecked, enabledChecked, disabledChecked]);
  return (  
    <React.Fragment>
      <Head title=" venues"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Venues Config
              </BlockTitle>
              <div className="checkbox-container">
  <div className="checkbox">
    <div className="select">
      <h6>Status :</h6>
    </div>
    <input type="checkbox"  checked={approvedChecked} onChange={handleApprovedChange} />
    <label style={{ marginLeft: '3px' }}>Active</label>
    <input style={{ marginLeft: '11px' }} type="checkbox" checked={pendingChecked} onChange={handlePendingChange} />
    <label style={{ marginLeft: '3px' }}>Inactive</label>
  </div>
  <div className="checkbox">
    <div className="select">
      <h6>Smart Venues :</h6>
    </div>
    <input type="checkbox" checked={enabledChecked} onChange={handleApprovedChange2} />
    <label style={{ marginLeft: '3px' }}>Enabled</label>
    <input style={{ marginLeft: '11px' }} type="checkbox" checked={disabledChecked} onChange={handlePendingChange2} />
    <label style={{ marginLeft: '3px' }}>Disabled</label>
  </div>
</div>

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
              <table style={{ width: "100%", tableLayout: "auto", textAlign: "center" }} className="table">
                  <thead className="table-light">
                    <tr>
                      <th className="d-none d-md-table-cell">Client Name</th>
                      <th className="d-none d-md-table-cell">Latitude {"&"} Longitude</th>
                      <th className="d-none d-sm-table-cell">Status</th>
                      <th classname="d-none d-sm-table-cell">Smart Venues</th> 
                      
                      <th className="d-none d-sm-table-cell">Active Date</th>
                      <th className="d-none d-sm-table-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody>

                    {currentItems.length > 0
                      ? currentItems.map((item,idx) => {
                        return (
                          <tr key={idx} className="tb-tnx-item">
                            <td style={{ padding: "0.75rem 0.25rem" }} >

                              <strong>{item.Clientname.length > 0 ? item.Clientname : "NA"}</strong>
                            </td>

                            <td style={{ padding: "0.75rem 0.25rem" }}>

                              {item.Clientlat}
                              <br />
                              {item.Clientlng}
                            </td>

                            <td style={{ padding: "0.75rem 0.25rem" }}>
                              {item.Status ? (
                                
                                <Badge pill color="success">
                                   <strong>
                                  Active
                                  </strong>
                                </Badge>
                               
                              ) : (
                                <Badge pill color="warning">
                                  inactive
                                </Badge>
                              )}
                            </td>
                             <td style={{padding: "0.75rem 0.25rem"}}>
                            {item.Smart_Venues ? (
                                <Badge pill color="success">
                                  Enabled
                                </Badge>
                              ) : (
                                <Badge pill color="warning ">
                                  Disabled
                                </Badge>
                              )}

                            </td> 
                            
                            <td style={{ padding: "0.75rem 0.25rem" }}>

                              <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                                {item.Activatedate}
                              </Moment>
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
                                        href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          onEditClick(item.Id);
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

                            </td>
                          </tr>
                        );
                      })
                      : null}
                  </tbody>
                </table>

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
        <Modal
          isOpen={view}
          toggle={() => onFormCancel()}
          style={{ zIndex: 1000 }}
          className="modal-dialog-centered"
          size="xl"
        >
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
              <form onSubmit={handleSubmit(checkAuthentication)}>
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
                                  type="button"
                                  color="primary"
                                  outline={formData?.Status === 0}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Status: 1 }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
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
                                  type="button"
                                  color="primary"
                                  outline={formData?.Validationmode !== 0}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode: 0 }))}
                                >
                                  Dual Connection
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Validationmode !== 1}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode: 1 }))}
                                >
                                  MQTT Mode
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Validationmode !== 2}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode: 2 }))}
                                >
                                  BLE Mode
                                </Button>
                                <Button
                                  type="button"
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
                                  type="button"
                                  color="primary"
                                  outline={formData?.Validationmode_B !== 0}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode_B: 0 }))}
                                >
                                  Dual Connection
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Validationmode_B !== 1}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode_B: 1 }))}
                                >
                                  MQTT Mode
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Validationmode_B !== 2}
                                  onClick={() => setFormData((prev) => ({ ...prev, Validationmode_B: 2 }))}
                                >
                                  BLE Mode
                                </Button>
                                <Button
                                  type="button"
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
                        <Col sm="4">
                          <FormGroup>
                            <label className="form-label" htmlFor="ibeacon_Status">
                              IOS iBeacon Status
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.ibeacon_Status === 2 || formData?.ibeacon_Status === 3}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeacon_Status: 1 }));
                                  }}
                                >
                                  Immediate
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.ibeacon_Status === 1 || formData?.ibeacon_Status === 3}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeacon_Status: 2 }));
                                  }}
                                >
                                  Near
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.ibeacon_Status === 1 || formData?.ibeacon_Status === 2}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeacon_Status: 3 }));
                                  }}
                                >
                                  Far
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="4">
                          <FormGroup>
                            <label className="form-label" htmlFor="ibeaconAndroidStatus">
                              Android iBeacon Status
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={
                                    formData?.ibeaconAndroidStatus === "2" || formData?.ibeaconAndroidStatus === "3"
                                  }
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeaconAndroidStatus: "1" }));
                                  }}
                                >
                                  Immediate
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={
                                    formData?.ibeaconAndroidStatus === "1" || formData?.ibeaconAndroidStatus === "3"
                                  }
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeaconAndroidStatus: "2" }));
                                  }}
                                >
                                  Near
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={
                                    formData?.ibeaconAndroidStatus === "1" || formData?.ibeaconAndroidStatus === "2"
                                  }
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, ibeaconAndroidStatus: "3" }));
                                  }}
                                >
                                  Far
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <br></br>
                      <Row className="gy-4">
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="Smart_Venues">
                              Smart Venues
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Smart_Venues === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Smart_Venues: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Smart_Venues === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Smart_Venues: false }));
                                  }}
                                >
                                  Disable
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="Frequency_Interval_Line">
                              Freq Interval Line
                            </label>
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
                              {errors.Frequency_Interval_Line && (
                                <span className="invalid">This field is required</span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="Frequency_Interval_Realtime_Bus">
                              Freq Interval Realtime Bus
                            </label>
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
                              {errors.Frequency_Interval_Realtime_Bus && (
                                <span className="invalid">This field is required</span>
                              )}
                            </div>
                          </div>
                        </Col>
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
                      </Row>
                      <br></br>
                      <Row className="gy-4">
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
                      </Row>
                      <br></br>
                      <Row className="gy-4">
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
                          <FormGroup>
                            <label className="form-label" htmlFor="acknowledgement">
                              Acknowledgement
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.acknowledgement === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, acknowledgement: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.acknowledgement === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, acknowledgement: false }));
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
                            <label className="form-label" htmlFor="scanMode">
                              Scan Mode
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.scanMode === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, scanMode: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.scanMode === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, scanMode: false }));
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
                            <label className="form-label" htmlFor="analyticlal">
                              Analytical Data
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.analyticlal === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, analyticlal: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.analyticlal === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, analyticlal: false }));
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
                            <label className="form-label">Immediate range/mts</label>
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
                            <label className="form-label">Near range/mts</label>
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
                      <br></br>
                      <Row className="gy-4">
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="forceupdate">
                              Force Update
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.forceupdate === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, forceupdate: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.forceupdate === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, forceupdate: false }));
                                  }}
                                >
                                  Disable
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Force Update Title</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="forceUpdateTitle"
                                name="forceUpdateTitle"
                                onChange={(e) => onInputChange(e)}
                                value="10"
                              />
                              {errors.forceUpdateTitle && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Force Update Description</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="forceUpdateDescription"
                                name="forceUpdateDescription"
                                onChange={(e) => onInputChange(e)}
                                value="10"
                              />
                              {errors.forceUpdateDescription && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Android Version Number</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="androidVersionNumber"
                                name="androidVersionNumber"
                                onChange={(e) => onInputChange(e)}
                                value="10"
                              />
                              {errors.androidVersionNumber && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">IOS Version Number</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="iOSVersionNumber"
                                name="iOSVersionNumber"
                                onChange={(e) => onInputChange(e)}
                                value="10"
                              />
                              {errors.iOSVersionNumber && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Menu Item</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="menuitem"
                                name="menuitem"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.menuitem}
                              />
                              {errors.menuitem && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">Here Api Key</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="Here_api_key"
                                name="Here_api_key"
                                onChange={(e) => onInputChange(e)}
                                value={formData?.Here_api_key}
                              />
                              {errors.Here_api_key && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <div className="form-group">
                            <label className="form-label">QOS</label>
                            <div className="form-control-wrap">
                              <input
                                ref={register({ required: true })}
                                className="form-control"
                                type="text"
                                id="QOS"
                                name="QOS"
                                onChange={(e) => onInputChange(e)}
                                value="10"
                              />
                              {errors.QOS && <span className="invalid">This field is required</span>}
                            </div>
                          </div>
                        </Col>
                        <Col sm="3">
                          <FormGroup>
                            <label className="form-label" htmlFor="sos">
                              SOS
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.sos === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, sos: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.sos === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, sos: false }));
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
                            <label className="form-label" htmlFor="stop">
                              Stop
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.stop === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, stop: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.stop === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, stop: false }));
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
                            <label className="form-label" htmlFor="screen_wake_status">
                              Screen Wake Status
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.screen_wake_status === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, screen_wake_status: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.screen_wake_status === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, screen_wake_status: false }));
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
                            <label className="form-label" htmlFor="alarm_service">
                              Alarm Service
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.alarm_service === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, alarm_service: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.alarm_service === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, alarm_service: false }));
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
                          <FormGroup>
                            <label className="form-label" htmlFor="auto_validation_feature">
                              Auto Validation
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.auto_validation_feature === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, auto_validation_feature: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.auto_validation_feature === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, auto_validation_feature: false }));
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
                            <label className="form-label" htmlFor="visitorOccupency">
                              Visitor Occupancy
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.visitorOccupency === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, visitorOccupency: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.visitorOccupency === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, visitorOccupency: false }));
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
                            <label className="form-label" htmlFor="beverageStatus">
                              Beverage Status
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.beverageStatus === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, beverageStatus: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.beverageStatus === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, beverageStatus: false }));
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
                            <label className="form-label" htmlFor="wallet">
                              Wallet
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.wallet === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, wallet: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.wallet === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, wallet: false }));
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
                          <FormGroup>
                            <label className="form-label" htmlFor="tripPlannerStatus">
                              Trip Planner Status
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.tripPlannerStatus === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, tripPlannerStatus: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.tripPlannerStatus === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, tripPlannerStatus: false }));
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
                            <label className="form-label" htmlFor="rewardsStatus">
                              Rewards Status
                            </label>
                            <div className="form-control-wrap">
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.rewardsStatus === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, rewardsStatus: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.rewardsStatus === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, rewardsStatus: false }));
                                  }}
                                >
                                  Disable
                                </Button>
                              </ButtonGroup>
                            </div>
                          </FormGroup>
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
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Enable_Payment === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Enable_Payment: true }));
                                  }}
                                >
                                  Enable
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Enable_Payment === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Enable_Payment: false }));
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
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Microtransit_Full_Trip === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Microtransit_Full_Trip: true }));
                                  }}
                                >
                                  Show
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Microtransit_Full_Trip === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Microtransit_Full_Trip: false }));
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
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Microtransit_First_Mile === false}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Microtransit_First_Mile: true }));
                                  }}
                                >
                                  Show
                                </Button>
                                <Button
                                  type="button"
                                  color="primary"
                                  outline={formData?.Microtransit_First_Mile === true}
                                  onClick={(e) => {
                                    setFormData((prev) => ({ ...prev, Microtransit_First_Mile: false }));
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
                        <Col sm="6">
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
                        <Col sm="12">
                          <FormGroup>
                            <Label htmlFor="Permission_Description" className="form-label">
                              Permission Description
                            </Label>
                            <div className="form-control-wrap">
                              <textarea
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
        <Modal
          isOpen={showAuthModal}
          toggle={() => onAuthFormCancel()}
          style={{ zIndex: 5000 }}
          className="modal-dialog-centered"
          size="m"
        >
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onAuthFormCancel();
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Authentication</h5>
              <form onSubmit={handleSubmit(onAuthSubmit)}>
                <FormGroup>
                  <Label htmlFor="userName" className="form-label">
                    User Name
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true })}
                      className="form-control"
                      type="text"
                      id="userName"
                      name="userName"
                      onChange={(e) => onAuthInputChange(e)}
                      // value={formData?.userName}
                    />
                    {errors.userName && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="userPasscode" className="form-label">
                    Password
                  </Label>
                  <div className="form-control-wrap">
                    <input
                      ref={register({ required: true })}
                      className="form-control"
                      type="password"
                      id="userPasscode"
                      name="userPasscode"
                      onChange={(e) => onAuthInputChange(e)}
                      //value={formData?.userPasscode}
                    />
                    {errors.userPasscode && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
                <FormGroup className="mt-2">
                  <Button color="primary" size="lg" type="submit">
                    Submit
                  </Button>
                </FormGroup>
              </form>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default AllVenues;   