import React from "react";
import { Card } from "reactstrap";
import { Icon } from "../../Component";

const DataCardAnalytics = ({ title, amount, percentChange, up, chart: ChartComponent }) => {
  return (
    <Card>
      <div className="center nk-ecwg nk-ecwg6 ">
        <div className="card-inner ">
          <div className="card-title-group">
            <div className="card-title">
              <h6 className="title">{title}</h6>
            </div>
          </div>
          <div className="center data">
            <div className="data-group ">
              <div className="center amount">{amount}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataCardAnalytics;
