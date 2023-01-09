import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  BlockDes,
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
  Badge,
  Modal,
  ModalBody,
  Spinner,
  Input,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import axios from "axios";

const Venue = () => {
  const client_id = useSelector(user_id);
  const INITIAL_ADD_FORM = {
    category: null,
    client_id: client_id,
    itemName: "",
    price: null,
    itemDescription: "",
    ImageURL: "",
    status: false,
  };
  const [data, setData] = useState([]);
  const initialBev = useRef([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sm, updateSm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_ADD_FORM);
  const [categories, setCategories] = useState([]);

  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const [files, setFiles] = useState([]);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = () => {
    setFormData(INITIAL_ADD_FORM);
  };

  const onFormSubmit = () => {
    const form = { ...formData, client_id: client_id };
    axios
      .post("AddMenuItems", form)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setData([res.data, ...data]);
          resetForm();
          setView({ edit: false, add: false });
        } else throw new Error();
      })
      .catch((err) => {
        window.alert("Error in input fields");
      });
  };

  const onEditSubmit = () => {
    let submittedData;
    let newItems = data;
    let index = newItems.findIndex((item) => item.id === editId);
    newItems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          id: editId,
          category: formData.category,
          itemName: formData.itemName,
          price: formData.price,
          status: formData.status,
          itemDescription: formData.itemDescription,
          ImageURL: formData.ImageURL,
        };
      }
    });
    axios
      .post("EditMenuItems", { ...submittedData })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          newItems[index] = submittedData;
          setData(newItems);
          resetForm();
          setView({ edit: false, add: false });
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        window.alert("Error in updating");
      });
  };

  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setFormData({
          itemName: item.itemName,
          ImageURL: item.ImageURL,
          itemDescription: item.itemDescription,
          status: item.status,
          price: item.price,
          category: item.category,
        });
      }
    });
    setEditedId(id);

    setView({ add: false, edit: true });
  };

  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  const deleteProduct = (id) => {
    axios
      .delete("DeleteMenuItem", { data: { id: parseInt(id) } })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          let defaultData = data;
          defaultData = defaultData.filter((item) => item.id !== id);
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

  const fetchCategories = async () => {
    const response = await axios.get("getCategories");
    setCategories([...response.data]);
    return [...response.data];
  };
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item.itemName.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialBev.current]);
    }
  }, [onSearchText]);
  useEffect(() => {
    const getBeverages = async () => {
      const response = await axios.get("GetMenuListClientID?client_id=" + client_id);
      if (response.status === 200) {
        setData([...response.data]);
        initialBev.current = [...response.data];
      } else throw new Error();
    };
    try {
      setLoading(true);
      getBeverages();
    } catch (err) {
      setError(true);
    }
    setLoading(false);
    console.log(data);
  }, []);
  useEffect(() => {
    fetchCategories().then((res) => {
      setFormData({ ...formData, category: res[0]?.id ?? null });
    });
  }, []);
  return (
    <React.Fragment>
      <Head title="Venues"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Venue 
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
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Venues</span>
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
                      <span>Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Price</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Status</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Category</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Description</span>
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
                                <img src={item.ImageURL} alt="product" className="thumb" />
                                <span className="title">{item.itemName}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow>
                              <span className="tb-sub">$ {item.price}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">
                                {item.status ? (
                                  <Badge pill color="success">
                                    Availabe
                                  </Badge>
                                ) : (
                                  <Badge pill color="danger">
                                    Unavailable
                                  </Badge>
                                )}
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.category}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-sub">{item.itemDescription}</span>
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
                                            <span>Edit Product</span>
                                          </DropdownItem>
                                        </li>

                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              deleteProduct(item.id);
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
                      <span className="text-silent">{isLoading ? <Spinner /> : "No products found"}</span>
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
              <h5 className="title">Update Beverage</h5>
              <div className="mt-4">
                <form noValidate onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Beverage Name
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="itemName"
                            onChange={(e) => onInputChange(e)}
                            ref={register({
                              required: "This field is required",
                            })}
                            defaultValue={formData.itemName}
                          />
                          {errors.itemName && <span className="invalid">{errors.itemName.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="price">
                          Regular Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            name="price"
                            onChange={(e) => onInputChange(e)}
                            value={formData.price}
                            ref={register({ required: "This is required" })}
                            className="form-control"
                            defaultValue={formData.price}
                          />
                          {errors.price && <span className="invalid">{errors.price.message}</span>}
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
                                setFormData((prevState) => ({ ...prevState, status: !formData.status }));
                              }}
                              checked={formData.status}
                              defaultChecked={formData.status}
                              id="status"
                              name="status"
                            />
                            <label className="custom-control-label" htmlFor="status">
                              {formData.status ? "Availabe" : "Not Available"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="itemName">
                          Item Description
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="itemDescription"
                            value={formData.itemDescription}
                            defaultValue={formData.itemDescription}
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This is required" })}
                          />
                          {errors.itemDescription && <span className="invalid">{errors.itemDescription.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category">
                          Category
                        </label>
                        <div className="form-control-wrap">
                          <div className="form-control-select">
                            <Input
                              type="select"
                              name="category"
                              id="category"
                              disabled={categories.length === 0}
                              value={formData.category ?? ""}
                              onChange={(e) => onInputChange(e)}
                              defaultValue={categories.find((item) => item.id === formData.category)?.id ?? null}
                            >
                              {categories.length > 0 &&
                                categories.map((item) => (
                                  <option key={item?.id} value={item?.id}>
                                    {item?.categories}
                                  </option>
                                ))}
                            </Input>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="imageUrl">
                          Image URL
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="ImageURL"
                            value={formData.ImageURL}
                            defaultValue={formData.ImageURL}
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: "This is required" })}
                          />
                          {errors.imageUrl && <span className="invalid">{errors.imageUrl.message}</span>}
                        </div>
                      </div>
                    </Col>

                    <Col size="12">
                      <Button color="primary" type="submit">
                        <Icon className="plus"></Icon>
                        <span>Update Product</span>
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
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Add Beverage</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="beverage-name">
                      Item Name
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="itemName"
                        onChange={(e) => onInputChange(e)}
                        value={formData.itemName}
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.itemName && <span className="invalid">{errors.itemName.message}</span>}
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
                            setFormData((prevState) => ({ ...prevState, status: !formData.status }));
                          }}
                          checked={formData.status}
                          id="status"
                          name="status"
                        />
                        <label className="custom-control-label" htmlFor="status">
                          {formData.status ? "Availabe" : "Not Available"}
                        </label>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="sale-price">
                      Price
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        className="form-control"
                        name="price"
                        value={formData.price ?? 0}
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                      />
                      {errors.price && <span className="invalid">{errors.price.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="itemName">
                      Item Description
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="itemDescription"
                        value={formData.itemDescription}
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                      />
                      {errors.itemDescription && <span className="invalid">{errors.itemDescription.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <label className="form-label" htmlFor="category">
                    Category
                  </label>
                  <div className="form-control-wrap">
                    <div className="form-control-select">
                      <Input
                        type="select"
                        name="category"
                        id="category"
                        disabled={categories.length === 0}
                        value={formData.category ?? ""}
                        onChange={(e) => onInputChange(e)}
                      >
                        {categories.length > 0 &&
                          categories.map((item) => (
                            <option key={item?.id} value={item?.id}>
                              {item?.categories}
                            </option>
                          ))}
                      </Input>
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="imageUrl">
                      Image URL
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="ImageURL"
                        value={formData.ImageURL}
                        onChange={(e) => onInputChange(e)}
                        ref={register({ required: "This is required" })}
                      />
                      {errors.imageUrl && <span className="invalid">{errors.imageUrl.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col size="12">
                  <Button color="primary" type="submit">
                    <Icon className="plus"></Icon>
                    <span>Add Product</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar>

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default Venue;
