import React, { useState, useEffect, useRef } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import './total.css'
import DatePicker from "react-datepicker";
import { FormGroup, Label } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchTickets,
//   getTicketsError,
//   getTicketsStatus,
//   selectAllTickets,
//   selectAPICount,
// } from "../redux/ticketsSlice";


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
  Badge,

} from "reactstrap";
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
  //const status = useSelector(getTicketsStatus);
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
  // const getTickets = (start, end) => {
  //   if (status !== "loading") dispatch(fetchTickets({ startDate: start, endDate: end }));
  // };
  
  let [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [sm, updateSm] = useState(false); // ----> Responsivenes
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };
  const initialData = useRef([]);
  useEffect(() => {
    const url = "https://zig-web.com/ZIGSmartWeb/api/ZIGShuttle/Getreportissuelist?startDate=2022-10-15&endDate=2022-10-17";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(...json.Getreportissuelist);
        //data = json.Getreportissuelist;
        setData(...json.Getreportissuelist);
        initialData.current = [...json.Getreportissuelist];
        
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




  return (
    <React.Fragment>
      <Head title="Venues"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                <div className="titletwoo">

                  Support
                </div>
                



                <div className="pickerthree">
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
              
            </BlockHeadContent>

          </BlockBetween>
        </BlockHead>
        <Block >
          <Card>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow size="sm">
                  <span>Name</span>
                </DataTableRow>
                <DataTableRow>
                  <span> Description</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Date </span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span>Phone</span>
                </DataTableRow>
              </DataTableHead>
              {currentItems?.length > 0
                ? currentItems.map((item,id) => {
                  return (
                    <DataTableItem key={id}>
                      <DataTableRow>
                        <span className="tb-sub"> {item.Username}</span>
                      </DataTableRow>
                      <DataTableRow size="sm">
                        <span className="tb-product">
                          <span className="title">{item.Description}</span>
                        </span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span className="tb-sub">{item.CreatedDate}</span>
                      </DataTableRow>          
                      <DataTableRow>
                        <span className="tb-sub">{item.Phone}</span>
                      </DataTableRow>
                    </DataTableItem>
                  );
                })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {data?.length > 0 ? (
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
