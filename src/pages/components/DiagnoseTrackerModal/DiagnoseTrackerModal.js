import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Spinner } from "reactstrap";
import { Block, BlockHead, BlockTitle, BlockHeadContent, Row, Col, Button } from "../../../components/Component";
import successImg from "../../../assets/images/success.png";
import failureImg from "../../../assets/images/failure.jpg";
const DiagnoseTrackerModal = ({ imei }) => {
  const [isLoading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [gpsData, setGpsData] = useState();
  useEffect(() => {
    const getLastGpsData = async () => {
      const response = await axios.get("api/getlastGpsdata/" + imei);
      return response.data;
    };
    if (initialLoad) {
      setLoading(true);
      getLastGpsData()
        .then((res) => {
          setGpsData(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          setInitialLoad(false);
        });
    }
  }, [imei, initialLoad]);
  return (
    <div>
      <BlockHead>
        <BlockHeadContent>
          <BlockTitle tag="h5">Diagnose Tracker</BlockTitle>
        </BlockHeadContent>
      </BlockHead>
      <Block>
        <ul className="data-list is-compact">
          <li className="data-item">
            <div className="data-col" style={{ display: "flex", justifyContent: "space-around" }}>
              <div className="data-value" style={{ flex: 1 }}>
                {" "}
                Unplug{" "}
              </div>
              <div className="data-value" style={{ flex: 1 }}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <img src={gpsData?.Unplug === "0" ? successImg : failureImg} alt="" height="30ox" width="30ox" />
                )}
              </div>
            </div>
          </li>
          <li className="data-item">
            <div className="data-col" style={{ display: "flex", justifyContent: "space-around" }}>
              <div className="data-value" style={{ flex: 1 }}>
                {" "}
                Movement{" "}
              </div>
              <div className="data-value" style={{ flex: 1 }}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <img src={gpsData?.Movement === "1" ? successImg : failureImg} alt="" height="30ox" width="30ox" />
                )}
              </div>
            </div>
          </li>
          <li className="data-item">
            <div className="data-col" style={{ display: "flex", justifyContent: "space-around" }}>
              <div className="data-value" style={{ flex: 1 }}>
                {" "}
                Ignition{" "}
              </div>
              <div className="data-value" style={{ flex: 1 }}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <img src={gpsData?.ignition === "1" ? successImg : failureImg} alt="" height="30ox" width="30ox" />
                )}
              </div>
            </div>
          </li>
          <li className="data-item">
            <div className="data-col" style={{ display: "flex", justifyContent: "space-around" }}>
              <div className="data-value" style={{ flex: 1 }}>
                {" "}
                Sleep mode{" "}
              </div>
              <div className="data-value" style={{ flex: 1 }}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <img src={gpsData?.SleepMode === "1" ? successImg : failureImg} alt="" height="30ox" width="30ox" />
                )}
              </div>
            </div>
          </li>
          <li className="data-item">
            <div className="data-col" style={{ display: "flex", justifyContent: "space-around" }}>
              <div className="data-value" style={{ flex: 1 }}>
                {" "}
                ac_status{" "}
              </div>
              <div className="data-value" style={{ flex: 1 }}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <img src={gpsData?.ac_status ? successImg : failureImg} alt="" height="30ox" width="30ox" />
                )}
              </div>
            </div>
          </li>
        </ul>
        <Button onClick={() => setInitialLoad(true)} color="primary">
          Recheck
        </Button>
      </Block>
    </div>
  );
};

export default DiagnoseTrackerModal;
