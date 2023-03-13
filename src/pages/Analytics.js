import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { ReactDataTable } from "../components/Component";
import { Block, BlockHead, PreviewCard, BlockHeadContent, BlockTitle, BlockBetween } from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
const Analytics = () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    setLoading(true);
    window.location.replace("https://zig-app.com/Analytics/loginreport?fromurl=true");
    axios
      .get("https://zig-app.com/Analyticsapi/api/Homepage/Getanalytics")
      .then((res) => {
        setData([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  console.log(data);
  return (
    <React.Fragment>
      <Head title="Tickets"></Head>
      <Content>
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Analytics</BlockTitle>
            </BlockHeadContent>
          </BlockHead>

          <PreviewCard>
            {isLoading ? (
              <Spinner color="primary" />
            ) : data.length > 0 ? (
              <ReactDataTable data={data} columns={dataTableColumns} expandableRows pagination />
            ) : (
              <p>No data found</p>
            )}
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};
const dataTableColumns = [
  {
    name: "Android Version",
    selector: (row) => row.Androidversion,
    sortable: true,
  },
  {
    name: "Total Android Installs",
    selector: (row) => row.Totalandroidinstall,
    sortable: true,
    hide: 370,
  },
  {
    name: "Android Uninstalls",
    selector: (row) => row.Androiduninstall,
    sortable: true,
    hide: "sm",
  },
  {
    name: "Android New Install",
    selector: (row) => row.Androidnewinstall,
    sortable: true,
    hide: "sm",
  },
  {
    name: "IOS Version",
    selector: (row) => row.Iosversion,
    sortable: true,
    hide: "md",
  },
  {
    name: "IOS New Installs",
    selector: (row) => row.Iosnewinstall,
    sortable: true,
    hide: "md",
  },
  {
    name: "IOS Uninstalls",
    selector: (row) => row.Iosuninstall,
    sortable: true,
    hide: "md",
  },
  {
    name: "Total Registers",
    selector: (row) => row.Totalregister,
    sortable: true,
    hide: "md",
  },
  {
    name: "Total Trips",
    selector: (row) => row.Totaltrips,
    sortable: true,
    hide: "md",
  },
];

export default Analytics;
