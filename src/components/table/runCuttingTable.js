export const runCuttingTable = () => {
  return (
    <table className="table table-orders">
      <thead className="tb-odr-head">
        <tr className="tb-odr-item">
          <th className="tb-odr-info">
            <span className="tb-odr-id">Serial No</span>
            <span className="tb-tnx-info">Device ID</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-tnx-info">Device</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-tnx-info">Firmware version</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-odr-date d-none d-md-inline-block">Date - </span>
            <span className="tb-odr-date d-none d-md-inline-block">Time</span>
          </th>
          <th className="tb-odr-info">
            <span className="tb-odr-status d-none d-md-inline-block">Status</span>
          </th>
          <th className="tb-odr-action">&nbsp;</th>
        </tr>
      </thead>
      <tbody className="tb-odr-body">
        {orderData.map((item) => {
          return (
            <tr className="tb-odr-item" key={item.id}>
              <td className="tb-odr-info">
                <span className="tb-odr-id">
                  <a
                    href="#id"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    {item.sno}
                  </a>
                </span>
                <span className="tb-tnx-info">{item.id}</span>
              </td>
              <td className="tb-odr-info">
                <span className="tb-odr-total">
                  <span className="amount">{item.name}</span>
                </span>
              </td>
              <td className="tb-odr-info">
                <span className="tb-odr-total">
                  <span className="amount">{item.firmware}</span>
                </span>
              </td>
              <td className="tb-odr-info">
                <span className="tb-odr-date">{item.date}</span>
                <span className="tb-odr-date">{item.time}</span>
              </td>
              <td className="tb-odr-info">
                <span className="tb-odr-status">
                  <span
                    className={`badge badge-dot badge-${
                      item.status === "Online" ? "success" : item.status === "Pending" ? "warning" : "danger"
                    }`}
                  >
                    {item.status}
                  </span>
                </span>
              </td>
              <td className="tb-odr-action">
                <div className="tb-odr-btns d-none d-md-inline">
                  <Button color="primary" className="btn-sm">
                    Manage
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
