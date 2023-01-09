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
import BeverageTable from "../components/table/BeverageTable";
const Beveragecounter1 = () => {
  return (
    <React.Fragment>
      <Head title="Beverages"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Beverages
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Beverages List</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered card-preview">
            <BeverageTable />
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Beveragecounter1;
