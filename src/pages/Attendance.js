import React, { useCallback, useEffect, useState } from "react";
import { Block, BlockHead, PreviewCard, BlockHeadContent, BlockTitle, BlockBetween } from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import AttendanceTable from "../components/table/AttendanceTable";
import DatePicker from "react-datepicker";
import { Col } from "../components/Component";
import axios from "axios";
const Attendance = () => {
  const today = new Date().toISOString().slice(0, 10);
  const partss = today.split("-"); // Split the date into year, month, and day
  const formattedDates = `${partss[1]}/${partss[2]}/${partss[0]}`; // Concatenate the parts in "MM/DD/YYYY" format
  const yesterday = new Date(formattedDates);
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = yesterday.toISOString().slice(0, 10);
  const parts = formattedYesterday.split("-"); // Split the date into year, month, and day
  const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`; // Concatenate the parts in "MM/DD/YYYY" format
  const [todayDate, setTodayDate] = useState(formattedDates);
  const [yesterdayDate, setYesterdayDate] = useState(formattedDate);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    console.log(todayDate);
    console.log(yesterdayDate);
    const getData = async () => {
      const response = await axios.get(
        "https://ecolane-api.zig-web.com/api/ZIGShuttle/GetAllTicketHistory?startDate=" +
          yesterdayDate +
          "&endDate=" +
          todayDate +
          "&client_id=1"
      );
      return response;
    };
    getData().then((res) => {
      console.log(res.data);
      setTableData([...res.data]);
    });
    console.log(tableData);
  }, [todayDate]);

  const dateChange = (e) => {
    // setTodayDate("")
    const fd = e.toISOString().slice(0, 10);
    const partss = fd.split("-"); // Split the date into year, month, and day
    const formattedDates = `${partss[1]}/${partss[2]}/${partss[0]}`; // Concatenate the parts in "MM/DD/YYYY" format

    const yesterday = new Date(formattedDates);
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().slice(0, 10);
    const parts = formattedYesterday.split("-"); // Split the date into year, month, and day
    const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`; // Concatenate the parts in "MM/DD/YYYY" format

    setYesterdayDate(formattedDate);
    setTodayDate(formattedDates);
  };

  return (
    <React.Fragment>
      <Head title="Tickets"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockTitle page tag="h3">
              Attendance
            </BlockTitle>
          </BlockHeadContent>
        </BlockHead>
        <Block>
          <Col sm="2">
            <DatePicker
              onChange={(e) => dateChange(e)}
              selected={new Date(todayDate)}
              className="form-control date-picker"
            />
          </Col>
          {tableData.length > 0 && <AttendanceTable data={tableData} expandableRows pagination />}
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Attendance;
