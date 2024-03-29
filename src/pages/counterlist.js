import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import "./total.css";
import "moment-timezone";

import Moment from "react-moment";
import DatePicker from "react-datepicker";
import { FormGroup, Label } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTickets,
  getTicketsError,
  getTicketsStatus,
  selectAllTickets,
  selectAPICount,
} from "../redux/ticketsSlice";

import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
} from "../components/Component";
import backgroundImage from "../assets/images/beverage_background.png";
import styled from "styled-components";

// import { user_id } from "../redux/userSlice";
import { Card, Spinner, Badge, Input } from "reactstrap";
const Venue = () => {
  const status = useSelector(getTicketsStatus);
  const dispatch = useDispatch(); //dispatch to change values in store

  // const client_id = useSelector(user_id);
  const date = new Date();
  const daysAgo = new Date(date.getTime());
  daysAgo.setDate(date.getDate() - 2);
  const INITIAL_ADD_FORM = {
    category: null,
    // client_id: client_id,
    itemName: "",
    price: null,
    itemDescription: "",
    ImageURL: "",
    status: false,
  };
  const [rangeDate, setRangeDate] = useState({
    start: daysAgo,
    end: new Date(),
  });
  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  useEffect(() => {
    const url =
      "https://zig-web.com/Zigsmartv3ios/api/Beverage/GetBeveragePerMacaddress?Status=1&Macaddress=F5:A0:B3:41:84:8B";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        //console.log((json.Id?.reduce((a, v) => a + v, 0)));
        //data = json.purchasetickets;
        setData(json);
        initialData.current = [...json];
      } catch (error) {
        console.log("error", error);
      }
    };

    let intervalId;
    if (rangeDate.start && rangeDate.end) {
      const startDate =
        rangeDate.start.getFullYear() + "-" + (rangeDate.start.getMonth() + 1) + "-" + rangeDate.start.getDate();
      const endDate =
        rangeDate.end.getFullYear() + "-" + (rangeDate.end.getMonth() + 1) + "-" + rangeDate.end.getDate();
      // dispatch(fetchTickets({ startDate: startDate, endDate: endDate }));
      intervalId = setInterval(() => {
        // getTickets(startDate, endDate);
        fetchData();
      }, 3000);
    }

    return () => clearTimeout(intervalId);
  }, [dispatch, rangeDate]);
  // const getTickets = (start, end) => {
  //   if (status !== "loading") dispatch(fetchTickets({ startDate: start, endDate: end }));
  // };
  //const data = [];
  const [onSearchText, setSearchText] = useState("");
  const initialData = useRef([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [sm, updateSm] = useState(false); // ----> Responsivenes
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    const url =
      "https://zig-web.com/Zigsmartv3ios/api/Beverage/GetBeveragePerMacaddress?Status=1&Macaddress=F5:A0:B3:41:84:8B";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        //console.log((json.Id?.reduce((a, v) => a + v, 0)));
        //data = json.purchasetickets;
        setData(json);
        initialData.current = [...json];
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item.Name.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialData.current]);
    }
  }, [onSearchText]);
  useEffect(() => {
    const getClients = async () => {
      const response = await axios.get("iot/getAllClients");
      if (response.status === 200) {
        const clients = [...response.data];
        let pendingClients = [];
        let approvedClients = [];
        clients.forEach((item) => {
          if (item.status) approvedClients.push(item);
          else pendingClients.push(item);
        });
        setData([...pendingClients, ...approvedClients]);
        initialClients.current = [...response.data];
      } else throw new Error();
    };
    try {
      setClientLoading(true);
      getClients().finally(() => {
        setClientLoading(false);
      });
    } catch (err) {
      setError(true);
    }
  }, []);
  const [startDate, setStartDate] = useState(new Date());
  function onChangeDateHandler(value) {
    setStartDate(value);
  }
  let sum_value = data.reduce((sum, current) => {
    return sum + current.Beveragecount;
  }, 0);

  return (
    <React.Fragment>
      <Head title="Venues"></Head>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "300px",
          paddingTop: "105px",
        }}
      >
        <BlockTitle page tag="h3">
          <Title>Beverages List</Title>
        </BlockTitle>
      </div>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                {/* <div className="title">Beverages</div> */}
                <div className="select  ">
                  <h6>Date :</h6>
                </div>
                <div className="picker">
                  <DatePicker
                    selected={rangeDate.start}
                    startDate={rangeDate.start}
                    onChange={onRangeChange}
                    endDate={rangeDate.end}
                    selectsRange
                    className="form-control date-picker"
                  />
                </div>
                <br></br>
                <Label className="form-label" style={{ display: "flex", alignItems: "center", height: "100%" }}>
                  Sort By
                </Label>
                <div className="form-control-wrap">
                  <div className="form-control-select">
                    <Input
                      type="select"
                      name="select"
                      id="view-options"
                      // onChange={(event) => setViewOption(event.target.value)}
                    >
                      <option value="All">Counter 1</option>
                      <option value="All">Counter 2</option>
                      <option value="All">Counter 3</option>
                    </Input>
                  </div>
                </div>
              </BlockTitle>
            </BlockHeadContent>

            <BlockHeadContent>
              <div className="total">
                <h5 style={{ "padding-right": "50px" }}>
                  Total:
                  <span>{data.length}</span>
                </h5>
              </div>
              <div className="totalamount">
                <h5>Total Amount: ${sum_value}</h5>
              </div>

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
                          placeholder="Search by name"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    <li></li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card>
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <DataTableBody>
                  <DataTableHead>
                    <DataTableRow size="sm">
                      <span>Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Beverage</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Count</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Payment</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Date Time</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span> Email</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Phone</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span> Served</span>
                    </DataTableRow>
                  </DataTableHead>
                  {currentItems.length > 0
                    ? currentItems.map((item, id) => {
                        return (
                          <DataTableItem key={id}>
                            <DataTableRow size="sm">
                              <span>
                                <span className="tb-sub"> {item.Name}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <span className="title" dangerouslySetInnerHTML={{ __html: item.Beveragename }}></span>
                              </span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.Beveragecount}</span>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-sub">{item.Cost}</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-odr-date">
                                <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                                  {item.Createddate}
                                </Moment>
                              </span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.Emailaddress}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.phone}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">
                                {item.status ? (
                                  <Badge pill color="success">
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge pill color="danger">
                                    Pending
                                  </Badge>
                                )}
                              </span>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })
                    : null}
                </DataTableBody>
                <div className="card-inner">
                  {data.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={data.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">{isLoading ? <Spinner /> : "No Transactions found"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};
const Title = styled.h3`
  font-size: 112px;
  font-weight: 900;
  padding-left: 32px;
`;
export default Venue;
