import React, { useState } from "react";
import { Card, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { Icon } from "../../../Component";
import { TrafficSourcesChart } from "../../charts/fleet/Chart";

const FleetTrackingChart = (device) => {
  const [data, setData] = useState("7");
  var deviceData = device.device;
  const moving = deviceData.filter((i) => i.Devicemode === "moving").length;
  const idle = deviceData.filter((i) => i.Devicemode === "idle").length;
  const parked = deviceData.filter((i) => i.Devicemode === "parked").length;
  const offline = deviceData.filter((i) => i.Devicemode === "offline").length;
  var chartData = [0, 0, 0, 0];

  //   setVehiclesMoving()
  return (
    <Card className="card-full overflow-hidden">
      <div className="nk-ecwg nk-ecwg4 h-100">
        <div className="card-inner flex-grow-1">
          <div className="card-title-group mb-4">
            <div className="card-title">
              <h6 className="title">Fleet Status</h6>
            </div>
            {/* <div className="card-tools">
              <UncontrolledDropdown>
                <DropdownToggle
                  tag="a"
                  href="#toggle"
                  onClick={(ev) => ev.preventDefault()}
                  className="dropdown-toggle btn btn-icon btn-trigger"
                >
                  <Icon name="more-h" />
                </DropdownToggle>
                <DropdownMenu right className="dropdown-menu-sm">
                  <ul className="link-list-opt no-bdr">
                    <li className={data === "7" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setData("7");
                        }}
                      >
                        <span>7 Days</span>
                      </DropdownItem>
                    </li>
                    <li className={data === "15" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setData("15");
                        }}
                      >
                        <span>15 days</span>
                      </DropdownItem>
                    </li>
                    <li className={data === "30" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setData("30");
                        }}
                      >
                        <span>30 days</span>
                      </DropdownItem>
                    </li>
                  </ul>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div> */}
          </div>
          <div className="data-group">
            <div className="nk-ecwg4-ck">
              <TrafficSourcesChart state={data} chartData={[moving, idle, parked, offline]} />
            </div>
            <ul className="nk-ecwg4-legends">
              <li>
                <div className="title">
                  <span className="dot dot-lg sq" style={{ background: "#1ee0ac" }}></span>
                  <span>Vehicle Running</span>
                </div>
                <div className="amount amount-xs">{data === "7" ? moving : data === "15" ? "3505" : "4000"}</div>
              </li>
              <li>
                <div className="title">
                  <span className="dot dot-lg sq" style={{ background: "#364a63" }}></span>
                  <span>Vehicles Idle</span>
                </div>
                <div className="amount amount-xs">{data === "7" ? idle : data === "15" ? "800" : "1250"}</div>
              </li>
              <li>
                <div className="title">
                  <span className="dot dot-lg sq" style={{ background: "#f4bd0e" }}></span>
                  <span>Vehicles Parked</span>
                </div>
                <div className="amount amount-xs">{data === "7" ? parked : data === "15" ? parked : "3250"}</div>
              </li>
              <li>
                <div className="title">
                  <span className="dot dot-lg sq" style={{ background: "#e85347" }}></span>
                  <span>Vehicles Offline</span>
                </div>
                <div className="amount amount-xs">{data === "7" ? parked : data === "15" ? "150" : "250"}</div>
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="card-inner card-inner-md bg-light">
          <div className="card-note">
            <Icon className="info-fill"></Icon>
            <span>Traffic channels have beed generating the most traffics over past days.</span>
          </div>
        </div> */}
      </div>
    </Card>
  );
};

export default FleetTrackingChart;
