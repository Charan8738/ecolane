import React from "react";

const TicketHistory = ({ widgets }) => {
  return (
    <table className="table table-orders">
      <thead className="tb-odr-head">
        <tr className="tb-odr-item">
          <th className="tb-odr-info">
            <span className="tb-odr-id">Username</span>
          </th>
          <th>
            <span className="tb-odr-id">Transaction ID</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-odr-date d-none d-md-inline-block">Date</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-odr-date d-none d-md-inline-block">Ticket Count</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-odr-date d-none d-md-inline-block">Activated</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-odr-date d-none d-md-inline-block">Validated</span>
          </th>
        </tr>
      </thead>
      <tbody className="tb-odr-body">
        {ticketHistoryData.map((item, idx) => {
          return (
            <tr className="tb-odr-item" key={idx}>
              <td className="tb-odr-info">
                <span className="tb-odr-id">
                  <a
                    href="#id"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    {item.username}
                  </a>
                </span>
              </td>
              <td className="tb-odr-info">
                <span className="tb-odr-total">{item.tid}</span>
              </td>
              <td className="tb-odr-info">
                <span className="tb-odr-date">{item.date}</span>
              </td>
              <td className="tb-odr-info">
                <span className="tb-odr-total">{item.count}</span>
              </td>
              <td className="tb-odr-info">
                <span className="tb-odr-status">
                  <span className={`badge badge-dot badge-${item.activated ? "success" : "danger"}`}>
                    {item.activated ? "Yes" : "No"} <br />
                  </span>
                  <br />
                  <span>{item.activated ? item.activatedDate : ""}</span>
                </span>
              </td>
              <td className="tb-odr-info">
                <span className="tb-odr-status">
                  <span className={`badge badge-dot badge-${item.validated ? "success" : "danger"}`}>
                    {item.validated ? "Yes" : "No"} <br />
                  </span>
                  <br />
                  <span>{item.validated ? item.validatedDate : ""}</span>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const ticketHistoryData = [
  {
    username: "hari12345",
    tid: "80110700584960871",
    date: "2022-06-02",
    count: "1",
    activated: false,
    validated: false,
  },
  {
    username: "hari12345",
    tid: "80110700584960871",
    date: "2022-06-02",
    count: "1",
    activated: false,
    validated: false,
  },
  {
    username: "hari12345",
    tid: "80110700584960871",
    date: "2022-06-02",
    count: "1",
    activated: true,
    validated: true,
    activatedDate: "2022-06-02T07:12:18.977",
    validatedDate: "2022-06-02T07:12:18.977",
  },
  {
    username: "hari12345",
    tid: "80110700584960871",
    date: "2022-06-02",
    count: "1",
    activated: false,
    validated: false,
  },
  {
    username: "hari12345",
    tid: "80110700584960871",
    date: "2022-06-02",
    count: "1",
    activated: false,
    validated: false,
  },
  {
    username: "hari12345",
    tid: "80110700584960871",
    date: "2022-06-02",
    count: "1",
    activated: false,
    validated: false,
  },
];

export default TicketHistory;
