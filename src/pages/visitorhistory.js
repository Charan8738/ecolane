import React, { useState, useEffect, useRef } from "react";
import Moment from "react-moment";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import Swal from "sweetalert2";
import styled from "styled-components";
import { user_id } from "../redux/userSlice";
import { Card, Spinner, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";

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
import axios from "axios";
import backgroundImage from "../assets/images/visitor_history.png";

const Visitors_Vip = () => {
  const client_id = useSelector(user_id);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const date = new Date();
  const daysAgo = new Date(date.getTime());
  const [searchText, setSearchText] = useState("");
  const [mainData, setMainData] = useState([]);
  daysAgo.setDate(date.getDate() - 2);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [rangeDate, setRangeDate] = useState({
    start: daysAgo,
    end: new Date(),
  });
  const onClickAdmit = () => {
    let url = "https://zig-app.com/Zigsmartweb/api/ZIGShuttle/AdmitUser?TicketID=29734694";
    const response = axios.get(url);
    if (response.status === 200) {
      alert("Admitted Successfully");
    }
  };
  const SuccessAlert = () => {
    Swal.fire({
      icon: "success",
      title: "success",
      text: "Admitted Successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  useEffect(() => {
    const url =
      "https://zig-web.com/ZIGSmartWeb/api/ZIGShuttle/GetVIPUsersMOCA?Startdate=" +
      rangeDate.start +
      "&Enddate=" +
      rangeDate.end +
      "&Clientid=" +
      client_id;
    const fetchData = async () => {
      if (rangeDate.start && rangeDate.end) {
        const startDate =
          rangeDate.start.getFullYear() + "-" + (rangeDate.start.getMonth() + 1) + "-" + rangeDate.start.getDate();
        const endDate =
          rangeDate.end.getFullYear() + "-" + (rangeDate.end.getMonth() + 1) + "-" + rangeDate.end.getDate();
        try {
          const response = await fetch(
            "https://zig-web.com/ZIGSmartWebLima/api/ZIGShuttle/GetVIPUsersMOCA?Startdate=" +
              startDate +
              "&Enddate=" +
              endDate +
              "&Clientid=" +
              client_id
          );
          const json = await response.json();
          console.log(json);
          //data = json.purchasetickets;
          setData(json);
          setMainData([...json]);
          // initialData.current = [...json];
        } catch (error) {
          console.log("error", error);
        }
      }
    };

    fetchData();
  }, [rangeDate]);

  useEffect(() => {
    try {
      if (searchText !== "") {
        const filteredObject = mainData.filter((item) => {
          return item.UserName.toLowerCase().includes(searchText.toLowerCase());
        });
        setData([...filteredObject]);
      } else {
        setData([...mainData]);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }, [searchText]);

  const onFilterChange = (e) => {
    console.log(e.target.value);
    setSearchText(e.target.value);
  };
  return (
    <React.Fragment>
      <Head title="Visitor History"></Head>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "240px",
          paddingTop: "100px",
        }}
      >
        <BlockTitle page tag="h3">
          <Title>Rider History</Title>
        </BlockTitle>
      </div>
      <Content>
        <div className="d-flex">{/* <div>Search Box</div> */}</div>
        <br></br>
        <div className="d-flex">
          <div className="flex-grow-1">
            <Col sm="3">
              <DatePicker
                selected={rangeDate.start}
                startDate={rangeDate.start}
                onChange={onRangeChange}
                endDate={rangeDate.end}
                selectsRange
                className="form-control date-picker"
              />
            </Col>
          </div>
          <div>
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
            </ul>
          </div>
        </div>
        <br></br>
        <Block>
          <Card className="card-bordered card-preview">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                {/* Table */}
                <table style={{ width: "100%", tableLayout: "auto", textAlign: "center" }} className="table">
                  <thead className="table-light">
                    <tr>
                      <th className="d-none d-md-table-cell">Pass</th>
                      <th className="d-none d-md-table-cell">User Name</th>
                      <th className="d-none d-sm-table-cell">Tickets</th>
                      <th className="d-none d-sm-table-cell">Email</th>
                      <th className="d-none d-sm-table-cell">Route Name</th>
                      <th className="d-none d-sm-table-cell">IN Time</th>
                      <th className="d-none d-sm-table-cell">Out Time</th>
                      <th className="d-none d-sm-table-cell">Admit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0
                      ? data.map((item, index) => {
                          return (
                            <tr key={item.EmailId} className="tb-tnx-item">
                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                <strong>{item.VIP}</strong>
                              </td>

                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {item.UserName}
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {item.Ticketcount}
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {item.EmailId}
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                {item.Routeid}
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                <Moment format="MMMM Do YYYY, h:mm a">{item.Intime}</Moment>
                              </td>
                              <td style={{ padding: "0.75rem 0.25rem" }} className="d-none d-md-table-cell">
                                <Moment format="MMMM Do YYYY, h:mm a">{item.Outtime}</Moment>
                              </td>

                              <td style={{ padding: "0.75rem 0.25rem" }}>
                                <div className="tb-odr-btns d-none d-md-inline">
                                  <Button
                                    color="primary"
                                    className="btn-sm"
                                    onClick={() => {
                                      onClickAdmit(item.TicketId);
                                      SuccessAlert();
                                    }}
                                  >
                                    Admit
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
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
                      <span className="text-silent">{isLoading ? <Spinner color="primary" /> : "No Vip Visitors"}</span>
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
export default Visitors_Vip;
