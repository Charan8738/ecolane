import React, { useState } from "react";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import Logo from "../../images/ZED-Logo.png";
import { Form, FormGroup, Spinner, Alert } from "reactstrap";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { useForm } from "react-hook-form";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
toast.configure();
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const CustomToast = () => {
  return (
    <div className="toastr-text">
      <h5>Logged-In Successfully</h5>
      <p>Your have successfully Logged In.</p>
    </div>
  );
};
const messageToast = () => {
  toast.success(<CustomToast />, {
    position: "bottom-right",
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: false,
    closeButton: <CloseButton />,
  });
};
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errVal, setError] = useState(false);
  const [passState, setPassState] = useState(false);
  const [loginName, setLoginName] = useState();
  const [pass, setPass] = useState();

  const onFormSubmit = () => {
    setError(false);
    setLoading(true);
    let isMounted = true; // Add a flag to check if the component is mounted

    axios
      .post("client/login", {
        email: loginName,
        password: pass,
      })
      .then((response) => {
        if (isMounted) {
          setLoading(false);

          if (response.data.access_token && response.data.refresh_token) {
            messageToast();
            sessionStorage.setItem("accessToken", response.data.access_token);
            sessionStorage.setItem("refreshToken", response.data.refresh_token);

            setTimeout(() => {
              window.history.pushState(
                `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
                "auth-login",
                `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
              );
              window.location.reload();
            }, 2000);

            setLoading(false);
          }
          setError(true);
        }
      })
      .finally(() => {
        isMounted = false; // Set the flag to false when the operation is complete
      });
  };

  const { errors, register, handleSubmit } = useForm();
  if (sessionStorage.getItem("accessToken")) return <Redirect to="/" />;
  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={Logo} alt="logo-dark" />
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Sign-In</BlockTitle>
                <BlockDes>
                  <p>Access Ecolane Admin Panel using your email and passcode.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            {errVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> Unable to login with credentials{" "}
                </Alert>
              </div>
            )}
            <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="default-01"
                    name="loginName" // Update the name attribute to "loginName"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your email address "
                    className="form-control-lg form-control"
                  />
                  {errors.name && <span className="invalid">{errors.name.message}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  {/* <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                    Forgot Code?
                  </Link> */}
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="pass" // Update the name attribute to "pass"
                    value={pass}
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your passcode"
                    onChange={(e) => setPass(e.target.value)}
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <Button size="lg" className="btn-block" type="submit" color="primary">
                  {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                </Button>
              </FormGroup>
            </Form>
            <div className="form-note-s2 text-center pt-4">
              {" "}
              New user? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Login;
