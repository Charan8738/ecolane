import React, { useState, useEffect } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import classNames from "classnames";
import Moment from "react-moment";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  BlockBetween,
  Row,
  Col,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  PreviewCard,
} from "../components/Component";
import DatePicker from "react-datepicker";
import { FormGroup, Input, Form, Button, Card, Spinner } from "reactstrap";
import axios from "axios";
import { successAlert } from "../utils/Utils";

const Alerts = () => {
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const INITIAL_FORM_DATA = {
    id: 1,
    Coachno: "",
    Busserialno: "",
    Odometer: "",
    Deviceid: "",
    Updatetype: 2,
    routeno: "",
  };
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [QRList, setQRList] = useState([]);
  const [RoutesList, setRoutesList] = useState([]);
  const [coachList, setCoachList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState();
  const [updatedDate, setUpdatedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = QRList.slice(indexOfFirstItem, indexOfLastItem);
  const CurrentRoutes = RoutesList.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const onFormSubmit = (e) => {
    e.preventDefault();
    const updatedVehicle = {
      // ...formData,
      id: formData.id,
      coach_no: formData.Coachno,
      route_name: formData.routeno,
      driver_name: formData.Odometer,
      schedule_date: updatedDate,
    };
    axios.put("EditRoutes", updatedVehicle).then((res) => {
      if (res.status === 200) {
        successAlert("Updated successfully");
        let currentVehicles = [...RoutesList];
        let updtIndex = currentVehicles.findIndex((item) => item.id === formData.id);
        console.log(updtIndex);
        console.log(formData.id);
        currentVehicles[updtIndex] = {
          ...currentVehicles[updtIndex],
          route_name: formData.routeno,
          driver_name: formData.Odometer,
          coach_no: formData.Coachno,
          schedule_date: updatedDate,
        };
        setRoutesList(currentVehicles);
        setUpdatedDate(new Date());
        setFormData(INITIAL_FORM_DATA);
      }
    });
  };
  const onEditClick = (busDetails) => {
    console.log(busDetails);
    setEditId(busDetails.id);
    setFormData((prev) => ({
      ...prev,
      id: busDetails.id,
      Deviceid: busDetails.route_name,
      routeno: busDetails.route_name,
      Coachno: +busDetails.coach_no,
      Busserialno: busDetails.coach_no,
      Odometer: busDetails.driver_name,
    }));
    setUpdatedDate(new Date(busDetails.schedule_date));
    window.scrollTo(0, 0);
  };
  /* Fetching QR Numbers*/
  useEffect(() => {
    setLoading(true);
    axios
      .get("lima/GetStandardBusLines")
      .then((res) => {
        setQRList([...res.data]);
      })
      .catch((err) => {
        console.log("Error in fetching Bus mapping");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    setLoading(true);
    axios
      .get("getRoutes")
      .then((res) => {
        setRoutesList([...res.data]);
      })
      .catch((err) => {
        console.log("Error in fetching Bus mapping");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  /* Fetching Coach List*/
  useEffect(() => {
    axios
      .get("https://ecolane-api.zig-web.com/api/getCoachlist")
      .then((res) => {
        setCoachList([...res.data]);
      })
      .catch((err) => {
        console.log("Error in fetching Coach list");
      });
  }, []);

  return (
    <React.Fragment>
      <Head title="Vehicle Setup"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Run Cutting
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <Form className={formClass} onSubmit={onFormSubmit}>
              <Row className="gy-4">
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="coach-list">
                      Route Name
                    </label>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <Input
                          type="select"
                          name="coach-list"
                          id="coach-list"
                          value={formData.routeno}
                          onChange={(e) => setFormData((prev) => ({ ...prev, routeno: e.target.value }))}
                        >
                          {QRList.map((item) => (
                            <option key={item?.Id}>{item?.RouteName}</option>
                          ))}
                        </Input>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="coach-list">
                      Coach Number
                    </label>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <Input
                          type="select"
                          name="coach-list"
                          id="coach-list"
                          value={formData.Coachno}
                          disabled
                          onChange={(e) => setFormData((prev) => ({ ...prev, Coachno: e.target.value }))}
                        >
                          {coachList.map((item) => (
                            <option key={item?.Id}>{item?.Coachno}</option>
                          ))}
                        </Input>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="odometerValue">
                      Driver Name
                    </label>
                    <div className="form-control-wrap">
                      <input
                        value={formData.Odometer}
                        onChange={(e) => setFormData((prev) => ({ ...prev, Odometer: e.target.value }))}
                        type="text"
                        required
                        name="OdometerValue"
                        className="form-control"
                        id="odometerValue"
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label"> Scheduled Date</label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={updatedDate}
                        onChange={setUpdatedDate}
                        className="form-control date-picker"
                      />{" "}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <hr className="preview-hr"></hr>
              <Row className="g-3">
                <Col lg="7" className="offset-lg-5">
                  <FormGroup className="mt-2">
                    <Button color="primary" type="submit">
                      Update
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </PreviewCard>
        </Block>
        <Block>
          <Card>
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <DataTableBody>
                  <DataTableHead>
                    <DataTableRow size="sm">
                      <h6>Route Name</h6>
                    </DataTableRow>
                    <DataTableRow>
                      <h6>Coach Number</h6>
                    </DataTableRow>
                    <DataTableRow>
                      <h6>Driver Name</h6>
                    </DataTableRow>
                    <DataTableRow>
                      <h6>Scheduled Date</h6>
                    </DataTableRow>

                    <DataTableRow className="nk-tb-col-tools">
                      <h6>Actions</h6>
                    </DataTableRow>
                  </DataTableHead>
                  {loading ? (
                    <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
                      <h6 className="title " style={{ textAlign: "center" }}>
                        <Spinner color="primary" />
                      </h6>
                    </div>
                  ) : null}
                  {CurrentRoutes.length > 0
                    ? CurrentRoutes.map((item) => {
                        return (
                          <DataTableItem key={item.id}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="coach">{item.route_name}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.coach_no}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.driver_name}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <Moment format="MMMM Do YYYY, h:mm a">{item.schedule_date}</Moment>
                            </DataTableRow>
                            <DataTableRow className="nk-tb-col-tools">
                              <Button color="primary" className="btn-sm" onClick={() => onEditClick(item)}>
                                Edit
                              </Button>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })
                    : null}
                </DataTableBody>
                <div className="card-inner">
                  {QRList.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={QRList.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Alerts;
