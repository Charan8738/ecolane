import React, { useEffect, useRef, useState } from "react";
import { PreviewCard } from "../../../../components/Component";
import { FormGroup, Label, Row, Col, ButtonGroup } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "../../SystemDeviceMap/SystemDeviceMap.scss";
import "leaflet-rotatedmarker";
import { Button, Spinner } from "reactstrap";
import Speedometer, { Arc, Background, Needle, Progress, Marks, Indicator } from "react-speedometer";
import { icon } from "leaflet";
import redBus from "../../../../assets/images/redbus.png";
import redTruck from "../../../../assets/images/redTruck.png";
import redCar from "../../../../assets/images/redCar.png";
import redBike from "../../../../assets/images/redBike.jpg";
const SpeedometerWiddget = ({ value }) => {
  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar" style={{ border: "none" }}>
        <div style={{ height: 130, width: 150 }}>
          <Speedometer value={value} max={100} angle={180} min={0} height={150} width={150}>
            <Background opacity={0.8} />
            <Arc />
            <Needle />
            <Progress />
            <Marks />
            <Indicator fontSize={35} />
          </Speedometer>
        </div>
      </div>
    </div>
  );
};
const PathEvaluation = ({ data, setPath }) => {
  const map = useMap();
  useEffect(() => {
    let newPath = data.map((coordinates, i, array) => {
      if (i === 0) return [...coordinates, 0]; //[ lat, lng, speed,distance ]
      const distance = map.distance(coordinates, array[0]);
      return [...coordinates, distance];
    });
    //Updating with angle; path--> [ lat, lng, speed, distance, angle]
    newPath = newPath.map((currPoint, i) => {
      if (i < newPath.length - 1) {
        let nextPoint = newPath[i + 1];
        let angle = (Math.atan2(nextPoint[1] - currPoint[1], nextPoint[0] - currPoint[0]) * 180) / Math.PI;
        return [...currPoint, angle + 90];
      }
      let lastPoint = newPath[i - 1];
      return [...currPoint, lastPoint[4]];
    });
    setPath(newPath);
  }, []);
  return null;
};
const HistoryMap = ({ vehicleType, imei }) => {
  const VEHICLE_TYPES = { 1: redTruck, 2: redCar, 3: redCar, 4: redBike, 5: redBus };
  const VELOCITY = 54;
  const redOptions = { color: "red" };
  const busIcon = icon({
    iconUrl: VEHICLE_TYPES[vehicleType],
    iconSize: [30, 30],
  });
  const [velocity, setVelocity] = useState(27);
  const runningStatus = useRef();
  const [startDate, setStartDate] = useState(new Date());
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [prevDistance, setPrevDistance] = useState(0);
  const [path, setPath] = useState([]); // path - [ [lat1, lng1, dist1],[lat2, lng2, dist2], ...]
  const [progress, setProgress] = useState([]);
  const [intervalId, setIntervalId] = useState();
  const updatePath = (newValue) => {
    setPath([...newValue]);
  };
  const getDistance = (initialDate, velocity, prevD) => {
    const differentInTime = (new Date() - initialDate) / 1000;
    console.log(velocity);
    console.log(prevD);
    return prevD + differentInTime * velocity;
  };
  const moveMarker = (initialDate, velocity, prevD) => {
    const distance = getDistance(initialDate, velocity, prevD);
    const progress = path.filter((i) => i[3] <= distance);
    setProgress([...progress]);
  };
  const changeVelocity = (vel) => {
    setPrevDistance(progress[progress.length - 1][3]);
    let prevD = progress[progress.length - 1][3];
    clearInterval(intervalId);
    setIntervalId(0);
    let initialDate = new Date();
    const newTimer = setInterval(() => {
      moveMarker(initialDate, vel, prevD);
    }, 1000);
    setIntervalId(newTimer);
  };
  const startAnimation = () => {
    console.log("Start animation functiion");
    if (intervalId) {
      //Pause functionality
      setPrevDistance(progress[progress.length - 1][3]);
      clearInterval(intervalId);
      setIntervalId(0);
      return;
    }
    // start functionality
    setVelocity(27);
    let initialDate = new Date();
    const newTimer = setInterval(() => {
      moveMarker(initialDate, 27, prevDistance);
    }, 1000);
    setIntervalId(newTimer);
  };
  const resetAnimation = () => {
    if (intervalId) clearInterval(intervalId);
    setPrevDistance(0);
    setVelocity(27);
    setIntervalId(0);
    setProgress([]);
  };

  useEffect(() => {
    const getHistoryMapData = async () => {
      try {
        const yyyy = startDate.getFullYear();
        let mm = startDate.getMonth() + 1;
        if (mm < 10) mm = "0" + mm;
        let dd = startDate.getDate();
        if (dd < 10) dd = "0" + dd;
        const date = yyyy + "-" + mm + "-" + dd;
        const response = await axios.get(`api/getGpsForDate?date=${date}&imei=${imei}`);
        return [...response.data];
      } catch (err) {
        throw err;
      }
    };
    setLoading(true);
    getHistoryMapData()
      .then((res) => {
        setHistoryData([...res]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate]);

  let lastPoint = [];
  const data = historyData.map((item) => [+item.Latitude, +item.Longitude, +item.speed]);
  if (progress.length > 0) lastPoint = progress[progress.length - 1];
  if (isLoading) return <Spinner color="primary" />;
  return (
    <React.Fragment>
      <PreviewCard>
        <Row className="gy-4">
          <Col xs="12" sm="6">
            <FormGroup>
              <Label>Date</Label>
              <div className="form-control-wrap" style={{ zIndex: 10000 }}>
                <DatePicker selected={startDate} onChange={setStartDate} className="form-control date-picker" />{" "}
              </div>
            </FormGroup>
          </Col>
          <Col xs="12" sm="6">
            <FormGroup>
              <Label>Playback Controls</Label>
              <div className="form-control-wrap">
                <Button
                  onClick={() => {
                    startAnimation();
                  }}
                  color="primary"
                  disabled={data.length === 0}
                >
                  {intervalId ? "Pause" : "Start"}
                </Button>
                <ButtonGroup style={{ margin: "0 2rem" }}>
                  <Button
                    color="primary"
                    outline={velocity !== 27}
                    onClick={() => {
                      setVelocity(27);
                      changeVelocity(27);
                    }}
                  >
                    1X
                  </Button>
                  <Button
                    color="primary"
                    outline={velocity !== 108}
                    onClick={() => {
                      setVelocity(108);
                      changeVelocity(108);
                    }}
                  >
                    2X
                  </Button>
                  <Button
                    color="primary"
                    outline={velocity !== 216}
                    onClick={() => {
                      setVelocity(216);
                      changeVelocity(216);
                    }}
                  >
                    4X
                  </Button>
                </ButtonGroup>
                <Button onClick={resetAnimation} color="primary" outline disabled={data.length === 0}>
                  Reset
                </Button>
              </div>
            </FormGroup>
          </Col>
        </Row>
      </PreviewCard>
      {data.length > 0 ? (
        <div className="leaflet-container">
          <MapContainer bounds={data} zoom={13}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {progress.length > 0 && (
              <>
                <SpeedometerWiddget value={progress.length === data.length ? 0 : lastPoint[2]} />
                <Marker
                  position={[lastPoint[0], lastPoint[1]]}
                  icon={busIcon}
                  rotationAngle={lastPoint[4]}
                  rotationOrigin="center"
                ></Marker>

                <Polyline pathOptions={redOptions} positions={progress.map((i) => [i[0], i[1]])} />
              </>
            )}
            <Polyline pathOptions={{ color: "lime" }} positions={data} />
            {/* GetDistance doesnt render anything on screen. Used just as a util*/}
            <PathEvaluation data={data} setPath={updatePath} />
          </MapContainer>
        </div>
      ) : (
        <div>No Data Found </div>
      )}
    </React.Fragment>
  );
};

export default HistoryMap;
