import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchClients, getClientsError, getClientsStatus, selectAllClients } from "../../redux/clientSlice";
import { Card, Spinner, Button } from "reactstrap";

const ClientTable = ({ isCompact }) => {
  const dispatch = useDispatch();

  const clients = useSelector(selectAllClients);
  const status = useSelector(getClientsStatus);
  const error = useSelector(getClientsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchClients());
    }
  }, [status, dispatch]);
  if (status === "loading" || status === "failed") {
    return (
      <Card>
        <div className="nk-ecwg nk-ecwg6">
          <div className="card-inner">
            <div className="card-title-group" style={{ display: "flex", justifyContent: "center" }}>
              <div>
                <h6 className="title " style={{ textAlign: "center" }}>
                  {status === "loading" ? <Spinner color="primary" /> : error}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  } else if (clients && clients.length > 0) {
    return (
      <table className={`table table-hover table-responsive-sm|-md|-lg|-xl ${isCompact ? "is-compact" : ""}`}>
        <thead>
          <tr className="tb-tnx-head">
            <th className="tb-tnx-id">
              <span className="">CLIENT ID</span>
            </th>
            <th className="tb-tnx-info">
              <span className="tb-tnx-desc d-none d-sm-inline-block">
                <span>NAME</span>
              </span>
            </th>
            <th className="tb-tnx-info">
              <span className="tb-tnx-desc d-none d-sm-inline-block">
                <span>APPROVED</span>
              </span>
            </th>
            <th className="tb-tnx-info">
              <span className="tb-tnx-desc d-none d-sm-inline-block">
                <span>EMAIL</span>
              </span>
            </th>
            <th className="tb-tnx-info">
              <span className="tb-tnx-desc d-none d-sm-inline-block">
                <span></span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {clients &&
            clients.map((item) => {
              return (
                <tr key={item.id} className="tb-tnx-item">
                  <td className="tb-tnx-id">
                    <span>{item.id}</span>
                  </td>
                  <td className="tb-tnx-info">
                    <div className="tb-tnx-desc">
                      <span className="title">{item.venue}</span>
                    </div>
                  </td>
                  <td className="tb-tnx-info">
                    <div className="tb-tnx-desc">
                      <span className={`badge badge-dot badge-${item.status === true ? "success" : "danger"}`}>
                        {item?.status === true ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </td>
                  <td className="tb-tnx-info">
                    <div className="tb-tnx-desc">
                      <span className="title">{item.email}</span>
                    </div>
                  </td>
                  <td className="tb-tnx-info">
                    <div className="tb-tnx-desc">
                      <Button color="danger">Manage</Button>
                    </div>
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
                  No Clients Found
                </h6>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
};

export default ClientTable;
