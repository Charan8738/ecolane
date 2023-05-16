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
import styled from "styled-components";
import { Bar } from "react-chartjs-2";

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
  PreviewCard,
} from "../components/Component";
import { user_id } from "../redux/userSlice";
import { Card, Spinner } from "reactstrap";
import axios from "axios";
// import { barChartData } from "../pages/components/charts/ChartData";
import backgroundImage from "../assets/images/payment_background.png";

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
      const url = `https://ecolane-api.zig-web.com/api/Zigshuttle/GetPurchaseticket?startDate=${startDate}&endDate=${endDate}&client_id=${client_id}`;
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          console.log(response.purchasetickets);
          //data = json.purchasetickets;
          let sortedData = [...json.purchasetickets].sort((a, b) => b.PurchasedDate.localeCompare(a.PurchasedDate));
          setData(sortedData);
          initialData.current = sortedData;
        } catch (error) {
          console.log("error", error);
        }
      };

      intervalId = setInterval(() => {
        fetchData();
        // getTickets(startDate, endDate);
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
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const [MonthlyTicketsDatas, setMonthlyTicketsDatas] = useState([]);
  const [ticketsData, setTicketsData] = useState([]);
  const [ticketsDate, setTicketsDate] = useState([]);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [sm, updateSm] = useState(false); // ----> Responsivenes
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        "https://ecolane-api.zig-web.com/api/User/GetAnalyticsV3?client_id=" + client_id
      );
      return response.data;
    };
    setLoading(false);
    getData()
      .then((res) => {
        // console.log(res.MonthlyTicketsDatas);
        setMonthlyTicketsDatas(res.MonthlyTicketsDatas);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Splits and converts the data into array
  useEffect(() => {
    const ticketsData = MonthlyTicketsDatas.map((data) => data.TicketsCountData);
    const ticketsDate = MonthlyTicketsDatas.map((data) => data.Date);

    setTicketsData(ticketsData);
    setTicketsDate(ticketsDate);
  }, [MonthlyTicketsDatas]);
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((items) => {
        return items.TicketID.toString().toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...initialData.current]);
    }
  }, [onSearchText]);
  const [startDate, setStartDate] = useState(new Date());
  function onChangeDateHandler(value) {
    setStartDate(value);
  }
  let sum_value = data.reduce((sum, current) => {
    return sum + current.Amount;
  }, 0);
  currentItems.sort((a, b) => b.PurchasedDate.localeCompare(a.PurchasedDate));
  return (
    <React.Fragment>
      <Head title="Venues"></Head>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "280px",
          paddingTop: "105px",
        }}
      >
        <BlockTitle page tag="h3">
          <Title>Payment History</Title>
        </BlockTitle>
      </div>
      <Content>
        <Block>
          <Col xxl="12" md="6">
            <PreviewCard>
              <div className="nk-ck">
                <BarChartExample ticketsData={ticketsData} ticketsDate={ticketsDate} />
              </div>
            </PreviewCard>
          </Col>
        </Block>

        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
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
                <h5>
                  Total:
                  <span>{data.length}</span>
                </h5>
              </div>
              <div className="totalamount" style={{ paddingLeft: 23 }}>
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
                          pattern="[0-9]*"
                          className="form-control"
                          id="default-04"
                          placeholder="Search by Ticket ID"
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
            <DataTableBody>
              <DataTableHead>
                <DataTableRow size="sm">
                  <span>Ticket Id</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Transaction Reference</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Amount</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Pass Type</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Purchased Date</span>
                </DataTableRow>
              </DataTableHead>
              {currentItems.length > 0
                ? currentItems.map((item, id) => {
                    return (
                      <DataTableItem key={id}>
                        <DataTableRow>
                          <span className="tb-sub"> {item.TicketID}</span>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <span className="tb-product">
                            <span className="title">{item.TransactionId}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <strong className="tb-sub">$ {item.Amount.toFixed(2)}</strong>
                        </DataTableRow>

                        <DataTableRow size="md">
                          <span className="tb-sub">{item.Fareid}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-sub">
                            <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                              {item.PurchasedDate}
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
const Title = styled.h3`
  font-size: 112px;
  font-weight: 900;
  padding-left: 32px;
`;

const BarChartExample = ({ stacked, ticketsDate, ticketsData }) => {
  console.log(ticketsData);
  const barChartData = {
    labels: ticketsDate,
    dataUnit: "People",
    datasets: [
      {
        label: "Ticket Sold",
        backgroundColor: "rgba(157, 114, 255, 0.8)",
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        data: ticketsData,
      },
    ],
  };
  return (
    <Bar
      data={barChartData}
      options={{
        legend: {
          display: false,
          labels: {
            boxWidth: 30,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: true,
              stacked: stacked ? true : false,
              ticks: {
                beginAtZero: true,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 5,
              },
              gridLines: {
                tickMarkLength: 0,
              },
            },
          ],
          xAxes: [
            {
              display: true,
              stacked: stacked ? true : false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 5,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 10,
                zeroLineColor: "transparent",
              },
            },
          ],
        },
      }}
    />
  );
};
// export const barChartData = {
//   labels: [
//     "01",
//     "02",
//     "03",
//     "04",
//     "05",
//     "06",
//     "07",
//     "08",
//     "09",
//     "10",
//     "11",
//     "12",
//     "13",
//     "14",
//     "15",
//     "16",
//     "17",
//     "18",
//     "19",
//     "20",
//     "21",
//     "22",
//     "23",
//     "24",
//     "25",
//     "26",
//     "27",
//     "28",
//     "29",
//     "30",
//   ],
//   dataUnit: "People",
//   datasets: [
//     {
//       label: "join",
//       backgroundColor: "rgba(157, 114, 255, 0.8)",
//       barPercentage: 0.7,
//       categoryPercentage: 0.7,
//       data: [
//         110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95,
//         75, 90, 75, 90,
//       ],
//     },
//     {
//       label: "join",
//       backgroundColor: "rgba(157, 114, 255, 0.8)",
//       barPercentage: 0.7,
//       categoryPercentage: 0.7,
//       data: [
//         110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95,
//         75, 90, 75, 90,
//       ],
//     },
//   ],
// };
export default Venue;
