import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import backgroundImage from "../assets/images/client_background.png";
import {
  FormGroup,
  Form,
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  Badge,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import Head from "../layout/head/Head";
import EvoForm from "./ClientSetupForms/EvoForm";
import classNames from "classnames";
import Dropzone from "react-dropzone";
import AddClientModal from "./components/AddClientModal/AddClientModal";
import { useSelector, useDispatch } from "react-redux";
import {
  Block,
  BlockHead,
  PreviewCard,
  BlockHeadContent,
  BlockTitle,
  Row,
  Col,
  BlockBetween,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
} from "../components/Component";
import Content from "../layout/content/Content";
import { Steps, Step } from "react-step-builder";
import { successAlert, failureAlert } from "../utils/Utils";

import { useForm } from "react-hook-form";
import Icon from "../components/icon/Icon";
import { user_id, role } from "../redux/userSlice";
import axios from "axios";

const EvolutionConfig = () => {
  const userId = useSelector(user_id);
  const user_role = useSelector(role);

  const INITIAL_ADD_FORM = {
    client_id: userId,
    app_name: "",
    agency_name: "",
    agency_phonenumber: "",
    promotional_text: "",
    description: "",
    privacy_policy: "",
    terms: "",
    font_family: "",
    secondary_color: "",
    primary_color: "",
    logo_url: "",
  };

  const { errors, register, handleSubmit } = useForm();
  const [modalForm, setModalForm] = useState(false);
  const [viewModalForm, setViewModalForm] = useState(false);
  const [addedData, setAddedData] = useState(false);
  const toggleForm = () => setModalForm(!modalForm);
  const toggleViewForm = () => setViewModalForm(!viewModalForm);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [itemPerPage] = useState(10);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  let id = 1;
  const [tableData, setTableData] = useState([]);
  const [mailTableData, setMailTableData] = useState([]);

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = mailTableData.slice(indexOfFirstItem, indexOfLastItem);

  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const [files4, setFiles4] = useState([]);
  const [formData, setFormData] = useState({ ...INITIAL_ADD_FORM });
  const resetForm = () => {
    setFormData(INITIAL_ADD_FORM);
    setModalForm(false);
  };

  const onViewClick = (index) => {
    console.log(index);
    console.log(currentItems[index]);
    setFormData(currentItems[index]);
  };

  const onFilterChange = (e) => {
    console.log(e.target.value);
    setSearchText(e.target.value);
  };
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    console.log(name);
  };
  const handleDropChange = (acceptedFiles, set) => {
    set(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };
  const onFormSubmit = (e) => {
    console.log(formData);
    axios
      .post("AddEvolution", formData)
      .then((res) => {
        if (res.status === 200) {
          // setData((prev) => [...prev, res.data]);
          resetForm();
          successAlert("Alert created successfully");
          setAddedData(true);
        } else {
          throw new Error(res.data);
        }
      })
      .catch((err) => {
        window.alert("Error in creating alerts");
        console.log(err);
      });
  };

  useEffect(() => {
    const getEvoConfig = async () => {
      const response = await axios.get("getEvolution?client_id=" + userId);
      return response.data;
    };
    getEvoConfig()
      .then((res) => {
        setTableData([...res]);
        setMailTableData([...res]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log(tableData);
      });
  }, [addedData]);
  useEffect(() => {
    const getEvoConfig = async () => {
      const response = await axios.get("getEvolution?client_id=" + userId);
      return response.data;
    };
    getEvoConfig()
      .then((res) => {
        setTableData([...res]);
        setMailTableData([...res]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log(tableData);
      });
  }, []);

  useEffect(() => {
    if (searchText !== "") {
      const filteredObject = tableData.filter((item) => {
        return item.app_name.toLowerCase().includes(searchText.toLowerCase());
      });
      setMailTableData([...filteredObject]);
    } else {
      setMailTableData([...tableData]);
    }
  }, [searchText]);
  return (
    <React.Fragment>
      <Head title="Evolution Config"></Head>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "280px",
          paddingTop: "105px",
        }}
      >
        <BlockTitle page tag="h3">
          <Title>Client Setup</Title>
        </BlockTitle>
      </div>
      <Content>
        <Block>
          <div className="d-flex flex-row-reverse">
            <Button
              onClick={() => {
                resetForm();
                setModalForm(true);
              }}
              resetForm
              color="primary"
              className="m-2"
            >
              <span>Add Client</span>
            </Button>
            <div className="form-control-wrap m-2">
              <div className="form-icon form-icon-right">
                <Icon name="search"></Icon>
              </div>
              <input
                type="text"
                className="form-control"
                id="default-04"
                placeholder="Search by App Name"
                onChange={(e) => onFilterChange(e)}
              />
            </div>
          </div>
        </Block>
        {/* <Block size="lg">
          <Row>
            <Col sm="11">
              <Card>
                <div className="card-inner-group">
                  <div className="card-inner p-0">
                    <DataTableBody>
                      <DataTableHead>
                        <DataTableRow size="sm">
                          <span>
                            <strong>App Name</strong>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <span>
                            <strong>Agency Name</strong>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <span>
                            <strong>Agency Phone</strong>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <span>
                            <strong>Font Family</strong>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <span>
                            <strong>Primary Color</strong>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <span>
                            <strong>Secondary Color</strong>
                          </span>
                        </DataTableRow>
                      </DataTableHead>
                    </DataTableBody>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Block> */}
        <Block>
          <Card className="card-bordered card-preview">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                {/* Table */}
                <table style={{ width: "100%", tableLayout: "auto", textAlign: "center" }} className="table">
                  <thead className="table-light">
                    <tr>
                      <th className="d-none d-md-table-cell">App Name</th>
                      <th className="d-none d-md-table-cell">Agency Name</th>
                      <th className="d-none d-sm-table-cell">Agency Phone</th>
                      <th className="d-none d-sm-table-cell">Font Family</th>
                      <th className="d-none d-sm-table-cell">Primary Color</th>
                      <th className="d-none d-sm-table-cell">Secondary Color</th>
                      <th className="d-none d-sm-table-cell">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0
                      ? currentItems.map((item, index) => {
                          return (
                            <tr key={item.id} className="tb-tnx-item">
                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                <strong>{item.app_name}</strong>
                              </td>

                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {item.agency_name}
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {item.agency_phonenumber}
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {item.font_family}
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {/* {item.primary_color} */}
                                <Badge style={{ background: "#" + item?.primary_color, border: "none" }}>
                                  {item?.primary_color}
                                </Badge>
                              </td>

                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                <Badge style={{ background: "#" + item?.secondary_color, border: "none" }}>
                                  {item?.secondary_color}
                                </Badge>
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
                                          href="#more"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            setViewModalForm(true);
                                            onViewClick(index);
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
                  {currentItems.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={mailTableData.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">
                        {isLoading ? <Spinner color="primary" /> : "No App config found"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>
        {/* Add Modal */}
        <Block>
          <Modal size="xl" isOpen={modalForm} toggle={toggleForm}>
            <ModalHeader
              toggle={toggleForm}
              close={
                <button className="close" onClick={toggleForm}>
                  <Icon name="cross" />
                </button>
              }
            >
              New App Request
            </ModalHeader>
            <ModalBody>
              <Form className={formClass} onSubmit={handleSubmit(onFormSubmit)}>
                <Row className="g-gs">
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-full-name">
                        App name
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-full-name"
                          name="app_name"
                          className="form-control"
                          value={formData.app_name}
                          onChange={onChangeHandler}
                        />
                        {errors.fullname && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-full-name">
                        Agency name
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-full-name"
                          name="agency_name"
                          className="form-control"
                          value={formData.agency_name}
                          onChange={onChangeHandler}
                        />
                        {errors.fullname && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-full-name">
                        Agency Phonenumber
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-full-name"
                          name="agency_phonenumber"
                          className="form-control"
                          value={formData.agency_phonenumber}
                          onChange={onChangeHandler}
                        />
                        {errors.fullname && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Promotional Text
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="promotional_text"
                          className="form-control"
                          value={formData.promotional_text}
                          onChange={onChangeHandler}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Primary Color
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="primary_color"
                          className="form-control"
                          value={formData.primary_color}
                          onChange={onChangeHandler}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Secondary Color
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="secondary_color"
                          className="form-control"
                          value={formData.secondary_color}
                          onChange={onChangeHandler}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Font Family
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="font_family"
                          className="form-control"
                          value={formData.font_family}
                          onChange={onChangeHandler}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Privacy Policy URL
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="privacy_policy"
                          className="form-control"
                          value={formData.privacy_policy}
                          onChange={onChangeHandler}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Terms & Conditions URL
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="terms"
                          className="form-control"
                          value={formData.terms}
                          onChange={onChangeHandler}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        App Logo URL ( 1024 x 1024px )
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="logo_url"
                          className="form-control"
                          value={formData.logo_url}
                          onChange={onChangeHandler}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-message">
                        App Description
                      </Label>
                      <div className="form-control-wrap">
                        <textarea
                          ref={register({
                            required: true,
                          })}
                          type="textarea"
                          className="form-control form-control-sm"
                          id="fv-message"
                          name="description"
                          placeholder="App Description"
                          value={formData.description}
                          onChange={onChangeHandler}
                        />
                        {errors.message && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  {/* <Col sm="6">
                    <label className="form-label">Upload Your App Logo (1024 x 1024px)</label>
                    <Dropzone
                      onDrop={(acceptedFiles) => handleDropChange(acceptedFiles, setFiles4)}
                      accept={[".jpg", ".png", ".svg"]}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()} className="dropzone upload-zone dz-clickable">
                            <input {...getInputProps()} />
                            {files4.length === 0 && (
                              <div className="dz-message">
                                <span className="dz-message-text">Drag and drop file</span>
                                <span className="dz-message-or">or</span>
                                <Button color="primary">SELECT</Button>
                              </div>
                            )}
                            {files4.map((file) => (
                              <div
                                key={file.name}
                                className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                              >
                                <div className="dz-image">
                                  <img src={file.preview} alt="preview" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </Col> */}

                  <Col md="12">
                    <FormGroup>
                      <Button color="primary" size="lg">
                        Add Client
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </Block>
        {/* View Modal */}
        <Block>
          <Modal size="xl" isOpen={viewModalForm} toggle={toggleViewForm}>
            <ModalHeader
              toggle={toggleViewForm}
              close={
                <button className="close" onClick={toggleViewForm}>
                  <Icon name="cross" />
                </button>
              }
            >
              View Config
            </ModalHeader>
            <ModalBody>
              <Form className={formClass} onSubmit={handleSubmit(onFormSubmit)}>
                <Row className="g-gs">
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-full-name">
                        App name
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-full-name"
                          name="app_name"
                          className="form-control"
                          value={formData.app_name}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.fullname && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-full-name">
                        Agency name
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-full-name"
                          name="agency_name"
                          className="form-control"
                          value={formData.agency_name}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.fullname && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-full-name">
                        Agency Phonenumber
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-full-name"
                          name="agency_phonenumber"
                          className="form-control"
                          value={formData.agency_phonenumber}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.fullname && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Promotional Text
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="promotional_text"
                          className="form-control"
                          value={formData.promotional_text}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Primary Color
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="primary_color"
                          className="form-control"
                          value={formData.primary_color}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Secondary Color
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="secondary_color"
                          className="form-control"
                          value={formData.secondary_color}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Font Family
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="font_family"
                          className="form-control"
                          value={formData.font_family}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Privacy Policy URL
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="privacy_policy"
                          className="form-control"
                          value={formData.privacy_policy}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        Terms & Conditions URL
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="terms"
                          className="form-control"
                          value={formData.terms}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-subject">
                        App Logo URL ( 1024 x 1024px )
                      </Label>
                      <div className="form-control-wrap">
                        <input
                          ref={register({ required: true })}
                          type="text"
                          id="fv-subject"
                          name="logo_url"
                          className="form-control"
                          value={formData.logo_url}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.subject && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="form-label" htmlFor="fv-message">
                        App Description
                      </Label>
                      <div className="form-control-wrap">
                        <textarea
                          ref={register({
                            required: true,
                          })}
                          type="textarea"
                          className="form-control form-control-sm"
                          id="fv-message"
                          name="description"
                          placeholder="App Description"
                          value={formData.description}
                          onChange={onChangeHandler}
                          disabled={user_role !== 3 ? true : false}
                        />
                        {errors.message && <span className="invalid">This field is required</span>}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </Block>
      </Content>
    </React.Fragment>
  );
};
const Title = styled.h3`
  font-size: 112px;
  font-weight: 900;
  padding-left: 32px;
`;
export default EvolutionConfig;
