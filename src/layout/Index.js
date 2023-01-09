import React, { useEffect, useState, useLayoutEffect } from "react";
import Pages from "../route/Index";
import Sidebar from "./sidebar/Sidebar";
import Head from "./head/Head";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import classNames from "classnames";
import { PreviewCard, Block, BlockHead, BlockDes, BlockContent, BlockTitle, Row, Col } from "../components/Component";
import PageContainer from "./page-container/PageContainer";
import { userAuthStatus, fetchUserDetails, userPages, acc_status } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Button } from "reactstrap";
import { Redirect } from "react-router";

const Layout = () => {
  const currentAccess = useSelector(userPages);
  const accStatus = useSelector(acc_status);
  const userAuthLoading = useSelector(userAuthStatus);
  const dispatch = useDispatch();
  const [mobileView, setMobileView] = useState();
  const [visibility, setVisibility] = useState(false);
  const [themeState] = useState({
    main: "default",
    sidebar: "white",
    header: "white",
    skin: "light",
  });
  const logoutHandler = () => {
    sessionStorage.clear();
    window.history.pushState("", "", `${process.env.PUBLIC_URL}/auth-login`);
    window.location.reload();
  };
  useEffect(() => {
    if (userAuthLoading === "idle") dispatch(fetchUserDetails());
  }, [userAuthLoading, dispatch]);
  useEffect(() => {
    document.body.className = `nk-body bg-lighter npc-default has-sidebar no-touch nk-nio-theme ${
      themeState.skin === "dark" ? "dark-mode" : ""
    }`;
  }, [themeState.skin]);

  useEffect(() => {
    viewChange();
  }, []);

  // Stops scrolling on overlay
  useLayoutEffect(() => {
    if (visibility) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    }
    if (!visibility) {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
  }, [visibility]);

  // function to toggle sidebar
  const toggleSidebar = (e) => {
    e.preventDefault();
    if (visibility === false) {
      setVisibility(true);
    } else {
      setVisibility(false);
    }
  };

  // function to change the design view under 1200 px
  const viewChange = () => {
    if (window.innerWidth < 1200) {
      setMobileView(true);
    } else {
      setMobileView(false);
      setVisibility(false);
    }
  };
  window.addEventListener("load", viewChange);
  window.addEventListener("resize", viewChange);

  const sidebarClass = classNames({
    "nk-sidebar-mobile": mobileView,
    "nk-sidebar-active": visibility && mobileView,
  });
  //Fetching user details - Failed
  if (userAuthLoading === "failed") {
    sessionStorage.clear();
    return <Redirect to={`${process.env.PUBLIC_URL}/auth-login`} />;
  }
  //Fetching user details - Success
  if (userAuthLoading === "succeeded") {
    if (currentAccess.length > 0 && accStatus)
      return (
        <React.Fragment>
          <Head title="Loading" />
          <div className="nk-app-root">
            <div className="nk-main">
              <Sidebar
                sidebarToggle={toggleSidebar}
                fixed
                mobileView={mobileView}
                theme={themeState.sidebar}
                className={sidebarClass}
              />
              {visibility && mobileView && <div className="nk-sidebar-overlay" onClick={toggleSidebar}></div>}
              <div className="nk-wrap">
                <Header sidebarToggle={toggleSidebar} fixed setVisibility={setVisibility} theme={themeState.header} />
                <Pages currentAccess={currentAccess} />
                <Footer />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    return (
      <React.Fragment>
        <Head title="Approval Pending" />
        <PageContainer>
          <Block className="nk-block-middle nk-auth-body  wide-xs">
            <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
              <BlockHead>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",

                    borderRadius: "4px",
                    color: "#fff",
                  }}
                >
                  <BlockContent>
                    <BlockTitle tag="h4">Account Status Pending</BlockTitle>
                    <BlockDes>
                      <p>Waiting for approval</p>
                      <Spinner type="grow" color="primary" />
                      <br />
                      <br />
                      <Row>
                        <Col sm="6">
                          <Button color="primary" onClick={() => logoutHandler()}>
                            Logout
                          </Button>
                        </Col>
                        <Col sm="6">
                          <Button color="primary" outline onClick={() => window.location.reload()}>
                            Refresh
                          </Button>
                        </Col>
                      </Row>
                    </BlockDes>
                  </BlockContent>
                </div>
              </BlockHead>
            </PreviewCard>
          </Block>
        </PageContainer>
      </React.Fragment>
    );
  }

  //Fetching user details - In progress
  return (
    <React.Fragment>
      <Head title="Loading" />
      <div className="nk-app-root">
        <div className="nk-main">
          <div className="nk-wrap">
            <Spinner color="primary" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Layout;
