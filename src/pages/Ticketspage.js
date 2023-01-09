import React from "react";
import { Block, BlockHead, PreviewCard, BlockHeadContent, BlockTitle, BlockBetween } from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import TicketsTable from "../components/table/TicketsTable";

const Ticketspage = () => {
  return (
    <React.Fragment>
      <Head title="Tickets"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Tickets
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Tickets List</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <TicketsTable expandableRows pagination actions />
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Ticketspage;
