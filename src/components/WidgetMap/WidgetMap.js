import React, { useEffect } from "react";
import "./WidgetMap.scss";
import { useSelector, useDispatch } from "react-redux";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Latitude, Longitude, selectSpeed, fetchLastGpsData } from "../../redux/gpsSlice";
import Speedometer, { Arc, Background, Needle, Progress, Marks, Indicator } from "react-speedometer";
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};
const SpeedometerWiddget = ({ value }) => {
  return (
    <div className="leaflet-bottom leaflet-left">
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
const WidgetMap = ({ device }) => {
  const dispatch = useDispatch();
  const lat = useSelector(Latitude);
  const lon = useSelector(Longitude);
  const speed = useSelector(selectSpeed);
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(fetchLastGpsData(device.WifiMacAddress));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="leaflet-container">
      <MapContainer center={[lat, lon]} zoom={80} scrollWheelZoom={true}>
        <TileLayer
          attribution='<a href="https://www.openstreetmap.org/copyright"></a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}></Marker>
        <RecenterAutomatically lat={lat} lng={lon} />
        <SpeedometerWiddget value={speed} />
      </MapContainer>
    </div>
  );
};

export default WidgetMap;
