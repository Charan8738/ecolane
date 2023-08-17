// import React, { useState, useEffect, useRef } from "react";
// import {
//   Icon,
//   BlockHead,
//   Row,
//   Col,
//   Button,
//   Block,
//   BlockHeadContent,
//   BlockTitle,
//   BlockBetween,
//   PreviewCard,
// } from "../components/Component";
// import {
//   Card,
//   Dropdown,
//   DropdownItem,
//   UncontrolledDropdown,
//   Modal,
//   ModalBody,
//   Spinner,
//   FormGroup,
// } from "reactstrap";
// import {DropdownToggle, DropdownMenu} from "reactstrap";
// import { CodeBlock, PreviewTable } from "../components/preview/Preview";
// import styled from "styled-components";
// const Testpage = () => {

//     const [selectedWeek, setSelectedWeek] = useState(null);
//   // Get the current date
//   const currentDate = new Date();

//   // Calculate the date for the previous Monday
//   const mondayDate = new Date(currentDate);
//   mondayDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);

//   // Create an array of week options
//   const weekOptions = Array.from({ length: 5 }, (_, index) => {
//     const startDate = new Date(mondayDate);
//     startDate.setDate(mondayDate.getDate() + index * 7);

//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + 6);

//     return {
//       startDate: startDate.toISOString().split("T")[0],
//       endDate: endDate.toISOString().split("T")[0],
//     };
//   });
  
//    const handleWeekChange = (week) => {
//     setSelectedWeek(week);
//   };

//   return (
//     <React.Fragment>
//         <BlockHead size="lg">
//           <BlockBetween>
//             <BlockHeadContent></BlockHeadContent>
//           </BlockBetween>
//         </BlockHead>
//         <PreviewCard>
//             <h6 className="title mb-3">Week Selector</h6>
//             <ul className="preview-list">
//             <li className="preview-item">
//                 <ul className="d-flex g-3">
//                 <li>
//                     <UncontrolledDropdown>
//                     <DropdownToggle className="dropdown-toggle btn btn-light">
//                         Select the week
//                     </DropdownToggle>
//                     <DropdownMenu>
//                         <ul className="link-list-plain">
//                         {weekOptions.map((week, index) => (
//                             <li key={index}>
//                             <DropdownItem
//                                 tag="a"
//                                 href="#links"
//                                 onClick={(ev) => ev.preventDefault()}
//                             >
//                                 <Icon name="calendar"></Icon>
//                                 <span>
//                                 {`${new Date(week.startDate).toLocaleDateString()} - ${new Date(week.endDate).toLocaleDateString()}`}
//                                 </span>
//                             </DropdownItem>
//                             </li>
//                         ))}
//                         </ul>
//                     </DropdownMenu>
//                     </UncontrolledDropdown>
//                 </li>
//                 </ul>
//             </li>
//             </ul>
//           </PreviewCard>
//     </React.Fragment>
          
//   );
// };


// export default Testpage;


import React, { useState, useEffect, useRef } from "react";
import {
  Icon,
  BlockHead,
  Row,
  Col,
  Button,
  Block,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  BlockHeadContent,
  BlockTitle,
  BlockBetween,
  PaginationComponent,
  PreviewCard,
} from "../components/Component";
import styled from "styled-components";
import backgroundImage from "../assets/images/alerts_manage.png";

import "moment-timezone";
import Moment from "react-moment";
import Content from "../layout/content/Content";
import classNames from "classnames";
import {
  Card,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  Spinner,
  FormGroup,
} from "reactstrap";
import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";
import Head from "../layout/head/Head";
import axios from "axios";
import Swal from "sweetalert2";
import { successAlert } from "../utils/Utils";

const failureAlert = (msg) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: msg,
    focusConfirm: true,
  });
};
const Testpage = () => {
  const INITIAL_ADD_FORM = {
    route_id: "",
    DescriptionText: "",
  };
  const TABLE_HEADING = [
    {
      name: "Route id",
      value: "route_id",
    },
    {
      name: "Description",
      value: "DescriptionText",
    },
  ];
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({ ...INITIAL_ADD_FORM });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);

  const { errors, register, handleSubmit } = useForm();
  const [editId, setEditedId] = useState();
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(new Date());

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const formClass = classNames({
    "form-validate": true,
    "is-alter": true,
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  const resetForm = () => {
    setFormData(INITIAL_ADD_FORM);
    setRangeStart(new Date());
    setRangeEnd(new Date());
  };

  const [selectedWeek, setSelectedWeek] = useState(null);

  // Get the current date
  const currentDate = new Date();
  const mondayDate = new Date(currentDate);
  mondayDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);

  const weekOptions = Array.from({ length: 5 }, (_, index) => {
    const startDate = new Date(mondayDate);
    startDate.setDate(mondayDate.getDate() + index * 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  });

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
  };

  const onCreateAlertHandler = () => {
    const newAlert = { ...formData, Start_Date: rangeStart.toISOString(), End_Date: rangeEnd.toISOString() };
    axios
      .post("AddAlerts", { ...newAlert })
      .then((res) => {
        if (res.status === 200) {
          setData((prev) => [...prev, res.data]);
          resetForm();
          successAlert("Alert created successfully");
        } else {
          throw new Error(res.data);
        }
      })
      .catch((err) => {
        window.alert("Error in creating alerts");
        console.log(err);
      });
  };
  const onDeleteHandler = (route_id) => {
    console.log("tets");
    axios.delete("DeleteVehicleAlerts?route_id=" + route_id).then((res) => {
      if (res.status == 200) {
        successAlert("Alert Deleted successfully");
      } else {
        // throw new Error(res.data);
        failureAlert("Unable to delete alert");
      }
    });
  };
  const onEditAlertHandler = () => {
    const newAlert = { ...formData, Start_Date: rangeStart.toISOString(), End_Date: rangeEnd.toISOString() };
    axios
      .post("UpdateVehicleAlerts", { ...newAlert })
      .then((res) => {
        if (res.status === 200) {
          // setData((prev) => [...prev, res.data]);
          const index = data.findIndex((item) => item.route_id === newAlert.route_id);
          let newItems = [...data];
          newItems[index] = { ...newItems[index], ...newAlert };
          // console.log(newItems);
          setData(newItems);
          resetForm();
          setShowModal(false);
          successAlert("Alert Edited successfully");
        } else {
          throw new Error(res.data);
        }
      })
      .catch((err) => {
        window.alert("Error in Editing alerts");
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent></BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <PreviewCard>
            <div className="card-head">
              <h5 className="card-title">Select the week</h5>
            </div>
            <form className="gy-3" onSubmit={handleSubmit(onCreateAlertHandler)}>
              <Row className="g-3 align-center">
                <Col lg="5">
                  <FormGroup>
                    <label className="form-label">Week Range</label>
                    <span className="form-note">Pick a week from the list</span>
                  </FormGroup>
                </Col>
                <Col lg="7">
                  <FormGroup>
                    <div className="form-control-wrap">
      <div className="form-control-select">
        <UncontrolledDropdown>
          <DropdownToggle className="dropdown-toggle btn btn-light">
            {selectedWeek
              ? `${new Date(selectedWeek.startDate).toLocaleDateString()} - ${new Date(selectedWeek.endDate).toLocaleDateString()}`
              : "Select a week"}
          </DropdownToggle>
          <DropdownMenu>
            <ul className="link-list-plain">
              {weekOptions.map((week, index) => (
                <li key={index}>
                  <DropdownItem
                    tag="a"
                    href="#links"
                    onClick={(ev) => {
                      ev.preventDefault();
                      handleWeekChange(week);
                    }}
                  >
                    {`${new Date(week.startDate).toLocaleDateString()} - ${new Date(week.endDate).toLocaleDateString()}`}
                  </DropdownItem>
                </li>
              ))}
            </ul>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
                  </FormGroup>
                </Col>
              </Row>

              <Row className="g-3">
                <Col lg="7" className="offset-lg-5">
                  <FormGroup className="mt-2">
                    <Button color="primary" size="lg" type="submit">
                      Create
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </form>
          </PreviewCard>
          
        </Block>
        <Modal isOpen={showModal} toggle={() => setShowModal(false)} size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  setShowModal((prev) => {
                    resetForm();
                    return false;
                  });
                }}
              ></Icon>
            </a>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
const Title = styled.h3`
  font-size: 100px;
  font-weight: 900;
  padding-left: 32px;
`;

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 4px 8px -4px rgba(0, 0, 0, 0.3);
  height: 100%;
`;
const AlertTitle = styled.div`
  position: absolute;
  background: #df2020;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: white;
  font-weight: bold;
  z-index: 200;
`;
const List = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  animation: scroll 20s infinite linear;
  li {
    white-space: nowrap;
    padding: 10px 24px;
    color: #494949;
    position: relative;
  }
  li::after {
    content: " ";
    width: 1px;
    height: 100%;
    background: #b8b8b8;
    position: absolute;
    top: 0;
    right: 0;
  }
  li:last-child::after {
    display: none;
  }
  @keyframes scroll {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-1466px);
    }
  }
`;

export default Testpage;
