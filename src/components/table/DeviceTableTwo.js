import React from "react";
import { Button, Card, Spinner } from "reactstrap";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Icon from "../icon/Icon";
import { useHistory } from "react-router-dom";

import "moment-timezone";
import Moment from "react-moment";
const DeviceTable = ({ deviceStatus, devices, status, error, addValidator }) => {
  const history = useHistory();
  const onViewClickHandler = (item) => {
    if (addValidator) addValidator(item.DeviceSerialNo);
    else history.push(`/device/${item.DeviceId}`);
  };
  const DropdownTrans = () => {
    return <UncontrolledDropdown></UncontrolledDropdown>;
  };
  const emptyTable = (
    <Card>
      <div className="nk-ecwg nk-ecwg6">
        <div className="card-inner">
          <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
            <div>
              <h6 className="title " style={{ textAlign: "center" }}>
                No devices found
              </h6>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
  if (status === "loading" || status === "failed") {
    return (
      <Card>
        <div className="nk-ecwg nk-ecwg6">
          <div className="card-inner">
            <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
              <div>
                <h6 className="title " style={{ textAlign: "center" }}>
                  {status === "loading" ? <Spinner color="primary" /> : error}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  } else if (devices && devices.length > 0) {
    const displayDevices = devices.filter((item) => deviceStatus === "All" || item.DeviceStatus === deviceStatus);
    if (displayDevices.length > 0)
      return (
        <table className="table table-orders">
          <thead className="tb-odr-head">
            <tr className="tb-odr-item">
              <th className="tb-odr-info">
                <span className="tb-odr-id">Device ID</span>
                <span className="tb-odr-date d-none d-md-inline-block">Name</span>
              </th>
              <th className="tb-odr-info d-none d-md-inline-block">
                <span className="tb-odr-date ">Serial No</span>
              </th>
              <th className="tb-odr-info ">
                <span className="tb-odr-date d-none d-md-inline-block">Firmware</span>
              </th>
              <th className="tb-odr-info">
                <span className="tb-odr-info">Status</span>
              </th>

              <th className="tb-odr-info d-none d-md-inline-block">
                <span className="tb-odr-date ">Date</span>
              </th>
              <th className="tb-odr-action">&nbsp;</th>
            </tr>
          </thead>
          <tbody className="tb-odr-body">
            {displayDevices.map((item) => {
              return (
                <tr className="tb-odr-item" key={item.id}>
                  <td className="tb-odr-info">
                    <span className="tb-odr-id">
                      <a
                        href="#id"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                      >
                        {item.DeviceId}
                      </a>
                    </span>
                    <span className="tb-odr-date">{item.DeviceName}</span>
                  </td>
                  <td className="tb-odr-info ">
                    <span className="tb-odr-date  d-none d-md-inline-block">{item.DeviceSerialNo}</span>
                  </td>
                  <td className="tb-odr-info d-none d-md-table-cell">
                    <span className="tb-odr-status">{item.DisplayFirmwareVersion}</span>
                  </td>
                  <td className="tb-odr-info">
                    <span className="tb-odr-status">
                      <span
                        className={`badge badge-dot badge-${item.DeviceStatus === "Online" ? "success" : "danger"}`}
                      >
                        {item.DeviceStatus}
                      </span>
                    </span>
                  </td>

                  <td className="tb-odr-info d-none d-md-table-cell">
                    <span className="tb-odr-status ">
                      <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                        {item.added_date}
                      </Moment>
                    </span>
                  </td>
                  <td className="tb-odr-action">
                    <div className="tb-odr-btns d-none d-md-inline">
                      <Button color="primary" className="btn-sm" onClick={() => onViewClickHandler(item)}>
                        View
                      </Button>
                    </div>
                    <DropdownTrans />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    else return emptyTable;
  } else {
    return emptyTable;
  }
};

export default DeviceTable;
