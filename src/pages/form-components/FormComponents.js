import React from "react";
import { FormGroup, Input, ButtonGroup, Button } from "reactstrap";

export const LabelledInput = ({ title, id, name, value, type, onChangeHandler, register, errors }) => {
  return (
    <FormGroup>
      <label className="form-label" htmlFor={id}>
        {title}
      </label>
      <div className="form-control-wrap">
        <input
          ref={register({ required: true })}
          className="form-control"
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChangeHandler(e)}
          id={id}
        />
        {errors && <span className="invalid">This field is required</span>}
      </div>
    </FormGroup>
  );
};
export const InputSelect = ({ title, id, name, values, value, onChangeHandler }) => {
  return (
    <FormGroup>
      <label className="form-label" htmlFor={id}>
        {title}
      </label>
      <div className="form-control-wrap">
        <div className="form-control-select">
          <Input
            type="select"
            name={name}
            id={id}
            disabled={values.length === 0}
            value={value}
            onChange={(e) => onChangeHandler(e)}
          >
            {values.map((item) => (
              <option key={item.value} value={item.value}>
                {item.title}
              </option>
            ))}
          </Input>
        </div>
      </div>
    </FormGroup>
  );
};
export const ToggleBtn = ({ title, id, checked, onChangeHandler, messages }) => {
  return (
    <FormGroup>
      <label className="form-label" htmlFor={id}>
        {title}
      </label>
      <div className="form-control-wrap">
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input form-control"
            id={id}
            placeholder=""
            checked={checked}
            onChange={onChangeHandler}
          />
          <label className="custom-control-label" htmlFor={id}>
            {checked ? messages[0] : messages[1]}
          </label>
        </div>
      </div>
    </FormGroup>
  );
};
export const ButtonGrp = ({ id, title, buttons, value, onChangeHandler }) => {
  // buttons -> [{title:"Offline",value:"Offline""}]
  return (
    <FormGroup>
      <label className="form-label" htmlFor={id}>
        {title}
      </label>
      <div className="form-control-wrap">
        <ButtonGroup>
          {buttons.map((btn) => (
            <Button color="primary" outline={value !== btn.value} onClick={() => onChangeHandler(btn.value)}>
              {btn.title}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </FormGroup>
  );
};
export const RenderComponent = ({ component: Component, ...rest }) => {
  return <Component {...rest} />;
};
export const FormControlMap = { LI: LabelledInput, IS: InputSelect, TB: ToggleBtn, BG: ButtonGrp };
