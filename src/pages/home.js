import React, { useState, useEffect, useRef } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import TotalSales from "../components/partials/e-commerce/total-sales/TotalSales";
import AverageOrder from "../components/partials/e-commerce/average-order/AverageOrder";
import Customer from "../components/partials/e-commerce/customers/Customer";
import Orders from "../components/partials/e-commerce/orders/Orders";
import StoreStatistics from "../components/partials/default/StoreStatistics";
import TrafficSources from "../components/partials/e-commerce/traffic-sources/TrafficSources";
import StoreVisitors from "../components/partials/e-commerce/store-visitors/StoreVisitors";
import RecentOrders from "../components/partials/default/recent-orders/RecentOrders";
import TopProducts from "../components/partials/default/top-products/TopProducts";
import { user_id } from "../redux/userSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import { Spinner } from "reactstrap";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  BlockBetween,
} from "../components/Component";
const home = () => {
  let val;
  const userId = useSelector(user_id);
  const [newData, setData] = useState();
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersMonthly, setUsersMonthly] = useState(0);
  const [usersWeekly, setUsersWeekly] = useState(0);
  const [appOrders, setOrders] = useState(0);
  const [Customers, setCustomers] = useState(0);
  const [Products, setProducts] = useState(0);
  const [Categories, setCategories] = useState(0);
  const [monthlyCrowd, setMonthlyCowd] = useState([]);
  const [weeklyCrowd, setWeeklyCrowd] = useState([]);
  const [dailyCrowd, setDailyCrowd] = useState([]);
  const [movingVehicles, setMovingVehicles] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [transactionsData, setTransactionsData] = useState([]);
  const [noOfTickets, setNoOfTickets] = useState(0);
  const [isLoading, setLoading] = useState(false);

  console.log(userId);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get("https://ecolane-api.zig-web.com/api/User/GetAnalyticsV3?client_id=" + userId);
      return response.data;
    };
    setLoading(true);
    getData()
      .then((res) => {
        setData(res);
        setTotalUsers(res.TotalUsers);
        setUsersMonthly(res.Monthly);
        setUsersWeekly(res.Weekly);
        setOrders(res.AppStatistics[0].Orders);
        setCustomers(res.AppStatistics[0].Customers);
        setProducts(res.AppStatistics[0].Products);
        setCategories(res.AppStatistics[0].Categories);
        setMonthlyCowd(res.MonthlyCrowd);
        setWeeklyCrowd(res.Weeklycrowd);
        setDailyCrowd(res.DailyCrowd);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const getTrackers = async () => {
      const response = await axios.get("https://gps-v2.zig-app.com/api/getdeviceDetails/" + userId);
      return response.data;
    };
    setLoading(true);
    getTrackers()
      .then((res) => {
        // setTrackers([...res]);

        const moving = res.filter((i) => i.Devicemode === "moving").length;
        setMovingVehicles(moving);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    const getTransactions = async () => {
      const response = await axios.get(
        "https://ecolane-api.zig-web.com/api/Payment/GetTranscationreference?startDate=2023-5-12&endDate=2023-5-14&token=3Y1QwEDfikGni1PPouV7aw==&client_id=" +
          userId
      );
      return response.data;
    };
    setLoading(true);
    getTransactions()
      .then((res) => {
        // setTrackers([...res]);
        console.log(res);
        let sum_value = res.reduce((sum, current) => {
          return sum + current.Amount;
        }, 0);
        console.log(sum_value);
        setTotalSales(sum_value);
        setTransactionsData([...res]);
        setNoOfTickets(res.length);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  console.log(transactionsData);
  console.log(noOfTickets);

  if (!isLoading && totalUsers) {
    console.log(totalUsers);
  }
  return (
    <React.Fragment>
      <Head title="Homepage"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Dashboard
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        {isLoading && totalUsers ? (
          <Spinner color="primary" />
        ) : (
          <Block>
            <Row className="g-gs">
              <Col xxl="4" md="6">
                <TotalSales totalusers={totalUsers} monthlyUsers={usersMonthly} weeklyUsers={usersWeekly} />
              </Col>
              <Col xxl="4" md="6">
                <AverageOrder totalSales={totalSales} />
              </Col>
              <Col xxl="4">
                <Row className="g-gs">
                  <Col xxl="12" md="6">
                    <Orders noOfTickets={noOfTickets} />
                  </Col>
                  <Col xxl="12" md="6">
                    <Customer movingVehicles={movingVehicles} />
                  </Col>
                </Row>
              </Col>
              <Col xxl="8">
                <RecentOrders transactionsData={transactionsData} />
              </Col>
              <Col xxl="4" md="6">
                <TopProducts monthlycrowd={monthlyCrowd} weeklycrowd={weeklyCrowd} dailycrowd={dailyCrowd} />
              </Col>
              <Col xxl="3" md="6">
                <StoreStatistics order={appOrders} customers={Customers} products={Products} categories={Categories} />
              </Col>
              <Col xxl="5" lg="6">
                <TrafficSources />
              </Col>
              <Col xxl="4" lg="6">
                <StoreVisitors />
              </Col>
            </Row>
          </Block>
        )}
      </Content>
    </React.Fragment>
  );
};

export default home;
