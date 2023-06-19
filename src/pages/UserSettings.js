import React, { useState } from "react";
import Head from "../layout/head/Head";
import { Card, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup } from "reactstrap";
import Content from "../layout/content/Content";

import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  InputSwitch,
  Button,
} from "../components/Component";
import { useForm } from "react-hook-form";

const UserSettings = ({ sm, updateSm }) => {
  const [modalForm, setModalForm] = useState(false);
  const [passState, setPassState] = useState(false);
  const [pass, setPass] = useState();

  const toggleForm = () => setModalForm(!modalForm);
  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <BlockHead size="lg">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h4">Profile Settings</BlockTitle>
              <BlockDes>
                <p>These settings will help you to keep your account secure.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent className="align-self-start d-lg-none">
              <Button
                className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
                onClick={() => updateSm(!sm)}
              >
                <Icon name="menu-alt-r"></Icon>
              </Button>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Card className="card-bordered">
            <div className="card-inner-group">
              <div className="card-inner">
                <div className="between-center flex-wrap g-3">
                  <div className="nk-block-text">
                    <h6>Change Password</h6>
                    <p>Set a unique password to protect your account.</p>
                  </div>
                  <div className="nk-block-actions flex-shrink-sm-0">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                      <li className="order-md-last">
                        <Button onClick={toggleForm} color="primary">
                          Change Password
                        </Button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Block>
        <Modal isOpen={modalForm} toggle={toggleForm}>
          <ModalHeader
            toggle={toggleForm}
            close={
              <button className="close" onClick={toggleForm}>
                <Icon name="cross" />
              </button>
            }
          >
            Customer Info
          </ModalHeader>
          <ModalBody>
            <form>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Old Password
                  </label>
                  {/* <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    Forgot Code?
                  </Link> */}
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="passcode"
                    value={pass}
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your passcode"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    New Password
                  </label>
                  {/* <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    Forgot Code?
                  </Link> */}
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="passcode"
                    value={pass}
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your passcode"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <Button color="primary" type="submit" onClick={(ev) => ev.preventDefault()} size="lg">
                  Save Credentials
                </Button>
              </FormGroup>
            </form>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default UserSettings;
