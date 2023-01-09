import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
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
import { FormGroup, Label } from "reactstrap";
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

const ClientsNew = () => {
  //States that we are displaying
  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [data, setData] = useState([]);
  const [clientLoading, setClientLoading] = useState(false);
  //States that are used as initial form data formdata
  const [clientStatus, setClientStatus] = useState(false);
  const [homePage, setHomepage] = useState(null);
  const homePageRef = useRef(""); // When homepage changes automatically on unchecking page options
  const [selectedPg, setSelectedPg] = useState([]);
  //Other states
  const initialClients = useRef([]); //  ---->  Used with searchText
  const [error, setError] = useState(false); // ----> Used in err handling with api response
  const [sm, updateSm] = useState(false); // ----> Responsiveness
  const [editClient, setEditClient] = useState({
    // ----> Edit form default values;
    userName: "",
    venueName: "",
    email: "",
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);

  const resetForm = () => {
    setEditClient({ userName: "", venueName: "", email: "" });
  };
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const onChangeHandler = (id) => {
    if (selectedPg.includes(id)) {
      let newData = [...selectedPg];
      newData.splice(newData.indexOf(id), 1);
      setSelectedPg([...newData]);
    } else {
      let newData = [...selectedPg];
      newData.push(id);
      setSelectedPg(newData);
    }
  };
  const onEditSubmit = () => {
    let submittedData;
    let newItems = data;
    let index = newItems.findIndex((item) => item.id === editId);
    newItems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          client_id: item.id,
          status: clientStatus,
          Homepage: +homePageRef.current.value === 0 ? null : +homePageRef.current.value,
        };
      }
    });
    axios
      .put("EditClientStatus", { ...submittedData })
      .then((res) => {
        if (res.status === 200) {
          axios.post("AssignpageAccess", { client_id: submittedData.client_id, pages: selectedPg }).then((res) => {
            if (res.status === 201) {
              newItems[index] = {
                ...newItems[index],
                status: submittedData.status,
                Homepage: submittedData.Homepage,
                pages: selectedPg,
              };
              setData(newItems);
              onFormCancel();
            }
          });
        }
      })
      .catch((err) => {
        window.alert("Error in updating");
      });
  };

  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setEditClient({
          userName: item.username,
          venueName: item.venue,

          email: item.email,
        });
        setHomepage(item.Homepage);
        setClientStatus(item.status);
        setSelectedPg([...item.pages]);
      }
    });
    setEditedId(id);

    setView({ add: false, edit: true });
  };

  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
  };

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { errors, register, handleSubmit } = useForm();

  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item.userName.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialClients.current]);
    }
  }, [onSearchText]);
  useEffect(() => {
    const getClients = async () => {
      const response = await axios.get("iot/getAllClients");
      if (response.status === 200) {
        const clients = [...response.data];
        let pendingClients = [];
        let approvedClients = [];
        clients.forEach((item) => {
          if (item.status) approvedClients.push(item);
          else pendingClients.push(item);
        });
        setData([...pendingClients, ...approvedClients]);
        initialClients.current = [...response.data];
      } else throw new Error();
    };
    try {
      setClientLoading(true);
      getClients().finally(() => {
        setClientLoading(false);
      });
    } catch (err) {
      setError(true);
    }
  }, []);
  useEffect(() => {
    setPagesLoading(true);
    axios
      .get("getListOfPages")
      .then((res) => {
        if (res.status === 200) setPages([...res.data]);
        else throw new Error();
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setPagesLoading(false);
      });
  }, []);
  return (
    <React.Fragment>
      <Head title="Clients New"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Clients
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
                      {/* <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Venues</span>
                      </Button> */}
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
                      <span>Client ID</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Approved</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Email</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Venue Name</span>
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
                                {/* <img src={item.ImageURL} alt="product" className="thumb" /> */}
                                <span className="title">{item.id}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow>
                              <span className="tb-sub">{item.username}</span>
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
                              <span className="tb-sub">{item.email}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.venue}</span>
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
                                              toggle("edit");
                                            }}
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Edit Client</span>
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
                        {clientLoading ? <Spinner color="primary" /> : "No Clients found"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
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
              <h5 className="title">Update Client Details</h5>

              <div className="mt-4">
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    onEditSubmit();
                  }}
                >
                  <Row className="g-3">
                    <Col size="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Name
                        </label>
                        <div className="form-control-wrap">
                          <input
                            readOnly
                            type="text"
                            className="form-control"
                            name="userName"
                            value={editClient.userName}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col size="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Venue Name
                        </label>
                        <div className="form-control-wrap">
                          <input
                            readOnly
                            type="text"
                            className="form-control"
                            name="venueName"
                            value={editClient.venueName}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="price">
                          Email
                        </label>
                        <div className="form-control-wrap">
                          <input readOnly type="text" name="email" value={editClient.email} className="form-control" />
                        </div>
                      </div>
                    </Col>
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
                                setClientStatus((prevState) => !prevState);
                              }}
                              checked={clientStatus}
                              id="status"
                              name="status"
                            />
                            <label className="custom-control-label" htmlFor="status">
                              {clientStatus ? "Approved" : "Pending"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <FormGroup>
                        <Label htmlFor="default-0" className="form-label">
                          Page Options
                        </Label>
                        <Row className="gy-1">
                          {!pagesLoading &&
                            pages.length > 0 &&
                            pages.map((page, index) => (
                              <Col sm="6" key={page.id}>
                                <div className="form-control-wrap">
                                  <div className="custom-control custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input form-control"
                                      onChange={() => onChangeHandler(page.id)}
                                      checked={selectedPg.includes(page.id)}
                                      id={page.id}
                                    />
                                    <label className="custom-control-label" htmlFor={page.id}>
                                      {page.pages}
                                    </label>
                                  </div>
                                </div>
                              </Col>
                            ))}
                          <Col sm="12">
                            <Button
                              color="primary"
                              outline
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedPg([1, 5, 6, 7, 8, 9, 12]);
                              }}
                            >
                              Set Default
                            </Button>
                          </Col>
                          {pagesLoading && (
                            <Col sm="6">
                              <div>
                                <Spinner color="primary" />
                              </div>
                            </Col>
                          )}
                        </Row>
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup>
                        <label className="form-label" htmlFor="defaultHomepage">
                          Default Homepage
                        </label>
                        <div className="form-control-wrap">
                          <div className="form-control-select">
                            <Input
                              type="select"
                              name="defaultHomepage"
                              id="defaultHomepage"
                              disabled={selectedPg.length === 0}
                              value={homePage}
                              innerRef={homePageRef}
                              onChange={(e) => setHomepage(e.target.value)}
                            >
                              {selectedPg.map((item) => {
                                const pg = pages.find((page) => page.id === item);
                                return (
                                  <option value={pg.id} key={pg.id}>
                                    {pg.pages}
                                  </option>
                                );
                              })}
                            </Input>
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col size="12">
                      <Button color="primary" type="submit">
                        <Icon className="plus"></Icon>
                        <span>Update Client</span>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default ClientsNew;
