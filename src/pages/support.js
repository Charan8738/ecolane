import React, { useEffect, useState } from "react";
import Head from "../layout/head/Head";
import ContentAlt from "../layout/content/ContentAlt";
import { Button, Block, Icon, UserAvatar } from "../components/Component";
// import { messageData } from "../pages/app/messages/MessageData";
import Simplebar from "simplebar-react";
import { findUpper } from "../utils/Utils";
import MessageItem from "../pages/app/messages/MessageItem";
import axios from "axios";
import Moment from "react-moment";
const today = new Date().toISOString().slice(0, 10);

const support = () => {
  // const [data, setData] = useState(messageData);
  // const [filteredTabData, setFilteredTabData] = useState(messageData);

  const [search, setOnSearch] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [msgData, setMsgData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [filterTab, setFilterTab] = useState();
  const [selectedId, setSelectedIt] = useState();
  const [filterText, setFilterText] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const onInputChange = (e) => {
    setFilterText(e.target.value);
  };
  const theme = "primary";
  useEffect(() => {
    if (filterText !== "") {
      const filteredData = msgData.map((item) => ({
        Userid: item.Userid,
        Getreportissuelist: item.Getreportissuelist.filter(
          (rep) => rep.IssueId && String(rep.IssueId).toLowerCase().includes(filterText.toLowerCase())
        ),
      }));
      setTestData([...filteredData]);
      console.log(filteredData);
    } else {
      if (msgData.length > 0) {
        console.log("msg data available");
        // setTestData(msgData);
      } else {
        console.log("msg data not available");
        // setTestData(msgData);
      }
    }
  }, [filterText, filterTab]);

  useEffect(() => {
    const getSupportData = async () => {
      const response = await axios.get("Getreportissuelist?startDate=2023-05-01&endDate=" + today);
      return response.data;
    };
    getSupportData()
      .then((res) => {
        console.log(res);
        setMsgData(res);
        if (res[0]?.Getreportissuelist[0].isActive) {
          setSelectedIt(res[0]?.Getreportissuelist[0].IssueId);
        }
        setFilterTab("1");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("over");
      });
  }, []);
  useEffect(() => {
    let filteredData;
    console.log("filterTab");
    console.log(filterTab);
    if (filterTab === "1") {
      console.log(msgData);
      filteredData = msgData.map((item) => ({
        Userid: item.Userid,
        Getreportissuelist: item.Getreportissuelist.filter((rep) => rep.isActive),
      }));
      setTestData([...filteredData]);
    } else if (filterTab === "2") {
      console.log("Closed data");
      filteredData = msgData.map((item) => ({
        Userid: item.Userid,
        Getreportissuelist: item.Getreportissuelist.filter((rep) => !rep.isActive),
      }));
      setTestData([...filteredData]);
    } else if (filterTab === "4") {
      console.log("All data");
      setTestData(msgData);
    }
  }, [filterTab]);

  const onSearchBack = () => {
    setOnSearch(false);
    setFilterText("");
  };

  const onMessageClick = (id) => {
    setSelectedIt(id);
    if (window.innerWidth <= 990) {
      setMobileView(true);
    }
  };

  useEffect(() => {
    console.log(selectedId);
  }, [selectedId]);

  console.log(testData);
  return (
    <React.Fragment>
      <Head title="Support"></Head>

      <ContentAlt>
        <div className="nk-msg">
          <div className="nk-msg-aside hide-aside">
            <div className="nk-msg-nav">
              <ul className="nk-msg-menu">
                <li className={`nk-msg-menu-item ${filterTab === "1" && " active"}`} onClick={() => setFilterTab("1")}>
                  <a
                    href="#active"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    Active
                  </a>
                </li>
                <li className={`nk-msg-menu-item ${filterTab === "2" && " active"}`} onClick={() => setFilterTab("2")}>
                  <a
                    href="#closed"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    Closed
                  </a>
                </li>

                <li className={`nk-msg-menu-item ${filterTab === "4" && " active"}`} onClick={() => setFilterTab("4")}>
                  <a
                    href="#all"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    All
                  </a>
                </li>
                <li className="nk-msg-menu-item ms-auto" onClick={() => setOnSearch(true)}>
                  <a
                    href="#search"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                    className="search-toggle toggle-search"
                  >
                    <Icon name="search"></Icon>
                  </a>
                </li>
              </ul>
              <div className={`search-wrap ${search && " active"}`}>
                <div className="search-content">
                  <a
                    href="#search"
                    className="search-back btn btn-icon toggle-search"
                    onClick={(ev) => {
                      ev.preventDefault();
                      onSearchBack();
                    }}
                  >
                    <Icon name="arrow-left"></Icon>
                  </a>
                  <input
                    type="text"
                    className="border-transparent form-focus-none form-control"
                    placeholder="Search by Ticket ID"
                    onChange={(e) => onInputChange(e)}
                  />
                  <Button className="search-submit btn-icon">
                    <Icon name="search"></Icon>
                  </Button>
                </div>
              </div>
            </div>

            <Simplebar className="nk-msg-list">
              {/* {data.map((item) => {
                return (
                  <div
                    className={`nk-msg-item ${selectedId === item.id ? "current" : ""}`}
                    key={item.id}
                    onClick={() => onMessageClick(item.id)}
                  >
                    <UserAvatar
                      className="nk-nk-msg-media"
                      theme={item.theme}
                      image={item.image}
                      text={findUpper(item.name)}
                    ></UserAvatar>

                    <div className="nk-msg-info">
                      <div className="nk-msg-from">
                        <div className="nk-msg-sender">
                          <div className="name">{item.name}</div>
                          {item.closed && <div className={`lable-tag dot bg-danger`}></div>}
                        </div>
                        <div className="nk-msg-meta">
                          <div className="attchment">{item.attactchment && <Icon name="clip-h"></Icon>}</div>
                          <div className="date">{item.date}</div>
                        </div>
                      </div>
                      <div className="nk-msg-context">
                        <div className="nk-msg-text">
                          <h6 className="title">{item.messageTitle}</h6>
                          <p>{item.message}</p>
                        </div>
                        <div className="nk-msg-lables">
                          <div className="asterisk">
                            <a
                              href="#starred"
                              onClick={(ev) => {
                                ev.preventDefault();
                              }}
                            >
                              {item.marked ? (
                                <Icon className="asterisk-off" name="star-fill"></Icon>
                              ) : (
                                <Icon className="asterisk-off" name="star"></Icon>
                              )}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })} */}

              {testData.length > 0 &&
                testData.map((item, index) =>
                  item.Getreportissuelist.map((rep, repIndex) => (
                    <div
                      className={`nk-msg-item ${selectedId === rep.IssueId ? "current" : ""}`}
                      key={rep.IssueId}
                      onClick={() => onMessageClick(rep.IssueId)}
                    >
                      <UserAvatar
                        className="nk-nk-msg-media"
                        theme={rep.theme}
                        image={rep.image}
                        text={findUpper(rep.Username)}
                      ></UserAvatar>

                      <div className="nk-msg-info">
                        <div className="nk-msg-from">
                          <div className="nk-msg-sender">
                            <div className="name">{rep.Username}</div>
                            {/* {!rep.isActive && <div className={`lable-tag dot bg-danger`}></div>} */}
                          </div>
                          <div className="nk-msg-meta">
                            <div className="attchment">
                              {rep.Link !== "" && rep.Link !== null && <Icon name="clip-h" />}
                            </div>
                            <div className="date">
                              <Moment format="MMMM Do YYYY">{rep.CreatedDate}</Moment>
                            </div>
                          </div>
                        </div>
                        <div className="nk-msg-context">
                          <div className="nk-msg-text">
                            <h6 className="title">{rep.Description}</h6>
                            <p>{rep.Description}</p>
                          </div>
                          <div className="nk-msg-lables">
                            <div className="asterisk">
                              <a
                                href="#starred"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                }}
                              >
                                {item.isActive ? (
                                  <Icon className="asterisk-off" name="star-fill"></Icon>
                                ) : (
                                  <Icon className="asterisk-off" name="star"></Icon>
                                )}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
            </Simplebar>
          </div>
          {/*nk-aside*/}
          {selectedId ? (
            <MessageItem id={selectedId} setMobileView={setMobileView} mobileView={mobileView} />
          ) : (
            <MessageItem id={selectedId} setMobileView={setMobileView} mobileView={mobileView} />
          )}
        </div>
      </ContentAlt>
    </React.Fragment>
  );
};

export default support;
