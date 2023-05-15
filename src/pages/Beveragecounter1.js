import React, { useEffect } from "react";
import {
  Block,
  BlockHead,
  PreviewCard,
  BlockHeadContent,
  BlockTitle,
  Row,
  Col,
  BlockBetween,
} from "../components/Component";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { fetchClients, getClientsError, getClientsStatus, selectAllClients } from "../redux/beverageSlice";
import DataCard from "../components/partials/default/DataCard";

import { Card } from "reactstrap";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import BeverageTable from "../components/table/BeverageTable";
import backgroundImage from "../assets/images/beverage_background.png";
import { user_id } from "../redux/userSlice";

const Beveragecounter1 = () => {
  const client_id = useSelector(user_id);

  const dispatch = useDispatch(); //dispatch to change values in store
  const clients = useSelector(selectAllClients);
  const status = useSelector(getClientsStatus);
  const error = useSelector(getClientsError);
  const beverages = clients.filter((item) => item.Status === 0);
  const totalBeverages = clients.length;
  const served = clients.filter((item) => item.Status === 2);

  console.log(beverages.length);
  console.log(totalBeverages);
  console.log(served.length);
  useEffect(() => {
    const timer = setTimeout(() => {
      // if (status === "idle") {
      dispatch(fetchClients(client_id));
      //   }
    }, 3000);
    return () => clearTimeout(timer);
  }, [status, dispatch]);
  return (
    <React.Fragment>
      <Head title="Beverages"></Head>
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
          <Title>Beverages</Title>
        </BlockTitle>
      </div>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent></BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Block>
            <Row>
              <Col xxl="3" sm="4">
                <DataCard title="Beverages Sold" amount={totalBeverages} />
              </Col>
              <Col xxl="3" sm="4">
                <DataCard title="Beverages Served" amount={served.length} />
              </Col>
              <Col xxl="3" sm="4">
                <DataCard title="Beverages Pending" amount={beverages.length} />
              </Col>
            </Row>
          </Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Beverages List</BlockTitle>
            </BlockHeadContent>
          </BlockHead>

          <Card className="card-bordered card-preview">
            <BeverageTable beverages={beverages} />
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

export default Beveragecounter1;
