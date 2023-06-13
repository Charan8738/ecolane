import React, { useCallback, useEffect, useState } from "react";
import exportFromJSON from "export-from-json";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";

import Moment from "react-moment";
import "moment-timezone";
import { user_id } from "../../redux/userSlice";

import DatePicker from "react-datepicker";
import { Card, Row, Col, Modal, ModalBody, Button, Spinner, FormGroup, Label } from "reactstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import { DataTablePagination } from "../Component";
import axios from "axios";
const Export = ({ data }) => {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (modal === true) {
      setTimeout(() => setModal(false), 3000);
    }
  }, [modal]);

  const fileName = "user-data";

  const exportCSV = () => {
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType });
  };

  const exportExcel = () => {
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  };

  const copyToClipboard = () => {
    setModal(true);
  };

  return (
    <React.Fragment>
      <div className="dt-export-buttons d-flex align-center">
        <div className="dt-export-title d-none d-md-inline-block">Export</div>
        <div className="dt-buttons btn-group flex-wrap">
          <CopyToClipboard text={JSON.stringify(data)}>
            <Button className="buttons-copy buttons-html5" onClick={() => copyToClipboard()}>
              <span>Copy</span>
            </Button>
          </CopyToClipboard>{" "}
          <button className="btn btn-secondary buttons-csv buttons-html5" type="button" onClick={() => exportCSV()}>
            <span>CSV</span>
          </button>{" "}
          <button className="btn btn-secondary buttons-excel buttons-html5" type="button" onClick={() => exportExcel()}>
            <span>Excel</span>
          </button>{" "}
        </div>
      </div>
      <Modal isOpen={modal} className="modal-dialog-centered text-center" size="sm">
        <ModalBody className="text-center m-2">
          <h5>Copied to clipboard</h5>
        </ModalBody>
        <div className="p-3 bg-light">
          <div className="text-center">Copied {data.length} rows to clipboard</div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const ExpandableRowComponent = ({ data }) => {
  return (
    <ul className="dtr-details p-2 border-bottom ml-1">
      <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
        <span style={{ marginRight: "1rem" }} className=" dtr-title">
          Validated
        </span>{" "}
        <span className="dtr-data">{data.Validated}</span>
      </li>
      <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
        <span className="dtr-title ">Activated Date</span>{" "}
        <span className="dtr-data">
          <Moment format="MMMM Do YYYY, h:mm a">{data.ActivatedDate}</Moment>
        </span>
      </li>
      <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
        <span className="dtr-title">Validated Date </span>{" "}
        <span className="dtr-data">
          <Moment format="MMMM Do YYYY, h:mm a">{data.ValidatedDate}</Moment>
        </span>
      </li>
      <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
        <span className="dtr-title">Coach #</span> <span className="dtr-data">{data.name ?? "NA"}</span>
      </li>
      <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
        <span className="dtr-title">From</span>
        <span className="dtr-data">{data.FromAddress} </span>
      </li>
      <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
        <span className="dtr-title">To</span> <span className="dtr-data">{data.DestinationAddress}</span>
      </li>
      <li style={{ padding: "0.25rem" }}>
        <span className="dtr-title">Username</span> <span className="dtr-data">{data.Username}</span>
      </li>
    </ul>
  );
};

const CustomCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
  <div className="custom-control custom-control-sm custom-checkbox notext">
    <input
      id={rest.name}
      type="checkbox"
      className="custom-control-input form-control"
      ref={ref}
      onClick={onClick}
      {...rest}
    />
    <label className="custom-control-label" htmlFor={rest.name} />
  </div>
));

const NewTicketsTable = ({ pagination, expandableRows, actions, className, selectableRows, deviceMac }) => {
  // selector is used to access the value from the store
  console.log(deviceMac);
  const client_id = useSelector(user_id);
  const error = useState(false);
  const status = useState("loading");
  const [ticketData, setTicketData] = useState([]);
  const [defaultTicket, setDefaultTicket] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPageS, setRowsPerPage] = useState(10);
  const date = new Date();
  const daysAgo = new Date(date.getTime());

  daysAgo.setDate(date.getDate() - 2);

  const [rangeDate, setRangeDate] = useState({
    start: daysAgo,
    end: new Date(),
  });
  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  useEffect(() => {
    var defaultData = ticketData;

    if (deviceMac === "All") {
      setTicketData(defaultData);
    } else {
      defaultData = defaultTicket.filter((item) => {
        return item?.BeaconId && item.BeaconId.toString().toLowerCase().includes(deviceMac.toLowerCase());
      });
      setTicketData(defaultData);
    }
  }, []);
  useEffect(() => {
    var defaultData = ticketData;

    if (deviceMac === "All") {
      setTicketData(defaultData);
    } else {
      defaultData = defaultTicket.filter((item) => {
        return item?.BeaconId && item.BeaconId.toString().toLowerCase().includes(deviceMac.toLowerCase());
      });
      console.log(defaultData.length);
      setTicketData(defaultData);
    }
  }, [deviceMac]);
  useEffect(() => {
    const getTickets = async (start, end) => {
      console.log("inside Fetch Tickets");
      if (status !== "loading") {
        console.log("inside Fetch Tickets");
        try {
          const response = await axios.get(
            "https://ecolane-api.zig-web.com/api/ZIGShuttle/GetAllTicketHistory?startDate=" +
              start +
              "&endDate=" +
              end +
              "&client_id=1"
          );
          console.log(response.data);
          return response.data;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    };

    if (rangeDate.start && rangeDate.end) {
      const startDate =
        rangeDate.start.getFullYear() + "-" + (rangeDate.start.getMonth() + 1) + "-" + rangeDate.start.getDate();
      const endDate =
        rangeDate.end.getFullYear() + "-" + (rangeDate.end.getMonth() + 1) + "-" + rangeDate.end.getDate();

      getTickets(startDate, endDate)
        .then((res) => {
          setTicketData([...res]);
          setDefaultTicket([...res]);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    }
  }, []);

  //   useEffect(() => {
  //     const getTickets = (start, end) => {
  //       console.log("inside Fetch Tickets");
  //       if (status !== "loading") {
  //         console.log("inside Fetch Tickets");
  //         // const response = axios.get(
  //         //   "https://ecolane-api.zig-web.com/api/ZIGShuttle/GetAllTicketHistory?startDate=" +
  //         //     start +
  //         //     "&endDate=" +
  //         //     end +
  //         //     "&client_id=1"
  //         // );
  //       }
  //     };
  //     let intervalId;
  //     if (rangeDate.start && rangeDate.end) {
  //       const startDate =
  //         rangeDate.start.getFullYear() + "-" + (rangeDate.start.getMonth() + 1) + "-" + rangeDate.start.getDate();
  //       const endDate =
  //         rangeDate.end.getFullYear() + "-" + (rangeDate.end.getMonth() + 1) + "-" + rangeDate.end.getDate();
  //       //   dispatch(fetchTickets({ startDate: startDate, endDate: endDate, client_id: client_id }));
  //       intervalId = setInterval(() => {
  //         getTickets(startDate, endDate);
  //       }, 25000);
  //     }

  //     return () => clearTimeout(intervalId);
  //   }, [rangeDate]);

  useEffect(() => {
    let defaultData = ticketData;
    if (searchText !== "") {
      defaultData = defaultTicket.filter((item) => {
        return item?.TicketID.toString().toLowerCase().includes(searchText.toLowerCase());
      });
      setTicketData(defaultData);
    } else {
      setTicketData(defaultTicket);
    }
  }, [searchText, ticketData]);

  //   if (status === "loading") {
  //     return (
  //       <Card>
  //         <div className="nk-ecwg nk-ecwg6">
  //           <div className="card-inner">
  //             <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
  //               <div>
  //                 <h6 className="title " style={{ textAlign: "center" }}>
  //                   <Spinner color="primary" />
  //                 </h6>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </Card>
  //     );
  //   }

  if (true) {
    return (
      <div className={`dataTables_wrapper dt-bootstrap4 no-footer ${className ? className : ""}`}>
        <Row className="gy-4">
          <Col sm={4}>
            <FormGroup>
              <Label>Date</Label>
              <div className="form-control-wrap">
                <DatePicker
                  selected={rangeDate.start}
                  startDate={rangeDate.start}
                  onChange={onRangeChange}
                  endDate={rangeDate.end}
                  selectsRange
                  className="form-control date-picker"
                />
              </div>
            </FormGroup>
          </Col>
        </Row>
        {defaultTicket ? (
          <React.Fragment>
            <Row className={`justify-between g-2 ${actions ? "with-export" : ""}`}>
              <Col className="col-7 text-left" sm="4">
                <div id="DataTables_Table_0_filter" className="dataTables_filter">
                  <label>
                    <input
                      type="search"
                      className="form-control form-control-sm"
                      placeholder="Search by Ticket ID"
                      onChange={(ev) => setSearchText(ev.target.value)}
                    />
                  </label>
                </div>
              </Col>

              <Col className="col-5 text-right" sm="8">
                <div className="datatable-filter">
                  <div className="d-flex justify-content-end g-2">
                    {actions && <Export data={ticketData} />}
                    <div className="dataTables_length" id="DataTables_Table_0_length">
                      <label>
                        <span className="d-none d-sm-inline-block">Show</span>
                        <div className="form-control-select">
                          {" "}
                          <select
                            name="DataTables_Table_0_length"
                            className="custom-select custom-select-sm form-control form-control-sm"
                            onChange={(e) => setRowsPerPage(e.target.value)}
                            value={rowsPerPageS}
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                          </select>{" "}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <DataTable
              data={ticketData}
              columns={columns}
              className={className}
              selectableRows={selectableRows}
              selectableRowsComponent={CustomCheckbox}
              expandableRowsComponent={ExpandableRowComponent}
              expandableRows={true}
              expandableRowExpanded={() => true}
              noDataComponent={<div className="p-2">There are no records found</div>}
              sortIcon={
                <div>
                  <span>&darr;</span>
                  <span>&uarr;</span>
                </div>
              }
              pagination={pagination}
              paginationComponent={({ currentPage, rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage }) => (
                <DataTablePagination
                  customItemPerPage={rowsPerPageS}
                  itemPerPage={rowsPerPage}
                  totalItems={rowCount}
                  paginate={onChangePage}
                  currentPage={currentPage}
                  onChangeRowsPerPage={onChangeRowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                />
              )}
            ></DataTable>
          </React.Fragment>
        ) : (
          <Card>
            <div className="nk-ecwg nk-ecwg6">
              <div className="card-inner">
                <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
                  <div>
                    <h6 className="title " style={{ textAlign: "center" }}>
                      ERROR : No data found
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  } else {
    return (
      <React.Fragment>
        <Row className="gy-4">
          <Col sm={4}>
            <FormGroup>
              <Label>Date</Label>
              <div className="form-control-wrap">
                <DatePicker
                  selected={rangeDate.start}
                  startDate={rangeDate.start}
                  onChange={onRangeChange}
                  endDate={rangeDate.end}
                  selectsRange
                  className="form-control date-picker"
                />
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Card>
          <div className="nk-ecwg nk-ecwg6">
            <div className="card-inner">
              <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
                <div>
                  <h6 className="title " style={{ textAlign: "center" }}>
                    No tickets Found
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </React.Fragment>
    );
  }
};

export default NewTicketsTable;

const columns = [
  // {
  //   name: "Status",
  //   selector: (row) => row.Status,
  //   sortable: true,
  // },
  {
    name: "Email",
    selector: (row) => row.EmailId,
    sortable: true,
    grow: 2,
  },
  {
    name: "Ticket ID",
    selector: (row) => row.TicketID,
    sortable: true,
  },
  {
    name: "Transaction ID",
    selector: (row) => row.TransactionId,
    sortable: true,
    grow: 2,
  },
  {
    name: "Purchased Date",
    selector: (row) => (
      <Moment tz="America/New_York" format="MMMM Do YYYY, h:mm a">
        {row.PurchasedDate}
      </Moment>
    ),
    sortable: true,
    grow: 2,
  },
  {
    name: "Activated",
    selector: (row) => row.Activated,
    sortable: true,
  },
];
