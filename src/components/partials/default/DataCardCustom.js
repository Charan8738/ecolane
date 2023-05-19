import React from "react";
import { Card } from "reactstrap";
import { Icon } from "../../Component";
import styled from "styled-components";
const DataCardCustom = ({ title, amount, percentChange, up, chart: ChartComponent, image }) => {
  return (
    <Custom>
      <div className="nk-ecwg nk-ecwg6">
        <div className="card-inner">
          <ImageDiv>
            <div>
              <img src={image} alt="Image description" />
            </div>
          </ImageDiv>

          <div className="card-title-group">
            <div className="card-title">
              <h6 className="title">{title}</h6>
            </div>
          </div>
          <div className="data">
            <div className="data-group">
              <div className="amount">{amount}</div>
              {/* <ImageDiv className="nk-ecwg6-ck">{ChartComponent}</ImageDiv> */}
            </div>
          </div>
        </div>
      </div>
    </Custom>
  );
};
const ImageDiv = styled.div`
  position: absolute;
  background: #fff;
  height: 112px;
  width: 90px;
  right: 22px;
  top: 22px;
  border-radius: 10px;
  background: #edf1f4;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Custom = styled.div`
  background: linear-gradient(270.2deg, #adbbe0 22.84%, #c6e6f8 75.17%);
  border-radius: 10px;
`;
export default DataCardCustom;
