import React, { useState } from "react";
import { Icon } from "../Component";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { Row, Col } from "../Component";
import { Modal, ModalHeader, ModalBody, Button, Form } from "reactstrap";
import { FormControlMap, RenderComponent } from "../../pages/form-components/FormComponents";
const EditDeviceModal = ({ showModal, toggleHandler, submitHandler, deviceInfo }) => {
  const { errors, register, handleSubmit } = useForm();
  const [formData, setFormData] = useState({
    DeviceStatus: deviceInfo?.DeviceStatus,
    DeviceNetworkMode: deviceInfo?.DeviceNetworkMode,
    DeviceOTAMode: deviceInfo?.DeviceOTAMode,
    BIBOAMACAddress: deviceInfo?.BIBOAMACAddress,
    BIBOOMACAddress: deviceInfo?.BIBOOMACAddress,
    BIBOBMACAddress: deviceInfo?.BIBOBMACAddress,
    IBeaconAMACAddress: deviceInfo?.IBeaconAMACAddress,
    IBeaconOMACAddress: deviceInfo?.IBeaconOMACAddress,
    IBeaconBMACAddress: deviceInfo?.IBeaconBMACAddress,
    peripheralMode: deviceInfo?.peripheralMode,
  });
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "client_id" ? +value : value }));
  };
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });

  return (
    <Modal isOpen={showModal} toggle={toggleHandler} className="modal-dialog-centered" size="lg" scrollable>
      <ModalHeader
        toggle={toggleHandler}
        close={
          <button className="close" onClick={toggleHandler}>
            <Icon name="cross" />
          </button>
        }
      >
        Edit Device
      </ModalHeader>
      <ModalBody>
        <Form className={formClass} onSubmit={handleSubmit(() => submitHandler(formData))}>
          <Row className="gy-4">
            {[
              {
                type: "BG",

                props: {
                  title: "Device Status",
                  id: "DeviceStatus",
                  value: formData.DeviceStatus,
                  buttons: [
                    { title: "Offline", value: "Offline" },
                    { title: "Online", value: "Online" },
                  ],
                  onChangeHandler: (newValue) => setFormData((prev) => ({ ...prev, DeviceStatus: newValue })),
                },
              },
              {
                type: "BG",

                props: {
                  title: "Network Mode",
                  id: "DeviceNetworkMode",
                  value: formData.DeviceNetworkMode,
                  buttons: [
                    { title: "Wifi", value: "Wifi" },
                    { title: "GSM", value: "GSM" },
                  ],
                  onChangeHandler: (newValue) => setFormData((prev) => ({ ...prev, DeviceNetworkMode: newValue })),
                },
              },
              {
                type: "BG",

                props: {
                  title: "Network Mode",
                  id: "DeviceOTAMode",
                  value: formData.DeviceOTAMode,
                  buttons: [
                    { title: "Live", value: "Live" },
                    { title: "Inactive", value: "Inactive" },
                  ],
                  onChangeHandler: (newValue) => setFormData((prev) => ({ ...prev, DeviceOTAMode: newValue })),
                },
              },
              {
                type: "LI",
                props: {
                  title: "BIBO 1.1 A Macaddress",
                  id: "BIBOAMACAddress",
                  name: "BIBOAMACAddress",
                  value: formData.BIBOAMACAddress,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["BIBOAMACAddress"],
                },
              },
              {
                type: "LI",
                props: {
                  title: "BIBO 1.1 O Macaddress",
                  id: "BIBOOMACAddress",
                  name: "BIBOOMACAddress",
                  value: formData.BIBOOMACAddress,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["BIBOOMACAddress"],
                },
              },
              {
                type: "LI",
                props: {
                  title: "BIBO 1.1 B Macaddress",
                  id: "BIBOBMACAddress",
                  name: "BIBOBMACAddress",
                  value: formData.BIBOBMACAddress,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["BIBOBMACAddress"],
                },
              },
              {
                type: "LI",
                props: {
                  title: "iBeacon A Macaddress",
                  id: "IBeaconAMACAddress",
                  name: "IBeaconAMACAddress",
                  value: formData.IBeaconAMACAddress,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["IBeaconAMACAddress"],
                },
              },
              {
                type: "LI",
                props: {
                  title: "iBeacon B Macaddress",
                  id: "IBeaconBMACAddress",
                  name: "IBeaconBMACAddress",
                  value: formData.IBeaconBMACAddress,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["IBeaconBMACAddress"],
                },
              },
              {
                type: "LI",
                props: {
                  title: "iBeacon O Macaddress",
                  id: "IBeaconOMACAddress",
                  name: "IBeaconOMACAddress",
                  value: formData.IBeaconOMACAddress,
                  onChangeHandler: (e) => onChangeHandler(e),
                  register: register,
                  errors: errors["IBeaconOMACAddress"],
                },
              },
              {
                type: "IS",
                props: {
                  title: "Peripheral Mode",
                  id: "peripheralMode",
                  name: "peripheralMode",
                  values: [
                    { value: "Scanner", title: "Barcode Scanner" },
                    { value: "PrinterSmall", title: "Small Label" },
                    { value: "PrinterMedium", title: "Medium Label" },
                    { value: "PrinterWrist", title: "Wristband" },
                  ],
                  value: formData.peripheralMode,
                  onChangeHandler: (e) => onChangeHandler(e),
                },
              },
            ].map((item) => (
              <Col sm="12" md="4">
                <RenderComponent component={FormControlMap[item.type]} {...item.props} />
              </Col>
            ))}
          </Row>
          <hr className="preview-hr"></hr>
          <Row className="g-3">
            <Col sm="12" className="d-flex justify-content-center">
              <Button type="submit" color="primary">
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditDeviceModal;
