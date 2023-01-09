import React, { useState } from "react";
import { Block, BlockHead, BlockTitle, BlockHeadContent, Icon, Row, Col, Button } from "../../components/Component";
import classNames from "classnames";
import { Input, ButtonGroup, Form } from "reactstrap";
import { useForm } from "react-hook-form";
const AddProductModal = ({ client_name, client_id, onFormSubmit, categories }) => {
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
    MaxCount: 0,
    ProductMiscDescription: "",
    VerificationStatus: 0,
    PaymentMode: 0,
    ProductCost: 0,
    ProductVegCategory: 0,
  };
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const { errors, register, handleSubmit } = useForm();
  const [newCategory, setNewCategory] = useState({
    newCategoryName: "",
    CategoryImageURL: "",
    BannerImageURL: "",
  });

  const [formData, setFormData] = useState(INITIAL_ADD_FORM);
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div>
      {" "}
      <BlockHead>
        <BlockHeadContent>
          <BlockTitle tag="h5">Add Product</BlockTitle>
        </BlockHeadContent>
      </BlockHead>
      <Block>
        <Form
          className={formClass}
          onSubmit={handleSubmit(() => {
            setFormData(INITIAL_ADD_FORM);
            onFormSubmit({ formData, newCategory });
          })}
        >
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
                    name="RouteName"
                    onChange={(e) => onInputChange(e)}
                    value={formData.RouteName}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.RouteName && <span className="invalid">This field is required</span>}
                </div>
              </div>
            </Col>
            <Col md="6">
              <div className="form-group">
                <label className="form-label" htmlFor="isActive">
                  Status
                </label>
                <div className="form-control-wrap">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control"
                      onChange={(event) => {
                        setFormData((prevState) => ({ ...prevState, isActive: !formData.isActive }));
                      }}
                      checked={formData.isActive}
                      id="isActive"
                      name="isActive"
                    />
                    <label className="custom-control-label" htmlFor="isActive">
                      {formData.isActive ? "Availabe" : "Not Available"}
                    </label>
                  </div>
                </div>
              </div>
            </Col>
            <Col md="6">
              <div className="form-group">
                <label className="form-label" htmlFor="MaxCount">
                  Max Count
                </label>
                <div className="form-control-wrap">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control"
                      onChange={(event) => {
                        setFormData((prevState) => ({ ...prevState, MaxCount: 1 - prevState.MaxCount }));
                      }}
                      checked={formData.MaxCount === 1}
                      id="MaxCount"
                      name="MaxCount"
                    />
                    <label className="custom-control-label" htmlFor="MaxCount">
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

            <Col md="12">
              <div className="form-group">
                <label className="form-label" htmlFor="FareAmount">
                  Price
                </label>
                <div className="form-control-wrap">
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    className="form-control"
                    name="FareAmount"
                    value={formData.FareAmount ?? 0}
                    onChange={(e) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        FareAmount: +e.target.value,
                        ProductCost: e.target.value,
                      }))
                    }
                    ref={register({ min: 0 })}
                  />
                  {errors.FareAmount && <span className="invalid">Should be greater than 0</span>}
                </div>
              </div>
            </Col>
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="RouteName">
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
            <Col size="12">
              <label className="form-label" htmlFor="CategoryId">
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
                        <option key={item?.id} value={item?.CategoryId}>
                          {item?.CategoryName}
                        </option>
                      ))}
                    <option value="New">Add new category</option>
                  </Input>
                </div>
              </div>
            </Col>
            {formData.CategoryId === "New" ? (
              <Col size="12">
                <div className="form-group">
                  <label className="form-label" htmlFor="newCategory">
                    New Category
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      name="newCategoryName"
                      value={newCategory.newCategoryName}
                      onChange={(e) => setNewCategory((prev) => ({ ...prev, newCategoryName: e.target.value }))}
                      ref={register({ required: "This is required" })}
                    />
                    {errors.newCategoryName && <span className="invalid">{errors.newCategoryName.message}</span>}
                  </div>
                  <label className="form-label" htmlFor="CategoryImageURL">
                    Category Image URL
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      name="CategoryImageURL"
                      value={newCategory.CategoryImageURL}
                      onChange={(e) => setNewCategory((prev) => ({ ...prev, CategoryImageURL: e.target.value }))}
                      ref={register({ required: "This is required" })}
                    />
                    {errors.CategoryImageURL && <span className="invalid">{errors.CategoryImageURL.message}</span>}
                  </div>
                  <label className="form-label" htmlFor="BannerImageURL">
                    Banner Image URL
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      name="BannerImageURL"
                      value={newCategory.BannerImageURL}
                      onChange={(e) => setNewCategory((prev) => ({ ...prev, BannerImageURL: e.target.value }))}
                      ref={register({ required: "This is required" })}
                    />
                    {errors.BannerImageURL && <span className="invalid">{errors.BannerImageURL.message}</span>}
                  </div>
                </div>
              </Col>
            ) : null}
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
                <span>Add Product</span>
              </Button>
            </Col>
          </Row>
        </Form>
      </Block>
    </div>
  );
};

export default AddProductModal;
