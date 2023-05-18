import React from "react";
import { Card } from "reactstrap";
import { DataTableHead, DataTableRow, DataTableItem, UserAvatar } from "../../../Component";
import { recentOrderData } from "./OrderData";
import Moment from "react-moment";
import "moment-timezone";
const RecentOrders = ({ transactionsData }) => {
  return (
    <Card className="card-full">
      <div className="card-inner">
        <div className="card-title-group">
          <div className="card-title">
            <h6 className="title">Recent Transactions</h6>
          </div>
        </div>
      </div>
      <div className="nk-tb-list mt-n2">
        <DataTableHead>
          <DataTableRow>
            <span>Order No.</span>
          </DataTableRow>
          <DataTableRow size="sm">
            <span>Customer</span>
          </DataTableRow>
          <DataTableRow size="md">
            <span>Date</span>
          </DataTableRow>
          <DataTableRow>
            <span>Amount</span>
          </DataTableRow>
          <DataTableRow>
            <span className="d-none d-sm-inline">Status</span>
          </DataTableRow>
        </DataTableHead>
        {transactionsData.map((item, idx) => (
          <DataTableItem key={idx}>
            <DataTableRow>
              <span className="tb-lead">
                <a href="#order" onClick={(ev) => ev.preventDefault()}>
                  {item.Txn_id}
                </a>
              </span>
            </DataTableRow>
            <DataTableRow size="sm">
              <div className="user-card">
                {/* <UserAvatar className="sm" theme={item.theme} text={item.initial} image={item.img}></UserAvatar> */}
                <div className="user-name">
                  <span className="tb-lead">{item.Username}</span>
                </div>
              </div>
            </DataTableRow>
            <DataTableRow size="md">
              <span className="tb-sub">
                <Moment format="MMMM Do YYYY, h:mm a">{item.Createddate}</Moment>
              </span>
            </DataTableRow>
            <DataTableRow>
              <span className="tb-sub tb-amount">
                {item.Amount} <span>USD</span>
              </span>
            </DataTableRow>
            <DataTableRow>
              <span
                className={`badge badge-dot badge-dot-xs badge-${item.Txnstatus === "approved" ? "success" : "danger"}`}
              >
                {item.Txnstatus === "approved" ? "Success" : "Failed"}
              </span>
            </DataTableRow>
          </DataTableItem>
        ))}
      </div>
    </Card>
  );
};
export default RecentOrders;
