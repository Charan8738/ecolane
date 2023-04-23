import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Input,
  FormGroup,
  Label,
  Spinner,
  CardLink,
  CardText,
  CardSubtitle,
  Modal,
  ModalBody,
} from "reactstrap";
import EditScheduleModal from "./components/EditScheduleModal/EditScheduleModal";
import { successAlert, failureAlert } from "../utils/Utils";

import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  BlockBetween,
  PaginationComponent,
  Col,
  ReactDataTable,
  Button,
} from "../components/Component";
import { Link } from "react-router-dom";

import { useLocation, Redirect } from "react-router-dom";
import Content from "../layout/content/Content";
import Moment from "react-moment";
import axios from "axios";

import Head from "../layout/head/Head";
import SchedulesDataTable from "../components/table/SchedulesDataTable";
import { DataTableData, dataTableColumns, dataTableColumns2, userData } from "../pages/components/table/TableData";
const ScheduleInfo = () => {
  const location = useLocation();
  const id = location.state?._id;
  const tracker = location.state?.trackers;
  var schedulesData = location.state?.trackers.data;
  const scheduleDate = location.state?.trackers.scheduled_date;
  console.log(tracker.data);

  const [showEditModal, setShowEditModal] = useState(false);

  const onFormCancel = () => {
    setView({ edit: false, add: false, diagnose: false });
  };
  const [view, setView] = useState({
    edit: false,
    add: false,
    diagnose: false,
  });

  const onEditSubmit = (data) => {
    let newData = { data: data, _id: tracker._id, coach_count: data.length };
    console.log(newData);

    axios
      .put("https://gps.zig-app.com/api/updateSchedule", newData)
      .then((res) => {
        if (res.status === 200) {
          const newTrackers = [...schedulesData];
          newTrackers.push(data);
          //   const editedIdx = newTrackers.findIndex((item) => item._id === data._id);
          //   newTrackers[editedIdx] = { ...data };
          schedulesData = newTrackers;
          // setTrackers(newTrackers);
          console.log(newTrackers);
          //   setTrackers(newTrackers);
          setView({
            edit: false,
            add: false,
            diagnose: false,
          });
          successAlert("Schedule edited successfully");
        } else {
          failureAlert("Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // console.log(tracker.data);
  if (!id) return <Redirect to="/alerts-management" />;
  return (
    <React.Fragment>
      <Head title="Add Tracker"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle className="text-primary" page tag="h3">
                Schedule for <Moment format="MMMM Do YYYY">{scheduleDate}</Moment>
              </BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <Button
                color="primary"
                className="mr-4"
                onClick={() =>
                  setView({
                    edit: false,
                    add: true,
                    diagnose: false,
                  })
                }
              >
                <Icon name="edit" className="mr-0.5"></Icon>
                <span>Edit Schedule</span>
              </Button>
              <Link to={`${process.env.PUBLIC_URL}/bus-schedules`}>
                <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                  <Icon name="arrow-left"></Icon>
                  <span>Back</span>
                </Button>
                <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                  <Icon name="arrow-left"></Icon>
                </Button>
              </Link>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card>
            <CardBody className="card-inner">
              <CardTitle className="text-primary centre" tag="h6"></CardTitle>
              <SchedulesDataTable data={schedulesData} expandableRows pagination actions />
            </CardBody>
          </Card>
        </Block>
      </Content>

      <Modal isOpen={view.add} toggle={() => onFormCancel()} className="modal-dialog-centered" size="xl">
        <ModalBody>
          <a href="#cancel" className="close">
            {" "}
            <Icon
              name="cross-sm"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
            ></Icon>
          </a>
          <div className="p-2">
            <EditScheduleModal
              onSubmitHandler={onEditSubmit}
              isEdit={false}
              formData={schedulesData}
              //   clients={clients}
            />
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default ScheduleInfo;
