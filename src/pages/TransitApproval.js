import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import "moment-timezone";
import Moment from "react-moment";
import Head from "../layout/head/Head";
import Swal from "sweetalert2";
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
import { useSelector } from "react-redux";
import { user_id, role } from "../redux/userSlice";
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
} from "reactstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

const TransitApproval = () => {
  const client_id = useSelector(user_id);
  const client_role = useSelector(role);
  const INITIAL_EDIT_FORM = {
    id: null,
    client_id: client_id,
    businessName: "",
    address: "",
    city: "",
    gtfsFileURL: "",
    vehiclePositionURL: "",
    tripUpdateURL: "",
    alertsURL: "",
    bikeShare: false,
    bikeShareName: "",
    bikeShareURL: "",
    rideShare: false,
    rideShareName: "",
    rideShareURL: "",
    microTransit: false,
    microTransitName: "",
    microTransitURL: "",
    paraTransit: false,
    paraTransitName: "",
    paraTransitURL: "",
    BibobRssi: null,
    Rssvalue: null,
    status: false,
  };
  const [data, setData] = useState([]);
  const initialData = useRef([]);
  const initialEditForm = useRef({});
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sm, updateSm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_EDIT_FORM);

  const [editId, setEditedId] = useState();
  const [view, setView] = useState(false);
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  console.log(data);
  const pendingAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Approval Pending",
      text: "Waiting for approval.",
      showConfirmButton: true,
    });
  };
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFormCancel = () => {
    setView(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData(INITIAL_EDIT_FORM);
  };

  const onEditSubmit = () => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === editId);
    axios.put("EditTransitClient", { ...formData }).then((res) => {
      console.log(res);
      console.log("status ===== " + formData.status);
      if (res.status === 200) {
        newData[index] = { ...res.data };
        axios.put("UpdateTransitStatus", { status: formData.status, transit_id: formData.id }).then((res) => {
          if (res.status === 200) {
            newData[index] = { ...res.data };
            setData([...newData]);
            resetForm();
            setView(false);
          }
        });
      } else {
        window.alert("Error in updating transit data");
      }
    });
  };

  const onEditClick = (id) => {
    const selected = data.find((i) => i.id === id);
    console.log("Role is " + client_role);
    if (client_role === 3) {
      //   pendingAlert();

      let editFormData = {
        id: selected.id,
        client_id: selected.client_id,
        businessName: selected.businessName,
        address: selected.address,
        city: selected.city,
        gtfsFileURL: selected.gtfsFileURL,
        vehiclePositionURL: selected.vehiclePositionURL,
        tripUpdateURL: selected.tripUpdateURL,
        alertsURL: selected.alertsURL,
        bikeShare: selected.bikeShare,
        bikeShareName: selected.bikeShareName,
        bikeShareURL: selected.bikeShareURL,
        rideShare: selected.rideShare,
        rideShareName: selected.rideShareName,
        rideShareURL: selected.rideShareURL,
        microTransit: selected.microTransit,
        microTransitName: selected.microTransitName,
        microTransitURL: selected.microTransitURL,
        paraTransit: selected.paraTransit,
        paraTransitName: selected.paraTransitName,
        paraTransitURL: selected.paraTransitURL,
        BibobRssi: selected.BibobRssi,
        Rssvalue: selected.Rssvalue,
        status: selected.status,
      };
      setFormData({
        ...editFormData,
      });
      initialEditForm.current = { ...editFormData };
      setEditedId(selected.id);
      setView(true);
    }
  };

  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { errors, register, handleSubmit } = useForm();

  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item.businessName.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialData.current]);
    }
  }, [onSearchText]);
  useEffect(() => {
    const getTransitData = async () => {
      const response = await axios.get("getClientTransitData");
      if (response.status === 200) {
        setData([...response.data]);
        initialData.current = [...response.data];
      } else throw new Error();
    };
    try {
      setLoading(true);
      getTransitData();
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  }, []);

  return (
    <React.Fragment>
      <Head title="Beverages"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Transit Approval
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
                          placeholder="Search by name"
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
                      <span>Business Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>City</span>
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
                      <span>Added Date</span>
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
                                <span className="title">{item.businessName.length > 0 ? item.businessName : "NA"}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.city}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">
                                {item.status ? (
                                  <Badge pill color="success">
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge pill color="danger">
                                    Pending
                                  </Badge>
                                )}
                              </span>
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
                                              onEditClick(item.id);
                                            }}
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Edit/View Transit Data</span>
                                          </DropdownItem>
                                        </li>

                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove Transit Data</span>
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
                      <span className="text-silent">{isLoading ? <Spinner /> : "No products found"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>
        <Modal isOpen={view} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
              <h5 className="title">Update Transit Data</h5>
              <div className="mt-4">
                <form noValidate onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    {editTextFields.map((item, idx) => (
                      <Col size="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor={item.name}>
                            {item.title}
                          </label>
                          <div className="form-control-wrap">
                            <input
                              type="text"
                              className="form-control"
                              name={item.name}
                              id={item.name}
                              onChange={(e) => onInputChange(e)}
                              ref={register({
                                required: "This field is required",
                              })}
                              defaultValue={formData[item.name] ?? ""}
                            />
                            {errors[item.name] && <span className="invalid">{errors[item.name].message}</span>}
                          </div>
                        </div>
                      </Col>
                    ))}
                    {editDropdownOptions.map((item) => (
                      <Col sm="6" key={item.title}>
                        <label className="form-label" htmlFor="range">
                          {item.title}
                        </label>
                        <div className="form-control-wrap">
                          <div className="form-control-select">
                            <Input
                              type="select"
                              name={item.name}
                              id={item.name}
                              defaultValue={formData[item.name]}
                              onChange={(e) =>
                                setFormData((prevState) => ({ ...prevState, [item.name]: e.target.value }))
                              }
                            >
                              <option value={-60}>3 ft</option>
                              <option value={-50}>1 ft</option>
                              <option value={-55}>2 ft</option>
                              <option value={-65}>4 ft</option>
                              <option value={-70}>5 ft</option>
                              <option value={-75}>6 ft</option>
                              <option value={-80}>7 ft</option>
                              <option value={-85}>8 ft</option>
                              <option value={-90}>9 ft</option>
                              <option value={-95}>10 ft</option>
                            </Input>
                          </div>
                        </div>
                      </Col>
                    ))}
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="status">
                          Status
                        </label>
                        <div className="form-control-wrap">
                          <div className="custom-control custom-switch">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              onChange={(event) => {
                                setFormData((prevState) => ({ ...prevState, status: !formData.status }));
                              }}
                              checked={formData.status}
                              defaultChecked={formData.status}
                              id="status"
                              name="status"
                            />

                            <label className="custom-control-label" htmlFor="status">
                              {formData.status ? "Approved" : "Pending"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </Col>

                    {editRideModes.map((item) => (
                      <Col sm="12" key={item.title}>
                        <label htmlFor="default-0" className="form-label">
                          {item.title}
                        </label>
                        <Row>
                          <Col sm="4">
                            <div className="form-control-wrap">
                              <div className="custom-control custom-switch">
                                <input
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  id={item.value}
                                  name={item.value}
                                  checked={formData[item.value]}
                                  onChange={(event) => {
                                    console.log(event);
                                    setFormData((prevState) => ({
                                      ...prevState,
                                      [item.value]: !prevState[item.value],
                                      [item.name]: prevState[item.value] ? "" : prevState[item.name],
                                      [item.url]: prevState[item.value] ? "" : prevState[item.url],
                                    }));
                                  }}
                                  placeholder=""
                                />

                                <label className="custom-control-label" htmlFor={item.value}></label>
                              </div>
                            </div>
                          </Col>
                          <Col sm="4">
                            <div className="input-group input-group-md">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-md">
                                  Name
                                </span>
                              </div>
                              <input
                                ref={register({ required: formData[item.value] })}
                                type="text"
                                name={item.name}
                                value={formData[item.name]}
                                onChange={(event) =>
                                  setFormData((prevState) => ({ ...prevState, [item.name]: event.target.value }))
                                }
                                className="form-control"
                              />
                              {errors[item.name] && <span className="invalid">This field is required</span>}
                            </div>
                          </Col>
                          <Col sm="4">
                            <div className="input-group input-group-md">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-md">
                                  URL
                                </span>
                              </div>
                              <input
                                ref={register({ required: formData[item.value] })}
                                type="text"
                                className="form-control"
                                name={item.url}
                                value={formData[item.url]}
                                onChange={(event) =>
                                  setFormData((prevState) => ({ ...prevState, [item.url]: event.target.value }))
                                }
                              />
                              {errors[item.name] && <span className="invalid">This field is required</span>}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    ))}
                  </Row>
                  <Row className="g-3">
                    <Col lg="7" className="offset-lg-5">
                      <Button color="primary" size="lg" type="submit">
                        Save
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
const editTextFields = [
  { name: "businessName", title: "Business Name" },
  { name: "address", title: "Address" },
  { name: "city", title: "City" },
  { name: "gtfsFileURL", title: "GTFS File URL" },
  { name: "vehiclePositionURL", title: "Vehicle Position URL" },
  { name: "tripUpdateURL", title: "Trip Update URL" },
  { name: "alertsURL", title: "Alerts URL" },
];
const editRideModes = [
  { title: "Bike Share", value: "bikeShare", name: "bikeShareName", url: "bikeShareURL" },
  { title: "Ride Share", value: "rideShare", name: "rideShareName", url: "rideShareURL" },
  { title: "Micro Transit", value: "microTransit", name: "microTransitName", url: "microTransitURL" },
  { title: "Para Transit", value: "paraTransit", name: "paraTransitName", url: "paraTransitURL" },
];
const editDropdownOptions = [
  { title: "Validation Range", name: "Rssvalue" },
  { title: "BibobRssi", name: "BibobRssi" },
];
export default TransitApproval;
