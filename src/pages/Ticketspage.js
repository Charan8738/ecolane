import React from "react";
import { Block, BlockHead, PreviewCard, BlockHeadContent, BlockTitle, BlockBetween } from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import TicketsTable from "../components/table/TicketsTable";
import styled from "styled-components";
import backgroundImage from "../assets/images/Tickets.png";

const Ticketspage = () => {
  return (
    <React.Fragment>
      <Head title="Tickets"></Head>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "305px",
          paddingTop: "140px",
        }}
      >
        <BlockTitle page tag="h3">
          <Title>Tickets</Title>
        </BlockTitle>
      </div>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3"></BlockTitle>
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
const Title = styled.h3`
  font-size: 112px;
  font-weight: 900;
  padding-left: 32px;
`;
export default Ticketspage;
