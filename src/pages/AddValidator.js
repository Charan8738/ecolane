import React, { useEffect, useState } from "react";
import { Card } from "reactstrap";
import {
  Block,
  BlockHead,
  PreviewCard,
  BlockHeadContent,
  BlockTitle,
  Row,
  Col,
  BlockBetween,
  Icon,
} from "../components/Component";
import Swal from "sweetalert2";
import DeviceTable from "../components/table/DeviceTable";
import { useSelector, useDispatch } from "react-redux";
import { user_id } from "../redux/userSlice";
import {
  fetchDevices,
  selectAllDevices,
  getDevicesError,
  getDevicesStatus,
  setStatusToIdle,
} from "../redux/deviceSlice";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import classNames from "classnames";

import { FormGroup, Tooltip, Button, Form } from "reactstrap";
import axios from "axios";
import { Redirect } from "react-router-dom";

const AddValidator = () => {
  const dispatch = useDispatch();
  const userId = useSelector(user_id);
  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState("idle");
  const error = useSelector(getDevicesError);
  const [serialNo, setSerialNo] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [tooltipOpen, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!tooltipOpen);
  };
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const successAlert = () => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Device added successfully",
      confirmButtonText: "Okay",
    }).then((result) => {
      if (result.isConfirmed) {
        setRedirect(true);
      }
    });
  };
  const failureAlert = (msg) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: msg,
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const addValidatorPost = (serialNo) => {
    var resMessage;
    axios
      .post("iot/assignClientDevice", {
        DeviceSerialNo: serialNo,
        client_id: userId,
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch(setStatusToIdle());
          successAlert();
        } else {
          resMessage = res.data.message;
          throw new Error();
        }
      })
      .catch((err) => {
        failureAlert(resMessage);
      });
  };

  useEffect(() => {
    setStatus("loading");
    axios
      .get("iot/getClientDevices?client_id=1")
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (!response.data.message) setDevices([...response.data]);
          setStatus("succeeded");
        } else throw new Error();
      })
      .catch((err) => {
        setStatus("failed");
      });
  }, []);
  if (redirect) return <Redirect to="/" />;
  return (
    <React.Fragment>
      <Head title="Add your validator"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Add your validator
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <Form
              className={formClass}
              onSubmit={(e) => {
                e.preventDefault();
                addValidatorPost(serialNo);
              }}
            >
              <Row className="gy-4">
                <Col sm="4">
                  <FormGroup>
                    <label className="form-label" htmlFor="sno">
                      Serial Number
                    </label>{" "}
                    &nbsp;
                    <Icon id="field_help" name="info-fill"></Icon>
                    <Tooltip placement="right" isOpen={tooltipOpen} target="field_help" toggle={toggle}>
                      Please check the back
                    </Tooltip>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="DeviceSerialNo"
                        id="name"
                        value={serialNo}
                        onChange={(e) => setSerialNo(e.target.value)}
                      />
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Button color="danger">Add Device</Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </PreviewCard>
        </Block>
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Validators Online</BlockTitle>
            </BlockHeadContent>
          </BlockHead>

          <Card className="card-bordered card-preview">
            <DeviceTable
              deviceStatus="Online"
              devices={devices}
              status={status}
              error={error}
              addValidator={addValidatorPost}
            />
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default AddValidator;
