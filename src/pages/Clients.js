import React from "react";
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
import { Card } from "reactstrap";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import ClientTable from "../components/table/ClientTable";

const Clients = () => {
  return (
    <React.Fragment>
      <Head title="Add New Device"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Client Info
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Client List</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered card-preview">
            <ClientTable />
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Clients;
