import React, { useState } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import Swal from "sweetalert2";
import { FormGroup, Label, Input, Row, Col } from "reactstrap";
import {
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockBetween,
  Block,
  PreviewCard,
  OverlineTitle,
  Icon,
  Button,
} from "../components/Component";

const GTFS = () => {
  const [file, setFile] = useState("");
  const handleAdvanced3 = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Please confirm to save",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Saved!", "Your file has been saved.", "success");
      }
    });
  };
  return (
    <React.Fragment>
      <Head title="Homepage"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                City Setup
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block size="lg">
          <PreviewCard>
            <form>
              <Row className="gy-4">
                <Col sm="6">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      City
                    </Label>
                    <div className="form-control-wrap">
                      <input className="form-control" type="text" id="default-0" placeholder="Enter city" />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label htmlFor="default-4" className="form-label">
                      GTFS File Upload
                    </Label>
                    <div className="form-control-wrap">
                      <div className="custom-file">
                        <input
                          type="file"
                          multiple
                          className="custom-file-input form-control"
                          id="customFile"
                          onChange={(e) => setFile(e.target.files[0].name)}
                        />
                        <Label className="custom-file-label" htmlFor="customFile">
                          {file === "" ? "Choose file" : file}
                        </Label>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <hr className="preview-hr"></hr>
              <OverlineTitle tag="span" className="preview-title-lg">
                Enter Realtime Feed URL (.pb)
              </OverlineTitle>
              <Row className="gy-4">
                <Col sm="6">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      Vehicle Position
                    </Label>
                    <div className="form-control-wrap">
                      <input
                        className="form-control"
                        type="text"
                        id="vehicle-position"
                        placeholder="Enter vehicle position"
                      />
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="6">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      Trip Update
                    </Label>
                    <div className="form-control-wrap">
                      <input className="form-control" type="text" id="trip-update" placeholder="Enter trip update" />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label htmlFor="default-0" className="form-label">
                      Alert
                    </Label>
                    <div className="form-control-wrap">
                      <input className="form-control" type="text" id="default-0" placeholder="Enter alert" />
                    </div>
                  </FormGroup>
                </Col>
                <hr className="preview-hr"></hr>
                {OPTIONS.map((item) => (
                  <Col sm="12" key={item}>
                    <FormGroup>
                      <Label htmlFor="default-0" className="form-label">
                        {item}
                      </Label>
                      <Row>
                        <Col sm="4">
                          <FormGroup>
                            <div className="form-control-wrap">
                              <div className="custom-control custom-switch">
                                <input
                                  type="checkbox"
                                  className="custom-control-input form-control"
                                  id={item}
                                  placeholder=""
                                />
                                <label className="custom-control-label" htmlFor={item}></label>
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="4">
                          <div className="input-group input-group-md">
                            <div className="input-group-prepend">
                              <span className="input-group-text" id="inputGroup-sizing-md">
                                Name
                              </span>
                            </div>
                            <input type="text" className="form-control" />
                          </div>
                        </Col>
                        <Col sm="4">
                          <div className="input-group input-group-md">
                            <div className="input-group-prepend">
                              <span className="input-group-text" id="inputGroup-sizing-md">
                                URL
                              </span>
                            </div>
                            <input type="text" className="form-control" />
                          </div>
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                ))}
              </Row>
              <hr className="preview-hr"></hr>
              <Row className="g-3">
                <Col lg="7" className="offset-lg-5">
                  <FormGroup className="mt-2">
                    <Button
                      color="primary"
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAdvanced3();
                      }}
                    >
                      Save
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </form>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};
const OPTIONS = ["Bike Share", "Ride Share", "Micro Transit", "Para Transit", "Custom"];
export default GTFS;
