import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import "moment-timezone";
import Moment from "react-moment";
import axios from "axios";

const DeviceLog = ({ device }) => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const getlogData = async () => {
      const response = await axios.get("Firmware/getDeviceLast10Log?WifiMacAddress=" + device.WifiMacAddress);
      console.log(response.data);
      setLogs(response.data);
    };
    getlogData();
  }, []);
  return (
    <table className="table table-orders">
      <thead className="tb-odr-head">
        <tr className="tb-odr-item">
          <th className="tb-odr-info">
            <span className="tb-odr-id">Serial No</span>
            <span className="tb-odr-id">Device ID</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-odr-id">Log Message</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-odr-date d-none d-md-inline-block">Date - </span>
            <span className="tb-odr-date d-none d-md-inline-block">Time</span>
          </th>
          <th className="tb-odr-action">&nbsp;</th>
        </tr>
      </thead>
      <tbody className="tb-odr-body">
        {logs.length > 0 &&
          logs.map((item, idx) => {
            return (
              <tr className="tb-odr-item" key={idx}>
                <td className="tb-odr-info">
                  <span className="tb-odr-id">
                    <a
                      href="#id"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      {item.Id}
                    </a>
                  </span>
                  <span className="tb-odr-total">{item.WifiMacAddress}</span>
                </td>
                <td className="tb-odr-info">
                  <span className="tb-odr-total">{item.message}</span>
                </td>

                <td className="tb-odr-info">
                  <span className="tb-odr-date">
                    <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                      {item.added_date}
                    </Moment>{" "}
                  </span>
                </td>
                <td className="tb-odr-action">
                  <div className="tb-odr-btns d-none d-md-inline">
                    <Button color="primary" className="btn-sm">
                      View Log
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

const deviceLogData = [
  {
    sno: "#83638",
    id: "7468246876",
    message: "@Zed-Flask:/var/www/html/items-rest/resources$",
    date: "13/06/2022",
    time: "8:24 AM",
  },
  {
    sno: "#83638",
    id: "7468246876",
    message: "@Zed-Flask:/var/www/html/items-rest/resources$",
    date: "13/06/2022",
    time: "8:24 AM",
  },
  { sno: "#83638", id: "7468246846", message: "Test", date: "13/06/2022", time: "8:24 AM" },
  { sno: "#83638", id: "7468246846", message: "Test", date: "13/06/2022", time: "8:24 AM" },
  { sno: "#83638", id: "7468246846", message: "Test", date: "13/06/2022", time: "8:24 AM" },
  { sno: "#83638", id: "7468246846", message: "Test", date: "13/06/2022", time: "8:24 AM" },
  { sno: "#83638", id: "7468246846", message: "Test", date: "13/06/2022", time: "8:24 AM" },
];

export default DeviceLog;
