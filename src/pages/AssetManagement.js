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
  const INITIAL_ADD_FORM = {
    id: "",
    clientId: "",
    venueRef: "",
    headers: "",
    title: "",
    imageurl: "",
    desc: "",
    beverageMac: "",
    readmore: "",
    added_date: "",
  };

  const TABLE_HEADING = [
    {
      name: "Heading",
      value: "headers",
    },
    {
      name: "Title",
      value: "title",
    },
    {
      name: "Imageurl",
      value: "imageurl",
    },
    {
      name: "Description",
      value: "desc",
    },
    {
      name: "Read More URL",
      value: "readmore",
    },
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
    const response = await axios.get("getcms");
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
                Asset Management
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
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => setShowModal({ add: true, edit: false })}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Asset</span>
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
                      <span>ID</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Heading</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Title</span>
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
                          <DataTableItem key={item.id}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="title">{item.id}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow>
                              <span className="tb-sub">{item.headers}</span>
                            </DataTableRow>

                            <DataTableRow>
                              <span className="tb-sub">{item.title}</span>
                            </DataTableRow>
                            {/* <DataTableRow size="md">
                              <span className="tb-odr-date">
                                <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                                  {item.Date}
                                </Moment>
                              </span>
                            </DataTableRow> */}
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
              <h5 className="title">{showModal.add ? "Add Asset" : "Edit Asset"}</h5>
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
                        {showModal.add ? "Add Asset" : "Edit Asset"}
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
