import React, { useEffect, useState } from "react";
import { Card, DropdownMenu, DropdownToggle, DropdownItem, UncontrolledDropdown } from "reactstrap";
import { productData, productDataSet2, productDataSet3, productDataSet4 } from "./ProductData";

const TopProducts = ({ monthlycrowd, weeklycrowd, dailycrowd }) => {
  const [data, setData] = useState("Daily");
  const [dataSet, setDataSet] = useState([]);
  // console.log(monthlycrowd);

  useEffect(() => {
    let object;
    if (data === "Daily") {
      object = dailycrowd;
    } else if (data === "Monthly") {
      object = monthlycrowd;
    } else {
      object = weeklycrowd;
    }
    setDataSet(object);
  }, [data]);

  const returnTotal = (n1, n2) => {
    var result = n1 * Number(n2);
    return result.toFixed(2);
  };

  return (
    <Card className="h-100">
      <div className="card-inner">
        <div className="card-title-group mb-2">
          <div className="card-title">
            <h6 className="title">Crowded Routes</h6>
          </div>
          <div className="card-tools">
            <UncontrolledDropdown>
              <DropdownToggle
                tag="a"
                href="#toggle"
                onClick={(ev) => ev.preventDefault()}
                className="link link-light link-sm dropdown-indicator"
              >
                {data}
              </DropdownToggle>
              <DropdownMenu right className="dropdown-menu-sm">
                <ul className="link-list-opt no-bdr">
                  <li className={data === "Daily" ? "active" : ""}>
                    <DropdownItem
                      tag="a"
                      href="#dropdown"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setData("Daily");
                      }}
                    >
                      <span>Daily</span>
                    </DropdownItem>
                  </li>
                  <li className={data === "Weekly" ? "active" : ""}>
                    <DropdownItem
                      tag="a"
                      href="#dropdown"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setData("Weekly");
                      }}
                    >
                      <span>Weekly</span>
                    </DropdownItem>
                  </li>
                  <li className={data === "Monthly" ? "active" : ""}>
                    <DropdownItem
                      tag="a"
                      href="#dropdown"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setData("Monthly");
                      }}
                    >
                      <span>Monthly</span>
                    </DropdownItem>
                  </li>
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
        <ul className="nk-top-products">
          {dataSet.map((item, idx) => (
            <li className="item" key={idx}>
              {/* <div className="thumb">
                <img src={item.img} alt="" />
              </div> */}
              <div className="info">
                <div className="title">{item.RouteName}</div>
                {/* <div className="price">{item.Crowd}</div> */}
              </div>
              <div className="total">
                <div className="amount">{item.Crowd}</div>
                {/* <div className="count">{item.Crowd}</div> */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default TopProducts;
