import React, { useState, useEffect } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import classNames from "classnames";
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

const VehicleSetup = () => {
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const INITIAL_FORM_DATA = {
    Coachno: "",
    Busserialno: "",
    Odometer: 0,
    Deviceid: "",
    Updatetype: 2,
  };
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [QRList, setQRList] = useState([]);
  const [coachList, setCoachList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState();
  const [updatedDate, setUpdatedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = QRList.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const onFormSubmit = (e) => {
    e.preventDefault();
    const updatedVehicle = {
      ...formData,
      Odometerdatetime: updatedDate.toLocaleString(),
    };
    axios.post("https://zig-web.com/ZIGSmartWeb/api/Firmware/Buschipodoupdate", updatedVehicle).then((res) => {
      if (res.status === 200) {
        successAlert("Updated successfully");
        let currentVehicles = [...QRList];
        let updtIndex = currentVehicles.findIndex((item) => item.Macaddress === formData.Deviceid);
        currentVehicles[updtIndex] = {
          ...currentVehicles[updtIndex],
          Odometer: formData.Odometer,
          Bus_no: formData.Coachno,
          Bus_serialno: formData.Busserialno,
          Odometerdatetime: updatedDate.toISOString(),
        };
        setQRList(currentVehicles);
        setUpdatedDate(new Date());
        setFormData(INITIAL_FORM_DATA);
      }
    });
  };
  const onEditClick = (busDetails) => {
    console.log(busDetails);
    setEditId(busDetails.Id);
    setFormData((prev) => ({
      ...prev,
      Deviceid: busDetails.Macaddress,
      Coachno: +busDetails.Bus_no,
      Busserialno: busDetails.Bus_serialno,
      Odometer: busDetails.Odometer,
    }));
    setUpdatedDate(new Date(busDetails.Odometerdatetime));
    window.scrollTo(0, 0);
  };
  /* Fetching QR Numbers*/
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://ecolane-api.zig-web.com/api/Getbuschipmapping")
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
                Vehicle Setup
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
                      QR Number
                    </label>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <Input
                          type="select"
                          name="coach-list"
                          id="coach-list"
                          value={formData.Busserialno}
                          onChange={(e) => setFormData((prev) => ({ ...prev, Busserialno: e.target.value }))}
                        >
                          {QRList.map((item) => (
                            <option key={item?.Id}>{item?.Bus_serialno}</option>
                          ))}
                        </Input>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="coach-list">
                      Coach List
                    </label>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <Input
                          type="select"
                          name="coach-list"
                          id="coach-list"
                          value={formData.Coachno}
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
                      Odometer Value
                    </label>
                    <div className="form-control-wrap">
                      <input
                        value={formData.Odometer}
                        onChange={(e) => setFormData((prev) => ({ ...prev, Odometer: +e.target.value }))}
                        type="number"
                        min={0}
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
                    <label className="form-label"> Updated Date</label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={updatedDate}
                        onChange={setUpdatedDate}
                        className="form-control date-picker"
                      />{" "}
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <label>Firmware automatic update</label>
                    <div className="form-control-wrap">
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input form-control"
                          id="AutoUpdate"
                          placeholder=""
                        />
                        <label className="custom-control-label" htmlFor="AutoUpdate"></label>
                      </div>
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
                      <span>Coach</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>QR Number</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>GPS Address</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Odometer Value</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Odometer Last Updated</span>
                    </DataTableRow>
                    <DataTableRow className="nk-tb-col-tools">
                      <span>Actions</span>
                    </DataTableRow>
                  </DataTableHead>
                  {loading ? (
                    <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
                      <h6 className="title " style={{ textAlign: "center" }}>
                        <Spinner color="primary" />
                      </h6>
                    </div>
                  ) : null}
                  {currentItems.length > 0
                    ? currentItems.map((item) => {
                        return (
                          <DataTableItem key={item.Id}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="coach">{item.Bus_no}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.Bus_serialno}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.Macaddress}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">{item.Odometer}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-sub">{item.Odometerdatetime}</span>
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

export default VehicleSetup;
