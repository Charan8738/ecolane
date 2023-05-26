import React, { useCallback, useEffect, useState } from "react";
import exportFromJSON from "export-from-json";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTickets,
  getTicketsError,
  getTicketsStatus,
  selectAllTickets,
  selectAPICount,
} from "../../redux/ticketsSlice";
import Moment from "react-moment";
import "moment-timezone";
import { user_id } from "../../redux/userSlice";

import DatePicker from "react-datepicker";
import { Card, Row, Col, Modal, ModalBody, Button, Spinner, FormGroup, Label } from "reactstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import { DataTablePagination } from "../Component";

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

// const ExpandableRowComponent = ({ data }) => {
//   return (
//     <ul className="dtr-details p-2 border-bottom ml-1">
//       <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
//         <span style={{ marginRight: "1rem" }} className=" dtr-title">
//           Validated
//         </span>{" "}
//         <span className="dtr-data">{data.Validated}</span>
//       </li>
//       <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
//         <span className="dtr-title ">Activated Date</span>
//         <span className="dtr-data">
//           <Moment format="MMMM Do YYYY, h:mm a">{data.ActivatedDate}</Moment>
//         </span>
//       </li>
//       <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
//         <span className="dtr-title">Validated Date </span>
//         <span className="dtr-data">
//           <Moment format="MMMM Do YYYY, h:mm a">{data.ValidatedDate}</Moment>
//         </span>
//       </li>
//       <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
//         <span className="dtr-title">Coach #</span> <span className="dtr-data">{data.name ?? "NA"}</span>
//       </li>
//       <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
//         <span className="dtr-title">From</span>
//         <span className="dtr-data">{data.FromAddress} </span>
//       </li>
//       <li style={{ padding: "0.25rem", borderBottom: "1px solid #ebeef2" }}>
//         <span className="dtr-title">To</span> <span className="dtr-data">{data.DestinationAddress}</span>
//       </li>
//       <li style={{ padding: "0.25rem" }}>
//         <span className="dtr-title">Username</span> <span className="dtr-data">{data.Username}</span>
//       </li>
//     </ul>
//   );
// };

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

const AttendanceTable = ({ data, columns, pagination, actions, className, selectableRows, expandableRows }) => {
  const [tableData, setTableData] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPageS, setRowsPerPage] = useState(10);
  const [mobileView, setMobileView] = useState();
  const [finalData, setFinalData] = useState();
  useEffect(() => {
    setTableData(data);
  }, [data]);
  const emailIdsToFilter = [
    "irfan@zed.digital",
    "dharanigkd02@gmail.com",
    "sasmita@zed.digital",
    "sudharsan@zed.digital",
    "charan@zed.digital",
    "amar@zed.digital",
    "dharanidharan@zed.digital",
    "sowndharya@zed.digital",
    "kamalesh@zed.digital",
    "bharathikannan@zed.digital",
    "harishankar@zeddigital.netz",
    "karthikeyan@zed.digital",
    "ashok@zed.digital",
    "swathianandkumar.06@gmail.com",
    "suresh@Zed.digital",
    "swathianandkumar.06@gmail.com",
    "hariharan@zed.digital",
    "deepthi@zed.digital",
  ];
  useEffect(() => {
    const filteredData = tableData.filter((item) => emailIdsToFilter.includes(item.EmailId));

    filteredData.sort((a, b) => {
      const dateTimeA = new Date(a.PurchasedDate).getTime();
      const dateTimeB = new Date(b.PurchasedDate).getTime();

      return dateTimeB - dateTimeA;
    });
    setFinalData(filteredData);

    console.log("data change");
  }, [tableData]);

  //   useEffect(() => {
  //     let defaultData = tableData;
  //     if (searchText !== "") {
  //       defaultData = data.filter((item) => {
  //         return item.name.toLowerCase().includes(searchText.toLowerCase());
  //       });
  //       setTableData(defaultData);
  //     } else {
  //       setTableData(data);
  //     }
  //   }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps

  // function to change the design view under 1200 px
  const viewChange = () => {
    if (window.innerWidth < 960 && expandableRows) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  };

  useEffect(() => {
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    return () => {
      window.removeEventListener("resize", viewChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`dataTables_wrapper dt-bootstrap4 no-footer ${className ? className : ""}`}>
      <Row className={`justify-between g-2 ${actions ? "with-export" : ""}`}>
        <Col className="col-7 text-left" sm="4">
          <div id="DataTables_Table_0_filter" className="dataTables_filter">
            {/* <label>
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search by name"
                onChange={(ev) => setSearchText(ev.target.value)}
              />
            </label> */}
          </div>
        </Col>
        <Col className="col-5 text-right" sm="8">
          <div className="datatable-filter">
            <div className="d-flex justify-content-end g-2">
              {actions && <Export data={data} />}
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
        data={finalData}
        columns={dataTableColumns}
        className={className}
        selectableRows={selectableRows}
        selectableRowsComponent={CustomCheckbox}
        // expandableRowsComponent={ExpandableRowComponent}
        // expandableRows={mobileView}
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
    </div>
  );
};

export default AttendanceTable;

function distance(lat1, lon1, lat2, lon2, unit) {
  const R = unit === "km" ? 6371 : 3956; // Radius of the earth in km or miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km or miles
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
const dataTableColumns = [
  {
    name: "Username",
    selector: (row) => <span>{row.Username}</span>,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => <span>{row.EmailId}</span>,
    sortable: true,
    hide: 370,
  },
  {
    name: "In Time",
    selector: (row) => (
      <Moment tz="Asia/Kolkata" format="MMMM Do YYYY, h:mm a">
        {row.PurchasedDate}
      </Moment>
    ),
    sortable: true,
    hide: "sm",
  },
  //   {
  //     name: "Out Time",
  //     selector: (row) => (
  //       <Moment tz="Asia/Kolkata" format="MMMM Do YYYY, h:mm a">
  //         {row.Outtime}
  //       </Moment>
  //     ),
  //     sortable: true,
  //     hide: "sm",
  //   },

  // {
  //   name: "Salary",
  //   selector: (row) => row.salary,
  //   sortable: true,
  //   hide: "md",
  // },
];
