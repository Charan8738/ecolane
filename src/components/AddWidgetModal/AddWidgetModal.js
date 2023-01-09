import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Button, ModalFooter, Spinner } from "reactstrap";
import Icon from "../../components/icon/Icon";

const AddWidgetModal = ({ showModal, toggleForm, widgets, macAddress, changeHandler }) => {
  const [selectedWidget, setSelectedWidget] = useState([...widgets]);
  const [isLoading, setLoading] = useState(false);
  const addWidgetHandler = (idx) => {
    const newWidgets = [...selectedWidget];
    newWidgets[idx] = !newWidgets[idx];
    setSelectedWidget(newWidgets);
  };
  const applyHandler = () => {
    setLoading(true);
    axios
      .put("AddWidgets", {
        WifiMacAddress: macAddress,
        widget1: selectedWidget[0],
        widget2: selectedWidget[1],
        widget3: selectedWidget[2],
        widget4: selectedWidget[3],
        widget5: selectedWidget[4],
        widget6: selectedWidget[5],
      })
      .then((res) => {
        changeHandler(selectedWidget);
        setLoading(false);
        toggleForm();
      });
  };

  const clearHandler = () => {
    setSelectedWidget(Array(6).fill(false));
  };
  useEffect(() => {
    setSelectedWidget([...widgets]);
  }, [widgets]);
  return (
    <Modal isOpen={showModal} toggle={toggleForm} scrollable>
      <ModalHeader
        toggle={toggleForm}
        close={
          <button className="close" onClick={toggleForm}>
            <Icon name="cross" />
          </button>
        }
      >
        Add Widgets
      </ModalHeader>
      <ModalBody className="bg-light" style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {isLoading ? (
          <Spinner color="primary" />
        ) : (
          <ul className="preview-icon-list">
            {WIDGETS.map((item, idx) => (
              <li className="preview-icon-item " style={{ width: "10rem" }} key={idx}>
                <div
                  className={`preview-icon-box card ${selectedWidget[idx] ? "badge-outline-primary" : ""} `}
                  style={{
                    cursor: "pointer",
                    outline: `${selectedWidget[idx] ? "auto" : "none"}`,
                    height: "7rem",
                    width: "8rem",
                  }}
                  onClick={() => addWidgetHandler(idx)}
                >
                  <div className="preview-icon-wrap">
                    <Icon name={item.icon}></Icon>
                  </div>
                  <span className="preview-icon-name">{item.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => clearHandler()}>
          Clear
        </Button>
        <Button onClick={applyHandler}>Apply</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddWidgetModal;

const WIDGETS = [
  { name: "Device Log", icon: "file-text" },
  { name: "Device Active Time", icon: "activity-round" },
  { name: "Wifi Strength", icon: "rss" },
  { name: "Device LTE Strength", icon: "meter" },
  { name: "GPS tracker", icon: "map-pin" },
  { name: "Ticket History", icon: "ticket-alt" },
];
