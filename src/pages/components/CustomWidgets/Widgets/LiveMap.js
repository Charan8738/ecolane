import axios from "axios";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { icon } from "leaflet";
import redBus from "../../../../assets/images/redbus.png";
import redTruck from "../../../../assets/images/redTruck.png";
import redCar from "../../../../assets/images/redCar.png";
import redBike from "../../../../assets/images/redBike.jpg";
import { PreviewCard } from "../../../../components/Component";
import { Spinner } from "reactstrap";
const LiveMap = ({ vehicleType, imei }) => {
  const VEHICLE_TYPES = { 1: redTruck, 2: redCar, 3: redCar, 4: redBike, 5: redBus };
  const [gpsData, setGpsData] = useState();
  const [loading, setLoading] = useState(false);
  const busIcon = icon({
    iconUrl: VEHICLE_TYPES[vehicleType],
    iconSize: [30, 30],
  });
  let d = new Date();
  const updateMsg = loading
    ? "Updating"
    : "Last updated at " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  const getlastGpsdata = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:5000/api/gpsdata")
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
          <MapContainer center={[gpsData.Latitude, gpsData.Longitude]} zoom={20}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[gpsData.Latitude, gpsData.Longitude]} icon={busIcon}></Marker>
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

export default LiveMap;
