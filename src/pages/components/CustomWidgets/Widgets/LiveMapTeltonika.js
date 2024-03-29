import axios from "axios";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { icon } from "leaflet";
import redBus from "../../../../assets/images/redbus.png";
import redTruck from "../../../../assets/images/truck.png";
import redCar from "../../../../assets/images/car.png";
import redBike from "../../../../assets/images/motor-sports.png";
import { PreviewCard } from "../../../../components/Component";
import { Spinner, Card, CardBody, CardTitle } from "reactstrap";
const LiveMapTeltonika = ({ DeviceType, count, vehicleType, imei }) => {
  const VEHICLE_TYPES = { 1: redTruck, 2: redCar, 3: redCar, 4: redBike, 5: redBus, 10: redTruck };
  const [gpsData, setGpsData] = useState();
  const [loading, setLoading] = useState(false);
  const busIcon = icon({
    iconUrl: VEHICLE_TYPES[vehicleType],
    iconSize: [30, 30],
  });
  let d = new Date();
  const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
  };
  const updateMsg = loading
    ? "Updating"
    : "Last updated at " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  const getlastGpsdata = () => {
    setLoading(true);
    axios
      .get("https://gps-v2.zig-app.com/getlastGpsdata/" + imei)
      .then((res) => {
        setGpsData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getlastGpsdata();
    const timer = setInterval(() => {
      getlastGpsdata();
    }, 10000);

    return () => clearInterval(timer);
  }, []);
  return (
    <React.Fragment>
      <PreviewCard>{updateMsg}</PreviewCard>
      {gpsData ? (
        <div className="leaflet-container">
          <MapContainer center={[gpsData.latitude, gpsData.longitude]} zoom={20}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterAutomatically lat={gpsData.latitude} lng={gpsData.longitude} />
            {DeviceType === 3 && (
              <div className="leaflet-top leaflet-right">
                <div className="leaflet-control leaflet-bar" style={{ border: "none" }}>
                  <div style={{ width: "250px" }}>
                    <Card>
                      <CardBody className="card-inner">
                        <CardTitle className="text-primary" tag="h6">
                          Realtime Occupancy
                        </CardTitle>
                        <CardTitle className="center ff-mono" tag="h4">
                          {count}
                        </CardTitle>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            <Marker position={[gpsData.latitude, gpsData.longitude]} icon={busIcon}></Marker>
          </MapContainer>
        </div>
      ) : loading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <div>Try again later</div>
      )}
    </React.Fragment>
  );
};

export default LiveMapTeltonika;
