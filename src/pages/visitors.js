import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import Moment from "react-moment";
import Head from "../layout/head/Head";
import './total.css'
import "moment-timezone";

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
import { user_id } from "../redux/userSlice";
import {
  Card,
  Spinner,
} from "reactstrap";
const Venue = () => {
  const status = useSelector(getTicketsStatus);
  const dispatch = useDispatch(); //dispatch to change values in store
 
  
  const client_id = useSelector(user_id);
  const date = new Date();
  const daysAgo = new Date(date.getTime());
  daysAgo.setDate(date.getDate() - 2);
  const INITIAL_ADD_FORM = {
    category: null,
    client_id: client_id,
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
    let intervalId;
    if (rangeDate.start && rangeDate.end) {
      const startDate =
        rangeDate.start.getFullYear() + "-" + (rangeDate.start.getMonth() + 1) + "-" + rangeDate.start.getDate();
      const endDate =
        rangeDate.end.getFullYear() + "-" + (rangeDate.end.getMonth() + 1) + "-" + rangeDate.end.getDate();
      dispatch(fetchTickets({ startDate: startDate, endDate: endDate }));
      intervalId = setInterval(() => {
        getTickets(startDate, endDate);
      }, 3000);
    }

    return () => clearTimeout(intervalId);
  }, [dispatch, rangeDate]);
  const getTickets = (start, end) => {
    if (status !== "loading") dispatch(fetchTickets({ startDate: start, endDate: end }));
  };
  //const data = [];
  const [onSearchText, setSearchText] = useState("");
  const initialData = useRef([]);
  const [data, setData] = useState([]);
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
    const url = "https://zig-web.com/ZIGSmartWeb/api/ZIGShuttle/GetAllusersinoutMOCA?Startdate=2022-10-10&Enddate=2022-10-12&Clientid=90&_=1665575496360";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        //data = json.purchasetickets;
        setData(json);
        initialData.current = [...json];
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);
  const [startDate, setStartDate] = useState(new Date());
  function onChangeDateHandler(value) {
    setStartDate(value);
  }
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((items) => {
        return items.UserName.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialData.current]);
    }
  }, [onSearchText]);




  return (
    <React.Fragment>
      <Head title="Venues"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                <div className="title">

                  Visitors 
                </div>
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
              </BlockTitle>
            </BlockHeadContent>

            <BlockHeadContent>
              <div className="total">
                <h5>Total:{data.length}</h5>
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
                          placeholder="Search by Username"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    <li>





                    </li>


                  </ul>
                </div>
              </div>
            </BlockHeadContent>

          </BlockBetween>
        </BlockHead>
        <Block >
          <Card>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow size="sm">
                  <span>User Name</span>
                </DataTableRow>
                <DataTableRow>
                  <span> Email</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Phone</span>
                </DataTableRow>
                <DataTableRow>
                  <span> IN Time</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span> OUT Time</span>
                </DataTableRow>
              </DataTableHead>
              {currentItems.length > 0
                ? currentItems.map((item) => {
                  return (
                    <DataTableItem key={item}>

                      <DataTableRow>
                        <span className="tb-sub"> {item.UserName}</span>
                      </DataTableRow>
                      <DataTableRow size="sm">
                        <span className="tb-product">
                          <span className="title">{item.EmailId}</span>
                        </span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span className="tb-sub">{item.Phone}</span>
                      </DataTableRow>


                      <DataTableRow size="md">
                        <span className="tb-sub">
                        <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                                  {item.Intime}
                                </Moment>
                        </span>
                      </DataTableRow>
                      <DataTableRow>
                        <span className="tb-sub">
                        <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                                  {item.Outtime}
                                </Moment>
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
                  <span className="text-silent">{isLoading ? <Spinner /> : "No payments found"}</span>
                </div>
              )}
            </div>
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Venue;
