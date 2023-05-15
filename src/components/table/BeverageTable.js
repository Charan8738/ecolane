import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchClients, getClientsError, getClientsStatus, selectAllClients } from "../../redux/beverageSlice";
import Moment from "react-moment";
import { toast } from "react-toastify";
import { Card, Button } from "reactstrap";
import { Icon } from "../Component";
import "moment-timezone";
import { user_id } from "../../redux/userSlice";
import axios from "axios";

const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};

const successToast = () => {
  console.log("Served!");
  toast.success("Served!", {
    position: "bottom-right",
    autoClose: true,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: false,
    closeButton: <CloseButton />,
  });
};
const BeverageTable = ({ isCompact, beverages }) => {
  const client_id = useSelector(user_id);

  const dispatch = useDispatch(); //dispatch to change values in store
  // selector is used to access the value from the store
  const clients = useSelector(selectAllClients);
  const status = useSelector(getClientsStatus);
  const error = useSelector(getClientsError);
  //to update the beverage status
  const callYourAPI = async (event, Id) => {
    const axiosInstanceRemote = axios.create();
    const response = await axiosInstanceRemote.get(
      "https://zig-app.com/Zigsmartv3ios/api/Admin/UpdatebeverageStatusadmin?id=" + Id + "&Status=2"
    );
    // console.log(Id);
    // setLogs(response.data);
    successToast();
  };

  // console.log(clients);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // if (status === "idle") {
  //     dispatch(fetchClients(client_id));
  //     //   }
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, [status, dispatch]);
  // if (status === "loading" || status === "failed") {
  //   return (
  //     <Card>
  //       <div className="nk-ecwg nk-ecwg6">
  //         <div className="card-inner">
  //           <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
  //             <div>
  //               <h6 className="title " style={{ textAlign: "center" }}>
  //                 {status === "loading" ? <Spinner color="primary" /> : error}
  //               </h6>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </Card>
  //   );
  // }
  // const beverages = clients.filter((item) => item.Status === 0);

  if (beverages && beverages.length > 0) {
    return (
      <table className={`table table-hover table-responsive-sm|-md|-lg|-xl ${isCompact ? "is-compact" : ""}`}>
        <thead>
          <tr className="tb-tnx-head">
            <th className="tb-tnx-info">
              <span>Name</span>
            </th>
            <th className="tb-tnx-info">
              <span>Phone</span>
            </th>

            <th className="tb-tnx-info">
              <span>Beverage</span>
            </th>
            <th className="tb-tnx-info">
              <span>Count</span>
            </th>
            <th className="tb-tnx-info">
              <span>Amount</span>
            </th>
            <th className="tb-tnx-info">
              <span>Datetime</span>
            </th>
            <th className="tb-tnx-info">
              <span>Served</span>
            </th>
          </tr>
        </thead>
        <tbody className="tb-odr-body">
          {beverages &&
            beverages.map((item) => {
              return (
                <tr className="tb-odr-item" key={item.Id}>
                  <td className="tb-odr-info">
                    <span className="tb-odr-total">
                      <span className="name">{item.Name}</span>
                    </span>
                  </td>
                  <td className="tb-odr-info">
                    <span className="tb-odr-total">
                      <span className="phone">{item.phone}</span>
                    </span>
                  </td>
                  <td className="tb-odr-info">
                    <span className="tb-odr-total">
                      <span className="Beveragename" dangerouslySetInnerHTML={{ __html: item.Beveragename }}></span>
                    </span>
                  </td>
                  <td scope="col" className="tb-odr-info">
                    <span className="tb-odr-total">
                      <span className="Beveragecount">{item.Beveragecount}</span>
                    </span>
                  </td>
                  <td scope="col" className="tb-odr-info">
                    <span className="tb-odr-total">
                      <span className="BeverageCost">$ {item.BeverageCost}.00</span>
                    </span>
                  </td>
                  <td className="tb-odr-info">
                    <span className="tb-odr-date">
                      <Moment format="MMMM Do YYYY, h:mm a">{item.Updateddate}</Moment>
                    </span>
                  </td>
                  <td className="tb-odr-info">
                    <Button onClick={(event) => callYourAPI(event, item.Id)} color="danger">
                      Click
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  } else {
    return (
      <Card>
        <div className="nk-ecwg nk-ecwg6">
          <div className="card-inner">
            <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
              <div>
                <h6 className="title " style={{ textAlign: "center" }}>
                  No beverages Found
                </h6>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
};

export default BeverageTable;
