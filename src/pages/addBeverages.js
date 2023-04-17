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
import AddProductModal from "../components/AddProductModal/AddProductModal";
import { useSelector } from "react-redux";
import { user_id, username } from "../redux/userSlice";
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
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddBeverages = () => {
  const client_id = useSelector(user_id);
  const client_name = useSelector(username);
  const PRODUCT_VEG_CATEGORIES = [
    { id: 0, type: "None" },
    { id: 1, type: "Eats - Veg" },
    { id: 2, type: "Eats - Non-Veg" },
    { id: 4, type: "Beverage" },
    { id: 5, type: "Ticket" },
  ];
  const INITIAL_ADD_FORM = {
    Type: "None",
    CategoryId: "New",
    RouteName: "",
    FareAmount: 0,
    createdby: client_name,
    LastUpdatedBy: client_name,
    ProductDescription: "",
    ProductImageURL: "",
    isActive: false,
    AgencyId: client_id,
    ZoneId: 1,
    Farename: "",
    MaxCount: 1,
    ProductMiscDescription: "",
    VerificationStatus: 0,
    PaymentMode: 0,
    ProductCost: 0,
    ProductVegCategory: 0,
  };
  const [newCategoryEdit, setNewCategoryEdit] = useState({
    CategoryName: "",
    CategoryImageURL: "",
    BannerImageURL: "",
  });
  const [isAdded, setIsAdded] = useState(0);
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

  const postNewProduct = (form, categName) => {
    form.Farename = form.RouteName;
    axios
      .post("Fare/Post", form)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          setData([{ ...res.data, Category: categName }, ...data]);
          resetForm();
          setIsAdded((prev) => prev + 1);
          setView({ edit: false, add: false });
        } else throw new Error();
      })
      .catch((err) => {
        window.alert("Error in input fields");
      });
  };
  const onFormSubmit = (data) => {
    const { formData, newCategory } = data;
    const form = { ...formData };
    if (form.CategoryId === "New") {
      axios
        .post("addCateg", {
          CategoryName: newCategory.newCategoryName,
          AgencyId: client_id,
          CreatedBy: client_name,
          LastUpdatedBy: client_name,
          IsActive: true,
          CategoryImage: newCategory.CategoryImageURL,
          BannerImage: newCategory.BannerImageURL,
        })
        .then((res) => {
          if (res.status === 200) {
            postNewProduct({ ...form, CategoryId: res.data.CategoryId }, newCategory.newCategoryName);
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          window.alert("Error in adding beverages");
        });
    } else {
      const categName = categories.find((item) => item.CategoryId === form.CategoryId).CategoryName;
      postNewProduct({ ...form }, categName);
    }
  };
  const isCategoryChanged = () => {
    const category = categories.find((item) => item.CategoryId === formData.CategoryId);
    if (
      category.CategoryName !== newCategoryEdit.CategoryName ||
      category.CategoryImage !== newCategoryEdit.CategoryImageURL ||
      category.BannerImage !== newCategoryEdit.BannerImageURL
    )
      return true;
    return true;
  };
  const postEditProduct = async (formData, categName) => {
    const res = await axios.post("new/updateFares", formData);
    if (res.status === 200) {
      const index = data.findIndex((item) => item.FareId === editId);
      let newItems = [...data];
      newItems[index] = { ...newItems[index], ...res.data };
      // console.log(newItems);
      setData(newItems);
      // setData([{ ...res.data, Category: categName }, ...data]);
      resetForm();
      setIsAdded((prev) => prev + 1);
      setView({ edit: false, add: false });
    } else {
      throw new Error();
    }
  };
  const onEditSubmit = async () => {
    try {
      const editFormData = {
        FareId: editId,
        FareAmount: formData.FareAmount,
        CategoryId: formData.CategoryId,
        RouteName: formData.RouteName,
        isActive: formData.isActive,
        createdby: formData.createdby,
        LastUpdatedDate: null,
        LastUpdatedBy: formData.LastUpdatedBy,
        AgencyId: client_id,
        Type: formData.Type,
        ZoneId: 1,
        Farename: formData.RouteName,
        MaxCount: formData.MaxCount,
        ProductDescription: formData.ProductDescription,
        ProductMiscDescription: "",
        VerificationStatus: formData.VerificationStatus,
        PaymentMode: formData.PaymentMode,
        ProductCost: formData.FareAmount,
        ProductVegCategory: formData.ProductVegCategory,
        ProductImageURL: formData.ProductImageURL,
      };
      const editFormData2 = {
        CategoryId: formData.CategoryId,
        CategoryName: newCategoryEdit.CategoryName,
        IsActive: true,
        CreatedBy: formData.createdby,
        LastUpdatedBy: formData.LastUpdatedBy,
        AgencyId: client_id,
        CategoryImage: newCategoryEdit.CategoryImageURL,
        BannerImage: newCategoryEdit.BannerImageURL,
      };
      if (isCategoryChanged()) {
        axios.put("UpdateCateg", editFormData2).then((res) => {
          postEditProduct(editFormData, newCategoryEdit.CategoryName);
        });
      } else {
        postEditProduct(editFormData, newCategoryEdit.CategoryName);
      }
    } catch (err) {
      window.alert("Error in updating");
    }
  };

  const onEditClick = (FareId) => {
    data.forEach((item) => {
      if (item.FareId === FareId) {
        setFormData({
          FareId: FareId,
          CategoryId: item.CategoryId,
          createdby: item.createdby,
          LastUpdatedBy: item.LastUpdatedBy,
          AgencyId: item.AgencyId,
          ZoneId: item.ZoneId,
          Farename: item.Farename,
          MaxCount: item.MaxCount,
          ProductMiscDescription: item.ProductMiscDescription,
          VerificationStatus: item.VerificationStatus,
          PaymentMode: item.PaymentMode,
          ProductCost: item.ProductCost,
          ProductVegCategory: item.ProductVegCategory,
          RouteName: item.RouteName,
          ProductImageURL: item.ProductImageURL,
          ProductDescription: item.ProductDescription,
          isActive: item.isActive,
          FareAmount: item.FareAmount,
          Type: item.Type,
        });
      }
    });
    setEditedId(FareId);

    setView({ add: false, edit: true });
  };

  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  const deleteProduct = (FareId) => {
    axios
      .delete("DeleteMenuItem", { data: { FareId: parseInt(FareId) } })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          let defaultData = data;
          defaultData = defaultData.filter((item) => item.FareId !== FareId);
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
  console.log(isLoading);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { errors, register, handleSubmit } = useForm();
  const fetchCategories = async () => {
    const response = await axios.get("getCategory?client_id=" + client_id);
    setCategories([...response.data]);
    return [...response.data];
  };
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item.RouteName.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialBev.current]);
    }
  }, [onSearchText]);
  useEffect(() => {
    const getBeverages = async () => {
      setLoading(true);
      const catResponse = await axios.get("getCategory?client_id=" + client_id);
      setCategories([...catResponse.data]);
      const response = await axios.get("getFares?client_id=" + client_id);
      setLoading(false);
      if (response.status === 200) {
        setData([...response.data.list]);
        initialBev.current = [...response.data.list];
      } else throw new Error();
    };

    try {
      getBeverages();
    } catch (err) {
      setError(true);
    }
  }, [isAdded]);
  useEffect(() => {
    fetchCategories().then((res) => {
      setFormData({ ...formData });
    });
  }, []);
  useEffect(() => {
    let categDetails = categories.find((i) => i.CategoryId === formData.CategoryId);
    if (categDetails) {
      setNewCategoryEdit({
        CategoryName: categDetails?.CategoryName,
        CategoryImageURL: categDetails?.CategoryImage,
        BannerImageURL: categDetails?.BannerImage,
      });
    }
  }, [formData.CategoryId]);
  return (
    <React.Fragment>
      <Head title="Beverages"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Add Product
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
                        <span>Add Product</span>
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
                          <DataTableItem key={item.FareId}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <img src={item.ProductImageURL} alt="product" className="thumb" />
                                <span className="title">{item.RouteName}</span>
                              </span>
                            </DataTableRow>

                            <DataTableRow>
                              <span className="tb-sub">$ {item.FareAmount}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">
                                {item.isActive ? (
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
                              <span className="tb-sub">{item.Category}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-sub">{item.ProductDescription}</span>
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
                                              onEditClick(item.FareId);
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
                                              deleteProduct(item.FareId);
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
                      <span className="text-silent">
                        {isLoading ? <Spinner color="primary" /> : "No products found"}
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
              <h5 className="title">Update Product</h5>
              <div className="mt-4">
                <form onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Products Name
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="RouteName"
                            onChange={(e) => onInputChange(e)}
                            ref={register({
                              required: true,
                            })}
                            value={formData.RouteName ?? ""}
                          />
                          {errors.RouteName && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="FareAmount">
                          Regular Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            name="FareAmount"
                            onChange={(e) => onInputChange(e)}
                            value={formData.FareAmount}
                            ref={register({ required: true })}
                            className="form-control"
                          />
                          {errors.FareAmount && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>

                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="isActive1">
                          Status
                        </label>
                        <div className="form-control-wrap">
                          <div className="custom-control custom-switch">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id="isActive1"
                              name="isActive1"
                              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                              checked={formData.isActive}
                              placeholder=""
                            />
                            <label className="custom-control-label" htmlFor="isActive1">
                              {formData?.isActive}
                            </label>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="MaxCount1">
                          Max Count
                        </label>
                        <div className="form-control-wrap">
                          <div className="custom-control custom-switch">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id="MaxCount1"
                              name="MaxCount1"
                              onChange={(event) =>
                                setFormData((prevState) => ({ ...prevState, MaxCount: 1 - prevState.MaxCount }))
                              }
                              checked={formData.MaxCount === 1}
                            />
                            <label className="custom-control-label" htmlFor="MaxCount1">
                              {formData.MaxCount === 1 ? "In Stock" : "Out Of Stock"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <label className="form-label" htmlFor="status">
                        Payment Mode
                      </label>
                      <div className="form-control-wrap">
                        <ButtonGroup>
                          <Button
                            color="primary"
                            outline={formData.PaymentMode === 0}
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData((prevState) => ({ ...prevState, PaymentMode: 1 }));
                            }}
                          >
                            Sandbox
                          </Button>
                          <Button
                            color="primary"
                            outline={formData.PaymentMode === 1}
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData((prevState) => ({ ...prevState, PaymentMode: 0 }));
                            }}
                          >
                            Live
                          </Button>
                        </ButtonGroup>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ProductDescription">
                          Item Description
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="ProductDescription"
                            value={formData.ProductDescription}
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: true })}
                          />
                          {errors.ProductDescription && <span className="invalid">This field is required</span>}
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
                              name="CategoryId"
                              id="CategoryId"
                              disabled={categories.length === 0}
                              value={formData.CategoryId}
                              onChange={(e) =>
                                setFormData((prevState) => ({
                                  ...prevState,
                                  CategoryId: e.target.value === "New" ? "New" : +e.target.value,
                                }))
                              }
                            >
                              {categories.length > 0 &&
                                categories.map((item) => (
                                  <option key={item?.CategoryId} value={item?.CategoryId}>
                                    {item?.CategoryName}
                                  </option>
                                ))}
                            </Input>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="newCategory">
                          Category Name
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="CategoryName"
                            value={newCategoryEdit.CategoryName}
                            onChange={(e) => setNewCategoryEdit((prev) => ({ ...prev, CategoryName: e.target.value }))}
                            ref={register({ required: true })}
                          />
                          {errors.CategoryName && <span className="invalid">This field is required</span>}
                        </div>
                        <label className="form-label" htmlFor="CategoryImageURL">
                          Category Image URL
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="CategoryImageURL"
                            value={newCategoryEdit.CategoryImageURL}
                            onChange={(e) =>
                              setNewCategoryEdit((prev) => ({ ...prev, CategoryImageURL: e.target.value }))
                            }
                            ref={register({ required: true })}
                          />
                          {errors.CategoryImageURL && <span className="invalid">This field is required</span>}
                        </div>
                        <label className="form-label" htmlFor="BannerImageURL">
                          Banner Image URL
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="BannerImageURL"
                            value={newCategoryEdit.BannerImageURL}
                            onChange={(e) =>
                              setNewCategoryEdit((prev) => ({ ...prev, BannerImageURL: e.target.value }))
                            }
                            ref={register({ required: true })}
                          />
                          {errors.BannerImageURL && <span className="invalid">This field is required</span>}
                        </div>
                      </div>
                    </Col>

                    <Col size="12">
                      <label className="form-label" htmlFor="ProductVegCategory">
                        Product Category
                      </label>
                      <div className="form-control-wrap">
                        <div className="form-control-select">
                          <Input
                            type="select"
                            name="ProductVegCategory"
                            id="ProductVegCategory"
                            value={formData.ProductVegCategory}
                            onChange={(e) => {
                              setFormData((prevState) => ({
                                ...prevState,
                                ProductVegCategory: +e.target.value,
                                Type: PRODUCT_VEG_CATEGORIES.find((item) => item.id === +e.target.value).type,
                              }));
                            }}
                          >
                            {PRODUCT_VEG_CATEGORIES.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.type}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ProductImageURL">
                          Image URL
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            name="ProductImageURL"
                            value={formData.ProductImageURL}
                            onChange={(e) => onInputChange(e)}
                            ref={register({ required: true })}
                          />
                          {errors.ProductImageURL && <span className="invalid">This field is required</span>}
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
          {
            <AddProductModal
              client_id={client_id}
              client_name={client_name}
              onFormSubmit={onFormSubmit}
              categories={categories}
            />
          }
        </SimpleBar>

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default AddBeverages;
