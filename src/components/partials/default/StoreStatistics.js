import React from "react";
import { Card } from "reactstrap";
import { Icon } from "../../Component";

const StoreStatistics = ({ order, customers, products, categories }) => {
  console.log(order);
  console.log(customers);
  console.log(products);
  console.log(categories);
  return (
    <Card className="h-100">
      <div className="card-inner">
        <div className="card-title-group mb-2">
          <div className="card-title">
            <h6 className="title">App Statistics</h6>
          </div>
        </div>
        <ul className="nk-store-statistics">
          <li className="item">
            <div className="info">
              <div className="title">Orders</div>
              <div className="count">{order}</div>
            </div>
            <Icon name="bag" className="bg-primary-dim"></Icon>
          </li>
          <li className="item">
            <div className="info">
              <div className="title">Customers</div>
              <div className="count">{customers}</div>
            </div>
            <Icon name="users" className="bg-info-dim"></Icon>
          </li>
          <li className="item">
            <div className="info">
              <div className="title">Products</div>
              <div className="count">{products}</div>
              {/* <div className="count">{appstats[0].Products}</div> */}
            </div>
            <Icon name="box" className="bg-pink-dim"></Icon>
          </li>
          <li className="item">
            <div className="info">
              <div className="title">Categories</div>
              <div className="count">{categories}</div>
            </div>
            <Icon name="server" className="bg-purple-dim"></Icon>
          </li>
        </ul>
      </div>
    </Card>
  );
};
export default StoreStatistics;
