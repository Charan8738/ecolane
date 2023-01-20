import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import exportFromJSON from "export-from-json";
import Swal from "sweetalert2";
import "moment-timezone";
import Moment from "react-moment";
import "./total.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
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
import { Card, Spinner, Badge } from "reactstrap";
import { MomentTimezone } from "moment";
const Venue = () => {
  const Checkbox = ({ label }) => {
    return (
      <div className="checkbox-wrapper">
        <label>
          <input type="checkbox" />
          <span>{label}</span>
        </label>
      </div>
    );
  };
  const status = useSelector(getTicketsStatus);
  const dispatch = useDispatch(); //dispatch to change values in store

  const [approval, setApproval] = useState("");
  const [approvaltwo, setApprovaltwo] = useState("");
  const client_id = useSelector(user_id);
  const date = new Date();
  const fileName = "user-data";
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
  const handleChange = (e) => {
    setApproval(e.target.value);
  };
  const handleChangetwo = (e) => {
    setApprovaltwo(e.target.value);
  };
  const exportExcel = () => {
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  };
  const [rangeDate, setRangeDate] = useState({
    start: daysAgo,
    end: new Date(),
  });
  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  // useEffect(() => {
  //   let intervalId;
  //   if (rangeDate.start && rangeDate.end) {
  //     const startDate =
  //       rangeDate.start.getFullYear() + "-" + (rangeDate.start.getMonth() + 1) + "-" + rangeDate.start.getDate();
  //     const endDate =
  //       rangeDate.end.getFullYear() + "-" + (rangeDate.end.getMonth() + 1) + "-" + rangeDate.end.getDate();
  //     dispatch(fetchTickets({ startDate: startDate, endDate: endDate }));
  //     intervalId = setInterval(() => {
  //       getTickets(startDate, endDate);
  //     }, 3000);
  //   }

  //   return () => clearTimeout(intervalId);
  // }, [dispatch, rangeDate]);
  const getTickets = (start, end) => {
    if (status !== "loading") dispatch(fetchTickets({ startDate: start, endDate: end }));
  };
  const [onSearchText, setSearchText] = useState("");
  const initialData = useRef([]);
  const initialApproval = useRef([]);
  const [error, setError] = useState(false);
  const initialApprovaltwo = useRef([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [sm, updateSm] = useState(false); // ----> Responsivenes
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    let intervalId;
    if (rangeDate.start && rangeDate.end) {
      const startDate =
        rangeDate.start.getFullYear() + "-" + (rangeDate.start.getMonth() + 1) + "-" + rangeDate.start.getDate();
      const endDate =
        rangeDate.end.getFullYear() + "-" + (rangeDate.end.getMonth() + 1) + "-" + rangeDate.end.getDate();
      const url = `https://ecolane-api.zig-web.com/api/Payment/GetTranscationreference?startDate=${startDate}&endDate=${endDate}&token=3Y1QwEDfikGni1PPouV7aw==&client_id=${client_id}`;
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(url);
          setLoading(false);
          const json = await response.json();
          console.log(json);
          //data = json.purchasetickets;
          setData(json);
          initialData.current = [...json];
          initialApproval.current = [...json];
          initialApprovaltwo.current = [...json];
        } catch (err) {
          setError(true);
        }
      };
      intervalId = setInterval(() => {
        fetchData();
      }, 3000);
    }
    return () => clearTimeout(intervalId);
  }, [dispatch, rangeDate]);
  useEffect(() => {
    if (approval !== "Pending") {
      console.log(approval);
      const datasetting = data.filter((items) => {
        return items.Txnstatus;
      });
      setData([...datasetting]);
    } else if (approval !== "Approved") {
      const datasetting = data.filter((items) => {
        return items.Txnstatus;
      });
      setData([...datasetting]);
    } else {
      setData([...initialApproval.current]);
    }
  }, [approval]);

  // useEffect(() => {
  //   if (approvaltwo !== "Approved") {
  //     const datasettingtwo = data.filter((items) => {
  //       return items.Txnstatus;
  //     });
  //     setData([...datasettingtwo]);
  //   } else {
  //     setData([...initialApprovaltwo.current]);
  //   }
  // }, [approvaltwo]);

  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item.Email.toLowerCase().includes(onSearchText.toLowerCase());
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

  console.log(sum_value);

  const Mailto = ({ email, subject = "", body = "", children }) => {
    let params = subject || body ? "?" : "";
    if (subject) params += `subject=${encodeURIComponent(subject)}`;
    if (body) params += `${subject ? "&" : ""}body=${encodeURIComponent(body)}`;

    return <a href={`mailto:${email}${params}`}>{children}</a>;
  };
  const [deviceStatus, setDeviceStatus] = useState("All");
  const CloseButton = () => {
    return (
      <span className="btn-trigger toast-close-button" role="button">
        <Icon name="cross"></Icon>
      </span>
    );
  };

  const SuccessAlert = () => {
    Swal.fire({
      icon: "success",
      title: "success",
      text: "Email Generated Successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <React.Fragment>
      <Head title="Venues"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                <div className="title">Transactions</div>
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
                <div className="excel">
                  <Button
                    color="danger"
                    onClick={() => {
                      exportExcel();
                      alert("Exported as Excel");
                    }}
                  >
                    Export as excel
                  </Button>
                </div>
                <div className="checkbox">
                  <input type="checkbox" value="Approved" onChange={(e) => handleChange(e)} /> Approved
                  <input className="checker" value="" type="checkbox" onChange={(e) => handleChange(e)} /> Pending
                </div>
              </BlockTitle>
            </BlockHeadContent>

            <BlockHeadContent>
              <div className="total">
                <h5>Total:{data.length}</h5>
              </div>
              <div className="totalamount">
                <h5>Total Amount: ${sum_value.toFixed(2)}</h5>
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
            <DataTableBody>
              <DataTableHead>
                <DataTableRow size="sm">
                  <span>Email</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Transaction ID</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Transaction Status</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Transaction Reference</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Amount</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Purchased Date</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Generate Email</span>
                </DataTableRow>
              </DataTableHead>
              {currentItems.length > 0
                ? currentItems.map((item, id) => {
                    return (
                      <DataTableItem key={id}>
                        <DataTableRow>
                          <span className="tb-sub"> {item.Email}</span>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <span className="tb-product">
                            <span className="title">{item.Txn_id}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span className="tb-sub">
                            {item.Txnstatus ? (
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

                        <DataTableRow size="md">
                          <span className="tb-sub">{item.Txn_ref_no}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <strong className="tb-sub">$ {item.Amount.toFixed(2)}</strong>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-odr-date">
                            <Moment utc tz="America/New_York" format="MMMM Do YYYY, h:mm a">
                              {item.Updateddate}
                            </Moment>
                          </span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="tb-sub">
                            <Button
                              color="danger"
                              onClick={() => {
                                SuccessAlert();
                              }}
                            >
                              Generate Email
                            </Button>
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
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Venue;
