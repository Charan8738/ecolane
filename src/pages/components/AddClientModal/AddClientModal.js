import React, { useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  Form,
  Label,
} from "reactstrap";
import Dropzone from "react-dropzone";

import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, BackTo } from "../../../components/block/Block";
import { PreviewCard, CodeBlock } from "../../../components/preview/Preview";
import Icon from "../../../components/icon/Icon";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { Row, Col } from "../../../components/Component";

const AddClientModal = () => {
  const [modalForm, setModalForm] = useState(false);
  const toggleForm = () => setModalForm(!modalForm);
  const { errors, register, handleSubmit } = useForm();
  let id = 1;
  const onFormSubmit = (e) => {};
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const [files4, setFiles4] = useState([]);
  return (
    <Block>
      <Button color="primary" onClick={toggleForm}>
        Modal With Form
      </Button>
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
                      name="fullname"
                      className="form-control"
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
                      name="fullname"
                      className="form-control"
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
                      name="fullname"
                      className="form-control"
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
                      name="subject"
                      className="form-control"
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
                      name="subject"
                      className="form-control"
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
                      name="subject"
                      className="form-control"
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
                      name="subject"
                      className="form-control"
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
                      name="subject"
                      className="form-control"
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
                      name="subject"
                      className="form-control"
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
                      name="message"
                      placeholder="App Description"
                    />
                    {errors.message && <span className="invalid">This field is required</span>}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
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
              </Col>

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
  );
};

export default AddClientModal;
