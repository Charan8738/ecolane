import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import Moment from "react-moment";
import SimpleBar from "simplebar-react";
import Head from "../layout/head/Head";
import DatePicker from "react-datepicker";
import { FormGroup, Label } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTickets,
  getTicketsError,
  getTicketsStatus,
  selectAllTickets,
  selectAPICount,
} from "../redux/ticketsSlice";

import {
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
import { user_id, username } from "../redux/userSlice";
import {
  Card,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  Modal,
  ModalBody,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import AddProductModalThree from "../components/AddProductModal/AddProductModalThree";
import axios from "axios";
import { useForm } from "react-hook-form";
const Venue = () => {
  const RideID = useSelector(user_id);

  const status = useSelector(getTicketsStatus);
  const dispatch = useDispatch(); //dispatch to change values in store

  const client_id = useSelector(user_id);
  const client_name = useSelector(username);
  const [categories, setCategories] = useState([]);
  const date = new Date();
  const daysAgo = new Date(date.getTime());
  daysAgo.setDate(date.getDate() - 2);

  const INITIAL_ADD_FORM2 = {
    RideName: "",
    RideID: "",
    DeviceIDIN: "",
    DeviceIDOUT: "",
    AvgWaitTime: "",
    CurrentTokenNo: "",
    SlotsAvailable: true,
    RequestedSlotToken: "",
    ExceptionMessage: "",
    Creditperdollar: "",
    ridecount: "",
  };
  const [formData, setFormData] = useState(INITIAL_ADD_FORM2);
  //  const onFormCancel = () => {
  //   setView({ edit: false, add: false, details: false });
  //   resetForm();
  // };
  //  const resetForm = () => {
  //   setFormData(INITIAL_ADD_FORM);
  // };

  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
  };

  //const data = [];
  const [onSearchText, setSearchText] = useState("");
  const initialData = useRef([]);
  const [data, setData] = useState([]);
  const { errors, register, handleSubmit } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [sm, updateSm] = useState(false); // ----> Responsivenes
  const [editId, setEditedId] = useState();
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const url = "https://zig-web.com/Zigsmartandroid/api/FirmwareV2/GetRideInfo";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json.Data);
        //data = json.Data;
        setData(json.Data);
        initialData.current = [...json.Data];
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };
  const resetForm = () => {
    setFormData(INITIAL_ADD_FORM2);
  };
  const [startDate, setStartDate] = useState(new Date());
  function onChangeDateHandler(value) {
    setStartDate(value);
  }
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((items) => {
        return items.RideName.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialData.current]);
    }
  }, [onSearchText]);
  const onEditClick = (RideID) => {
    data.forEach((item) => {
      if (item.RideID === RideID) {
        setFormData({
          RideName: item.RideName,
          AvgWaitTime: item.AvgWaitTime,
          SlotsAvailable: item.SlotsAvailable,
          ExceptionMessage: item.ExceptionMessage,
          RideID: item.RideID,
          DeviceIDIN: item.DeviceIDIN,
          DeviceIDOUT: item.DeviceIDOUT,
          CurrentTokenNo: item.CurrentTokenNo,
          RequestedSlotToken: item.RequestedSlotToken,
          Creditperdollar: item.Creditperdollar,
          ridecount: item.ridecount,
        });
      }
    });
    setEditedId(RideID);

    setView({ add: false, edit: true });
  };
  const onEditSubmit = async () => {
    try {
      const userToPost = {
        //FareId: editId,
        RideName: formData.RideName,
        AvgWaitTime: formData.AvgWaitTime,
        SlotsAvailable: formData.SlotsAvailable,
        ExceptionMessage: formData.ExceptionMessage,
        RideID: formData.RideID,
        DeviceIDIN: formData.DeviceIDIN,
        DeviceIDOUT: formData.DeviceIDOUT,
        CurrentTokenNo: formData.CurrentTokenNo,
        RequestedSlotToken: formData.RequestedSlotToken,
        Creditperdollar: formData.Creditperdollar,
        ridecount: formData.ridecount,
      };
      const res = await axios.put("UpdateRide", userToPost);
      // const res = await axios.post("new/updateFares", { ...formData, Farename: formData.RouteName });
      console.log(res);
      if (res.status === 201) {
        const index = data.findIndex((item) => item.RideID === editId);
        let newItems = [...data];
        newItems[index] = { ...newItems[index], ...formData };
        setData(newItems);
        resetForm();
        setView({ edit: false, add: false });
      } else {
        throw new Error();
      }
    } catch (err) {
      window.alert("Error in updating");
    }
  };

  const deleteProduct = (RideID) => {
    axios
      .delete("DeleteRide?RideID=", +RideID)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          let defaultData = data;
          defaultData = defaultData.filter((item) => item.RideID !== RideID);
          setData([...defaultData]);
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        window.alert("Error in deleting beverage");
      });
    //
  };
  const postNewProduct = (form) => {
    //console.log(form);

    axios
      .post("AddRide", form)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          setData([{ ...res.data }, ...data]);
          resetForm();
          setView({ edit: false, add: false });
        } else throw new Error();
      })
      .catch((err) => {
        window.alert("SUCCESSFULLY ADDED");
      });
  };
  const onFormSubmit = (data) => {
    postNewProduct(data);
  };
  return (
    <React.Fragment>
      <Head title="Venues"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                <div className="title">Ride Information</div>
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
                          placeholder="Search by Ride Name"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
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
                        <span>Add Ride</span>
                      </Button>
                    </li>
                    <li></li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow size="sm">
                  <span>Ride Name</span>
                </DataTableRow>
                <DataTableRow>
                  <span> Average Wait Time</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Slots Availabe</span>
                </DataTableRow>
                <DataTableRow>
                  <span> Exception Message</span>
                </DataTableRow>

                <DataTableRow size="md">
                  <span> Ride ID</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>DeviceIDIN</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>DeviceIDOUT</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Current Token no</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Requested Slot Tokens</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Credits per dollar</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Ride Count</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Actions</span>
                </DataTableRow>
              </DataTableHead>
              {currentItems.length > 0
                ? currentItems.map((item) => {
                    return (
                      <DataTableItem key={item.RideID}>
                        <DataTableRow>
                          <span className="tb-sub"> {item.RideName}</span>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <span className="tb-product">
                            <span className="title">{item.AvgWaitTime}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span className="tb-sub">{item.SlotsAvailable}</span>
                        </DataTableRow>

                        <DataTableRow size="md">
                          <span className="tb-sub">{item.ExceptionMessage}</span>
                        </DataTableRow>

                        <DataTableRow>
                          <span className="tb-sub">{item.RideID}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-sub">{item.DeviceIDIN}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-sub">{item.DeviceIDOUT}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-sub">{item.CurrentTokenNo}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-sub">{item.RequestedSlotToken}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-sub">{item.Creditperdollar}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-sub">{item.ridecount}</span>
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
                                          onEditClick(item.RideID);
                                          toggle("edit");
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit Product</span>
                                      </DropdownItem>
                                    </li>

                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#remove"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          deleteProduct(item.RideID);
                                        }}
                                      >
                                        <Icon name="trash"></Icon>
                                        <span>Remove Product</span>
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
                  <span className="text-silent">{isLoading ? <Spinner /> : "No payments found"}</span>
                </div>
              )}
            </div>
          </Card>
        </Block>
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
            <div className="p-2">
              <h5 className="title">Update Ride</h5>
              <div className="mt-4">
                <form onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="beverage-name">
                          Ride Name
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="RideName"
                            onChange={(e) => onInputChange(e)}
                            value={formData.RideName}
                            ref={register({
                              required: true,
                            })}
                          />
                          {errors.RideName && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>

                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="beverage-name">
                          Average Wait Time
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className="form-control"
                            name="AvgWaitTime"
                            value={formData.AvgWaitTime}
                            onChange={(e) => onInputChange(e)}
                            ref={register({
                              required: true,
                            })}
                          />
                          {errors.AvgWaitTime && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>

                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="newCategory">
                          Slots Available
                        </label>

                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="SlotsAvailable"
                            onChange={(e) => onInputChange(e)}
                            value={formData.SlotsAvailable}
                            ref={register({ required: true })}
                          />
                          {errors.SlotsAvailable && <span className="invalid">This field is required</span>}
                        </div>

                        <label style={{ paddingTop: 20 }} className="form-label" htmlFor="BannerImageURL">
                          Exception Message
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="ExceptionMessage"
                            value={formData.ExceptionMessage}
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: true })}
                          />
                          {errors.ExceptionMessage && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>

                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ProductImageURL">
                          Ride ID
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="RideID"
                            value={formData.RideID}
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: true })}
                          />
                          {errors.RideID && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ProductImageURL">
                          Device id IN
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="DeviceIDIN"
                            onChange={(e) => onInputChange(e)}
                            value={formData.DeviceIDIN}
                            ref={register({
                              required: true,
                            })}
                          />
                          {errors.DeviceIDIN && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ProductImageURL">
                          Device id OUT
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="DeviceIDOUT"
                            onChange={(e) => onInputChange(e)}
                            value={formData.DeviceIDOUT}
                            ref={register({
                              required: true,
                            })}
                          />
                          {errors.DeviceIDOUT && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ProductImageURL">
                          Current Token No
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="CurrentTokenNo"
                            onChange={(e) => onInputChange(e)}
                            value={formData.CurrentTokenNo}
                            ref={register({
                              required: true,
                            })}
                          />
                          {errors.CurrentTokenNo && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ProductImageURL">
                          Requested Slot Token
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="RequestedSlotToken"
                            onChange={(e) => onInputChange(e)}
                            value={formData.RequestedSlotToken}
                            ref={register({
                              required: true,
                            })}
                          />
                          {errors.RequestedSlotToken && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ProductImageURL">
                          Credit per dollar
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="Creditperdollar"
                            onChange={(e) => onInputChange(e)}
                            value={formData.Creditperdollar}
                            ref={register({
                              required: true,
                            })}
                          />
                          {errors.Creditperdollar && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ProductImageURL">
                          Ride Count
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="ridecount"
                            onChange={(e) => onInputChange(e)}
                            value={formData.ridecount}
                            ref={register({
                              required: true,
                            })}
                          />
                          {errors.ridecount && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>

                    <Col size="12">
                      <Button color="primary" type="submit">
                        <Icon className="plus"></Icon>
                        <span>Add Ride</span>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${
            view.add ? "content-active" : ""
          }`}
        >
          {<AddProductModalThree client_id={client_id} client_name={client_name} onFormSubmit={onFormSubmit} />}
        </SimpleBar>
        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default Venue;
