import React, { useState } from "react";
import { Block, BlockHead, BlockTitle, BlockHeadContent, Row, Col, Button } from "../../../components/Component";
import { Form } from "reactstrap";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { RenderComponent, FormControlMap } from "../../form-components/FormComponents";
const AddTrackerModal = ({ onSubmitHandler, ...props }) => {
  const { errors, register, handleSubmit } = useForm();
  const INITIAL_ADD_FORM = {
    client_id: null,
    imei: null,
    status: false,
    simno: "",
    vehicleNo: "",
    OdometerValue: 0,
    vehicleType: 1,
  };
  const [formData, setFormData] = useState(props.isEdit ? props.formData : INITIAL_ADD_FORM);
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setFormData((prev) => ({ ...prev, [name]: name === "client_id" || name === "vehicleType" ? +value : value }));
  };

  return (
    <div>
      <BlockHead>
        <BlockHeadContent>
          <BlockTitle tag="h5">{props.isEdit ? "Edit" : "Add"} Tracker</BlockTitle>
        </BlockHeadContent>
      </BlockHead>
      <Block>
        <Form className={formClass} onSubmit={handleSubmit(() => onSubmitHandler(formData))}>
          <Row className="gy-4">
            {[
              {
                type: "LI",
                props: {
                  title: "Vehicle No.",
                  id: "vehicleNo",
                  name: "vehicleNo",
                  value: formData.vehicleNo,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["vehicleNo"],
                },
              },
              {
                type: "LI",
                props: {
                  title: "IMEI",
                  id: "imei",
                  name: "imei",
                  value: formData.imei,
                  disabled: props.isEdit,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["imei"],
                },
              },
              {
                type: "TB",
                props: {
                  title: "Device Status",
                  id: "Status",
                  checked: formData.status,
                  onChangeHandler: () => {
                    if (!props.isEdit) setFormData((prev) => ({ ...prev, status: !prev.Status }));
                  },
                  messages: ["Online", "Offline"],
                },
              },

              {
                type: "LI",
                props: {
                  title: "Odometer Value",
                  id: "OdometerValue",
                  name: "OdometerValue",
                  type: "number",
                  value: formData.OdometerValue,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["OdometerValue"],
                },
              },

              {
                type: "LI",
                props: {
                  title: "Phone",
                  id: "simno",
                  name: "simno",
                  value: formData.simno,
                  disabled: props.isEdit,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["simno"],
                  sm: "12",
                },
              },
              {
                type: "IS",
                props: {
                  title: "Vehicle Type",
                  id: "vehicleType",
                  name: "vehicleType",
                  value: formData.vehicleType,
                  values: [
                    { title: "Truck", value: 1 },
                    { title: "Car", value: 2 },
                    { title: "Maxi Cab", value: 3 },
                    { title: "Bike", value: 4 },
                    { title: "Bus", value: 5 },
                  ],
                  onChangeHandler: (e) => onChangeHandler(e),
                },
              },
            ].map((item, idx) => (
              <Col sm="12" key={idx}>
                <RenderComponent component={FormControlMap[item.type]} {...item.props} />
              </Col>
            ))}
            {/* {props.isEdit ? (
              <Col sm="12">
                <RenderComponent
                  component={FormControlMap["IS"]}
                  title="Client ID"
                  id="client_id"
                  name="client_id"
                  value={formData.client_id}
                  values={props.clients.map((item, idx) => ({ title: item.name, value: +item.id }))}
                  onChangeHandler={onChangeHandler}
                />
              </Col>
            ) : null} */}
            <Col sm="12">
              <Button color="primary" size="lg" type="submit">
                {props.isEdit ? "Edit" : "Add"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Block>
    </div>
  );
};

export default AddTrackerModal;
