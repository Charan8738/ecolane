import React, { useState } from "react";
import { Block, BlockHead, BlockTitle, BlockHeadContent, Icon, Row, Col, Button } from "../../components/Component";
import classNames from "classnames";

import { Input, ButtonGroup, Form } from "reactstrap";
import { useForm } from "react-hook-form";
const AddProductModalThree = ({ client_name, client_id, onFormSubmit, categories }) => {
  
  const INITIAL_ADD_FORM2= {
   RideName: "",
    RideID: "",
    DeviceIDIN: "",
    DeviceIDOUT: "",
    AvgWaitTime: "",
    CurrentTokenNo: "",
    SlotsAvailable:"true",
    RequestedSlotToken: "",
    ExceptionMessage: "",
    ridecount: "",
    Creditperdollar:"",
  };
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });
  const { errors, register, handleSubmit } = useForm();
 

  const [formData, setFormData] = useState(INITIAL_ADD_FORM2);
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };  

  
  
  console.log(formData);
  return (
    <div>
      {" "}
      <BlockHead>
        <BlockHeadContent>
          <BlockTitle tag="h5">Add Ride</BlockTitle>
        </BlockHeadContent>
      </BlockHead>
      <Block>
        <Form
          className={formClass}
          onSubmit={handleSubmit(() => {
            console.log(formData);
            onFormSubmit({...formData });
            setFormData(INITIAL_ADD_FORM2);
            
          })}
        >
          <Row className="g-3">
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="beverage-name">
                  Ride Name
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    className="form-control"
                    name="RideName"
                    onChange={(e) => onInputChange(e)}
                    value={formData.RideName}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.RideName && <span className="invalid">This field is required</span>}
                </div>
              </div>
            </Col>
            

            
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="beverage-name">
                   Average Wait Time
                </label>
                <div className="form-control-wrap">
                  <input
                    type="number"
                    className="form-control"
                    name="AvgWaitTime"
                    value={formData.AvgWaitTime}
                    onChange={(e) => onInputChange(e)}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.AvgWaitTime && <span className="invalid">This field is required</span>}
                </div>
              </div>
            </Col>
            
            
              <Col size="12">
                <div className="form-group">
                  <label className="form-label" htmlFor="newCategory">
                    Slots Available
                  </label>

                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      name="SlotsAvailable"
                      onChange={(e) => onInputChange(e)}
                      value={formData.SlotsAvailable}
                      ref={register({ required: true})}
                    />
                    {errors.SlotsAvailable && <span className="invalid">This field is required</span>}
                  </div>
                  
                  <label style={{paddingTop:20}} className="form-label" htmlFor="BannerImageURL">
                    Exception Message
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      className="form-control"
                      name="ExceptionMessage"
                      value={formData.ExceptionMessage}
                      onChange={(e) => onInputChange(e)}
                      ref={register({ required:true })}
                    />
                    {errors.ExceptionMessage && <span className="invalid">This field is required</span>}
                  </div>
                </div>
              </Col>
           
            
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="ProductImageURL">
                  Ride ID
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    className="form-control"
                    name="RideID"
                    value={formData.RideID}
                    onChange={(e) => onInputChange(e)}
                    ref={register({ required: true })}
                  />
                  {errors.RideID && <span className="invalid">This field is required</span>}
                </div>
              </div>
              
            </Col>
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="ProductImageURL">
                  Device id IN
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    className="form-control"
                    name="DeviceIDIN"
                    onChange={(e) => onInputChange(e)}
                    value={formData.DeviceIDIN}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.DeviceIDIN && <span className="invalid">This field is required</span>}
                </div>
              </div>
            </Col>
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="ProductImageURL">
                  Device id OUT
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    className="form-control"
                    name="DeviceIDOUT"
                    onChange={(e) => onInputChange(e)}
                    value={formData.DeviceIDOUT}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.DeviceIDOUT && <span className="invalid">This field is required</span>}
                </div>
              </div>
            </Col>
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="ProductImageURL">
                Current Token No
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    className="form-control"
                    name="CurrentTokenNo"
                    onChange={(e) => onInputChange(e)}
                    value={formData.CurrentTokenNo}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.CurrentTokenNo && <span className="invalid">This field is required</span>}
                </div>
              </div>
            </Col>
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="ProductImageURL">
                Requested Slot Token
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    className="form-control"
                    name="RequestedSlotToken"
                    onChange={(e) => onInputChange(e)}
                    value={formData.RequestedSlotToken}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.RequestedSlotToken && <span className="invalid">This field is required</span>}
                </div>
              </div>
            </Col>
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="ProductImageURL">
                Credits per dollar
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    className="form-control"
                    name="Creditperdollar"
                    onChange={(e) => onInputChange(e)}
                    value={formData.Creditperdollar}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.Creditperdollar && <span className="invalid">This field is required</span>}
                </div>
              </div>
            </Col>
            <Col size="12">
              <div className="form-group">
                <label className="form-label" htmlFor="ProductImageURL">
               Ride Count
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    className="form-control"
                    name="ridecount"
                    onChange={(e) => onInputChange(e)}
                    value={formData.ridecount}
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.ridecount && <span className="invalid">This field is required</span>}
                </div>
              </div>
            </Col>
            
            

            <Col size="12">
              <Button color="primary" type="submit" >
                <Icon className="plus"></Icon>
                <span>Add Ride</span>
              </Button>
            </Col>
          </Row>
        </Form>
      </Block>
    </div>
  );
};

export default AddProductModalThree;
