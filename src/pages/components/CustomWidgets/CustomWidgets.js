import React from "react";
import { useState } from "react";
import { Block, BlockHead, BlockHeadContent, BlockTitle, PreviewCard, Row, Col } from "../../../components/Component";
import BatteryChart from "./Widgets/BatteryChart";

const CustomWidgets = ({ gpsData }) => {
  return (
    <div>
      {" "}
      <Block size="lg">
        <Row className="g-gs">
          <Col md={6}>
            <PreviewCard>
              <div className="card-head">
                <h6 className="title">Device Wifi Strength</h6>
              </div>
              <div className="nk-ck-sm">
                <BatteryChart legend={false} data={[]} />
              </div>
            </PreviewCard>
          </Col>

          <Col md={6}>
            <PreviewCard>
              <div className="card-head">
                <h6 className="title">Device Wifi Strength</h6>
              </div>
              <div className="nk-ck-sm">
                <BatteryChart legend={false} data={[]} />
              </div>
            </PreviewCard>
          </Col>
        </Row>
      </Block>
    </div>
  );
};

export default CustomWidgets;
