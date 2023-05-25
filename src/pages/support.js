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

const support = () => {
  const [data, setData] = useState(messageData);
  const [filteredTabData, setFilteredTabData] = useState(messageData);
  const [filterTab, setFilterTab] = useState("1");
  const [search, setOnSearch] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const [testData, setTestData] = useState(msgData);
  let select = 0;
  select = msgData[0]?.Getreportissuelist[0].IssueId;
  const [selectedId, setSelectedIt] = useState(select);

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
      setTestData(filteredData);
      console.log(filteredData);
    } else {
      setTestData(msgData);
    }
  }, [filterText, filterTab, filteredTabData]);

  // useEffect(() => {
  //   let filteredData;
  //   if (filterTab === "1") {
  // filteredData = messageData.filter((item) => {
  //   return item.closed === false;
  // });
  //     setData(filteredData);
  //     setFilteredTabData(filteredData);
  //   } else if (filterTab === "2") {
  //     filteredData = messageData.filter((item) => {
  //       return item.closed === true;
  //     });
  //     setData(filteredData);
  //     setFilteredTabData(filteredData);
  //   } else if (filterTab === "3") {
  //     filteredData = messageData.filter((item) => {
  //       return item.marked === true;
  //     });
  //     setData(filteredData);
  //     setFilteredTabData(filteredData);
  //   } else {
  //     filteredData = messageData;
  //     setData(filteredData);
  //     setFilteredTabData(filteredData);
  //   }
  // }, [filterTab]);

  useEffect(() => {
    let filteredData;
    console.log("filterTab");
    console.log(filterTab);
    if (filterTab === "1") {
      console.log("Active data");
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
      setTestData([...msgData]);
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

              {testData.map((item, index) =>
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
          <MessageItem id={selectedId} setMobileView={setMobileView} mobileView={mobileView} data={data} />
        </div>
      </ContentAlt>
    </React.Fragment>
  );
};
const messageData = [
  {
    id: 1,
    name: "Abu Ibn Ishtiakk",
    theme: "primary",
    date: "12 Jan",
    attactchment: true,
    marked: true,
    closed: true,
    messageTitle: "Unable to select currency when order",
    message: "Hello team, I am facing problem as i can not select",
    messageMarkup: [
      "Hello team,I am facing problem as i can not select currency on buy order page. Can you guys let me know what i am doing doing wrong? Please check attached files.Thank you,Ishityak",
    ],
    reply: [
      {
        replyId: "rep_1",
        name: "Support Team",
        theme: "pink",
        date: "14 Jan, 2019",
        time: "11:32 AM",
        replyMarkup: [
          "Hello Ishtiyak,",
          "We are really sorry to hear that, you have face an unexpected experience. Our team urgently look this matter and get back to you asap. ",
          "Thank you very much. ",
        ],
      },
      {
        meta: {
          metaId: "meta_1",
          metaMarkup: `<div class="nk-reply-meta-info"><span class="who">Iliash Hossian</span> assigned user: <span class="whom">Saiful Islam</span> at 14 Jan, 2020 at 11:34 AM</div>`,
        },
      },
      {
        replyId: "rep_2",
        note: true,
        name: "Iliash Hossain",
        time: "11:32 AM",
        date: "14 Jan, 2020",
        replyMarkup: ["Devement Team need to check out the issues."],
      },
      {
        meta: {
          metaId: "meta_2",
          metaMarkup: `<div class="nk-reply-meta-info"><strong>15 January 2020</strong></div>`,
        },
      },
      {
        replyId: "rep_3",
        name: "Support Team",
        theme: "pink",
        date: "14 Jan, 2019",
        time: "11:32 AM",
        replyMarkup: [
          "Hello Ishtiyak,",
          "We are really sorry to hear that, you have face an unexpected experience. Our team urgently look this matter and get back to you asap. ",
          "Thank you very much. ",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Jackelyn Dugas",
    date: "15 Jan",
    marked: true,
    closed: false,
    messageTitle: "Have not received bitcoins after payment",
    message: "Hey! I recently bought bitcoin from you. But still have not",
    messageMarkup: [
      "Hey!",
      "I recently bought bitcoin from you. But still have not recieved any of it yet",
      "Could you please send it as soon as possible",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
  {
    id: 3,
    name: "Mayme Johnston",
    theme: "purple",
    date: "11 Jan",
    marked: false,
    closed: false,
    messageTitle: "I can not submit kyc application",
    message: "Hello support! I can not upload my documents on kyc application.",
    messageMarkup: [
      "Hello Support!",
      "I can not upload my documents on kyc application.",
      "Could you please check what is the problem",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
  {
    id: 4,
    name: "Jake Smity",
    date: "30 Dec, 2019",
    marked: false,
    closed: true,
    messageTitle: "I can not submit kyc application",
    message: "Hello support! I can not upload my documents on kyc application.",
    messageMarkup: [
      "Hello Support!",
      "I can not upload my documents on kyc application.",
      "Could you please check what is the problem",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
  {
    id: 5,
    name: "Amanda Moore",
    date: "28 Dec, 2019",
    marked: false,
    closed: false,
    messageTitle: "Wallet needs to verify.",
    message: "Hello, I already varified my Wallet but it still showing",
    messageMarkup: [
      "Hello!",
      "I already varified my Wallet but it still showing that the wallet is not verified.",
      "Could you please check what is the problem",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
  {
    id: 6,
    name: "Rebecca Valdez",
    theme: "primary",
    date: "26 Dec, 2019",
    marked: false,
    closed: false,
    messageTitle: "I want my money back.",
    message: "Hey! I don't want to stay as your subscriber any more,",
    messageMarkup: [
      "Heey!",
      "I don't want to stay as your subscriber any more.",
      "Could you please return my money as soon as possible",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
  {
    id: 7,
    name: "Charles Greene",
    theme: "orange",
    date: "21 Dec, 2019",
    marked: false,
    closed: false,
    messageTitle: "Have not received bitcoins yet",
    message: "Hey! I recently bitcoin from you. But still have not",
    messageMarkup: [
      "Hey!",
      "I recently bought bitcoin from you. But still have not recieved any of it yet",
      "Could you please send it as soon as possible",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
  {
    id: 8,
    name: "Ethan Anderson",
    theme: "success",
    date: "21 Dec, 2019",
    marked: false,
    closed: false,
    messageTitle: "Unable to select currency when order",
    message: "Hello team, I am facing problem as i can not select",
    messageMarkup: [
      "Hello Team!",
      "I am facing problem as i can not select my specified team through the application",
      "Could you resolve ite as soon as possible",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
  {
    id: 9,
    name: "Jose Paterson",
    theme: "pink",
    date: "14 Dec, 2019",
    marked: false,
    closed: true,
    messageTitle: "Unable to select currency when order",
    message: "Hello team, I am facing problem as i can not select",
    messageMarkup: [
      "Hello Team!",
      "I am facing problem as i can not select my specified team through the application",
      "Could you resolve ite as soon as possible",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
  {
    id: 10,
    name: "Amanda Moore",
    date: "28 Dec, 2019",
    marked: false,
    closed: false,
    messageTitle: "Wallet needs to verify.",
    message: "Hello, I already varified my Wallet but it still showing",
    messageMarkup: [
      "Hello!",
      "I already varified my Wallet but it still showing that the wallet is not verified.",
      "Could you please check what is the problem",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
  {
    id: 11,
    name: "Mayme Johnston",
    theme: "purple",
    date: "11 Jan",
    marked: false,
    closed: false,
    messageTitle: "I can not submit kyc application",
    message: "Hello support! I can not upload my documents on kyc application.",
    messageMarkup: [
      "Hello Support!",
      "I can not upload my documents on kyc application.",
      "Could you please check what is the problem",
      "Customer, ",
      " Thank you",
    ],
    reply: [],
  },
];

const msgData = [
  {
    Userid: 192525,
    Getreportissuelist: [
      {
        IssueId: 83410,
        Userid: 192525,
        IssueType: "BR",
        Link: null,
        Description: "Bug Report read",
        EmailID: "That@mail.com",
        Username: "test1996",
        isActive: true,
        CreatedDate: "2023-05-24T11:42:02.167",
        Latitude: null,
        Longitude: null,
        Address: null,
        Coach: null,
        Incidenttime: null,
        Phone: "9855552558",
        T_Referenceno: null,
        T_Faretype: 0,
        T_Noofticket: 0,
        T_Errormsgorsub: "Read",
        T_Ticketid: 0,
        T_Purchasedate: null,
        T_Expirydate: null,
      },
      {
        IssueId: 83409,
        Userid: 192525,
        IssueType: "BR",
        Link: null,
        Description: "Bug Report",
        EmailID: "Test@gmail.com",
        Username: "test1996",
        isActive: false,
        CreatedDate: "2023-05-24T08:51:41.363",
        Latitude: null,
        Longitude: null,
        Address: null,
        Coach: null,
        Incidenttime: null,
        Phone: "1234567890",
        T_Referenceno: null,
        T_Faretype: 0,
        T_Noofticket: 0,
        T_Errormsgorsub: "Test",
        T_Ticketid: 0,
        T_Purchasedate: null,
        T_Expirydate: null,
      },
    ],
  },
  {
    Userid: 34791,
    Getreportissuelist: [
      {
        IssueId: 83408,
        Userid: 34791,
        IssueType: "TOI",
        Link: "",
        Description:
          "Why can't I use money in wallet to add to our purchase mytarc cards or passes.  That and these requests are Never answered!!!",
        EmailID: "bootleg4613@gmail.com",
        Username: "bootleg4613",
        isActive: true,
        CreatedDate: "2023-05-14T18:22:24.567",
        Latitude: "38.2508957",
        Longitude: "-85.7462696",
        Address: "REV1",
        Coach: "",
        Incidenttime: "2023-05-14T21:19:00",
        Phone: "5024610415",
        T_Referenceno: "",
        T_Faretype: null,
        T_Noofticket: null,
        T_Errormsgorsub: "",
        T_Ticketid: null,
        T_Purchasedate: null,
        T_Expirydate: null,
      },
    ],
  },
  {
    Userid: 192495,
    Getreportissuelist: [
      {
        IssueId: 83407,
        Userid: 192495,
        IssueType: "TOI",
        Link: "https://zig-web.com/ZIGSmartAndroid/UserDocuments/yuvanraja1111@gmail.com/yuvanraja1111@gmail.com8960/1683214876470.jpeg",
        Description: "Sometimes processing is  delay to move the next tab.",
        EmailID: "yuvanraja1111@gmail.com",
        Username: "yuvanraja1111@gmail.com",
        isActive: true,
        CreatedDate: "2023-05-04T08:41:22.48",
        Latitude: "11.6085499",
        Longitude: "78.145932",
        Address: "Zed Digital ",
        Coach: "",
        Incidenttime: "2023-05-04T21:05:00",
        Phone: "1234567890",
        T_Referenceno: "",
        T_Faretype: null,
        T_Noofticket: null,
        T_Errormsgorsub: "",
        T_Ticketid: null,
        T_Purchasedate: null,
        T_Expirydate: null,
      },
    ],
  },
];
export default support;
