import React, { useState, useEffect } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import classNames from "classnames";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Block,
  BlockHead,
  PreviewCard,
  BlockHeadContent,
  BlockTitle,
  Row,
  Col,
  BlockBetween,
} from "../components/Component";
import { selectAllClients, fetchClients, getClientsStatus } from "../redux/clientSlice";
import { useSelector, useDispatch } from "react-redux";
import { FormGroup, Button, ButtonGroup, Label, Form, Spinner, Input } from "reactstrap";
import { FormControlMap, RenderComponent } from "./form-components/FormComponents";
const AddTracker = () => {
  const dispatch = useDispatch();
  const clients = useSelector(selectAllClients);
  const clientStatus = useSelector(getClientsStatus);
  const { errors, register, handleSubmit } = useForm();
  const [formData, setFormData] = useState({
    client_id: 1,
    WifiMacAddress: null,
    IMEI: null,
    Phone: null,
    Status: false,
    VehicleNo: null,
  });
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "client_id" ? +value : value }));
  };
  const onSubmitHandler = () => {
    axios.post("URL", formData).then((res) => {
      console.log(res);
    });
  };
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  useEffect(() => {
    if (clientStatus === "idle") {
      dispatch(fetchClients());
    }
  }, []);
  useEffect(() => {
    if (clientStatus === "succeeded") {
      setFormData((prev) => ({ ...prev, client_id: clients.length > 0 ? clients[0].id : null }));
    }
  }, [clientStatus]);
  // Form Controls Map
  //LI - LabelledInput
  //IS - InputSelect
  //TB - ToggleBtn

  return (
    <React.Fragment>
      <Head title="Add Tracker"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Add Tracker
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <Form className={formClass} onSubmit={handleSubmit(onSubmitHandler)}>
              <Row className="gy-4">
                {[
                  {
                    type: "IS",
                    props: {
                      title: "Client",
                      id: "client_id",
                      name: "client_id",
                      values: clients.map((item) => ({ value: item.id, title: item.username })),
                      value: formData.client_id,
                      onChangeHandler: (e) => onChangeHandler(e),
                    },
                  },
                  {
                    type: "LI",
                    props: {
                      title: "Wifi MAC Address",
                      id: "WifiMacAddress",
                      name: "WifiMacAddress",
                      value: formData.WifiMacAddress,
                      onChangeHandler: (e) => onChangeHandler(e),
                      register: register,
                      errors: errors["WifiMacAddress"],
                    },
                  },
                  {
                    type: "LI",
                    props: {
                      title: "IMEI",
                      id: "IMEI",
                      name: "IMEI",
                      value: formData.IMEI,
                      onChangeHandler: (e) => onChangeHandler(e),
                      register: register,
                      errors: errors["IMEI"],
                    },
                  },
                  {
                    type: "LI",
                    props: {
                      title: "Phone",
                      id: "Phone",
                      name: "Phone",
                      value: formData.Phone,
                      onChangeHandler: (e) => onChangeHandler(e),
                      register: register,
                      errors: errors["Phone"],
                    },
                  },
                  {
                    type: "TB",
                    props: {
                      title: "Device Status",
                      id: "Status",
                      checked: formData.Status,
                      onChangeHandler: () => setFormData((prev) => ({ ...prev, Status: !prev.Status })),
                      messages: ["Online", "Offline"],
                    },
                  },
                  {
                    type: "LI",
                    props: {
                      title: "Vehicle No.",
                      id: "VehicleNo",
                      name: "VehicleNo",
                      value: formData.VehicleNo,
                      onChangeHandler: (e) => onChangeHandler(e),
                      register: register,
                      errors: errors["VehicleNo"],
                    },
                  },
                ].map((item) => (
                  <Col sm="6">
                    <RenderComponent component={FormControlMap[item.type]} {...item.props} />
                  </Col>
                ))}
                <Col sm="12">
                  <Button color="primary" size="lg" type="submit">
                    Add
                  </Button>
                </Col>
              </Row>
            </Form>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default AddTracker;
