import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Spinner } from "reactstrap";
import "moment-timezone";
import Moment from "react-moment";
const DeviceTable = ({ deviceStatus, devices, status, error, addValidator }) => {
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
        <table className="table table-tranx">
          <thead>
            <tr className="tb-tnx-head">
              <th className="tb-tnx-id">
                <span className="">#</span>
              </th>
              <th className="tb-tnx-info">
                <span className="tb-tnx-desc d-none d-sm-inline-block">
                  <span>Device</span>
                </span>
                <span className="tb-tnx-date d-md-inline-block d-none">
                  <span className="d-md-none">Serial No</span>
                  <span className="d-none d-md-block">
                    <span>Date</span>
                  </span>
                </span>
              </th>
              <th className="tb-tnx-amount is-alt">
                <span className="tb-tnx-total d-none d-md-inline-block">Firmware version</span>
                <span className="tb-tnx-status ">Status</span>
              </th>

              <th className="tb-tnx-action">
                <span>&nbsp;</span>
              </th>
            </tr>
          </thead>
          <tbody className="tb-odr-body">
            {displayDevices.map((item) => {
              return (
                <tr key={item.DeviceId} className="tb-tnx-item">
                  <td className="tb-tnx-id">
                    <a
                      href="#id"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      <span>{item.DeviceId}</span>
                    </a>
                  </td>
                  <td className="tb-tnx-info">
                    <div className="tb-tnx-desc">
                      <span className="title">{item.DeviceName}</span>
                    </div>
                    <div className="tb-tnx-date">
                      <span className="date">{item.DeviceSerialNo}</span>
                      <span className="date d-block">
                        <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                          {item.added_date}
                        </Moment>
                      </span>
                    </div>
                  </td>
                  <td className="tb-tnx-amount ">
                    <div className="tb-tnx-total d-none d-md-table-cell">
                      <span className="amount ">{item.DisplayFirmwareVersion ?? "Null"}</span>
                    </div>
                    <div className="tb-tnx-status">
                      <span
                        className={`badge badge-dot badge-${item.DeviceStatus === "Online" ? "success" : "danger"}`}
                      >
                        {item.DeviceStatus}
                      </span>
                    </div>
                    <div className="tb-tnx-action">
                      {addValidator ? (
                        <Button onClick={() => addValidator(item.DeviceSerialNo)} color="primary">
                          Add
                        </Button>
                      ) : (
                        <Link to={`${process.env.PUBLIC_URL}/device/${item.DeviceId}`}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                              height: "40px",
                              borderRadius: "4px",
                              color: "#fff",
                              borderColor: "#e14954",
                              background: "#e14954",
                            }}
                          >
                            Manage
                          </div>
                        </Link>
                      )}
                    </div>
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
