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
  PaginationComponent,
  PreviewCard,
} from "../components/Component";
import { FormGroup, Input, Form } from "reactstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

const VehicleSetup = () => {
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const [QRList, setQRList] = useState([]);
  const [coachList, setCoachList] = useState([]);
  const [sm, updateSm] = useState(false);
  const [onSearchText, setSearchText] = useState("");
  const { errors, register, handleSubmit } = useForm();
  const onFormSubmit = () => {};
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };
  /* Fetching QR Numbers*/
  useEffect(() => {
    axios
      .get("https://ecolane-api.zig-web.com/api/Getbuschipmapping")
      .then((res) => {
        setQRList([...res.data]);
      })
      .catch((err) => {
        console.log("Error in fetching Bus mapping");
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
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand mr-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Search by vehicle no"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <Form className={formClass} onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="gy-4">
                <Col sm="6">
                  <FormGroup>
                    <label className="form-label" htmlFor="coach-list">
                      Coach List
                    </label>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <Input type="select" name="coach-list" id="coach-list">
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
                    <label className="form-label" htmlFor="coach-list">
                      QR Number
                    </label>
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <Input type="select" name="coach-list" id="coach-list">
                          {coachList.map((item) => (
                            <option key={item?.Id}>{item?.Coachno}</option>
                          ))}
                        </Input>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default VehicleSetup;
