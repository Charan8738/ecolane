const menu = [
  {
    heading: "Dashboards",
  },
  {
    icon: "clipboard",
    text: "Home",
    link: "/home",
    page: 31,
  },
  {
    icon: "cpu",
    text: "Devices",
    page: 1,
    subMenu: [
      {
        icon: "cpu",
        text: "Payment Devices",
        link: "/devices",
      },
      {
        icon: "plus-round-fill",
        text: "Add New Device",
        link: "/add-device",
      },
      {
        icon: "ticket-fill",
        text: "Add Validator",
        link: "add-validator",
      },
      {
        icon: "property-alt",
        text: "Device Setup",
        link: "/device-setup",
        page: 28,
      },
    ],
  },
  {
    icon: "cc-alt2-fill",
    text: "Evolution Configuration",
    link: "/evo-config",
    page: 32,
  },
  {
    icon: "cc-alt2-fill",
    text: "Business Setup",
    page: 3,
    subMenu: [
      {
        icon: "cc-alt2-fill",
        text: "City Setup",
        link: "/gtfs",
        page: 3,
      },
      {
        icon: "user-list-fill",
        text: "Client Setup",
        link: "/client-setup",
        page: 5,
      },
      {
        icon: "contact-fill",
        text: "Venues",
        link: "/museum-data",
        page: 12,
      },
      {
        icon: "clipboard",
        text: "Bus Schedules",
        link: "/run-cutting-scheduler",
        page: 30,
      },
      {
        icon: "clipboard",
        text: "Driver schedules",
        link: "/driver-schedule",
        page: 30,
      },

      {
        icon: "user-alt",
        text: "Visitors",
        link: "/visitors",
        page: 23,
      },
    ],
  },
  {
    icon: "cc-alt2-fill",
    text: "Bus Schedules setup",
    page: 30,
    subMenu: [
      {
        icon: "clipboard",
        text: "Bus Schedules",
        link: "/run-cutting-scheduler",
        page: 30,
      },
      {
        icon: "clipboard",
        text: "Driver schedules",
        link: "/driver-schedule",
        page: 30,
      },
      {
        icon: "clipboard",
        text: "Drivers",
        link: "/drivers",
        page: 30,
      },
    ],
  },
  {
    icon: "user-list-fill",
    text: "Client Approval",
    link: "/clients",
    page: 4,
  },

  {
    icon: "coffee",
    text: "Beverage",
    link: "/Beverage-c1",
    page: 6,
  },
  {
    icon: "ticket-fill",
    text: "Tickets",
    link: "/Tickets",
    page: 7,
  },
  {
    icon: "ticket-fill",
    text: "Tickets Booth",
    link: "/tickets-booth",
    page: 35,
  },

  {
    icon: "coffee",
    text: "Add Products",
    link: "/add-beverages",
    page: 9,
  },
  {
    icon: "map",
    text: "Transit Data",
    link: "/transit-data",
    page: 10,
  },
  {
    icon: "map",
    text: "Transit Approval",
    link: "/transit-approval",
    page: 11,
  },

  ,
  // {
  //   icon: "clipboard",
  //   text: "Run Cutting",
  //   link: "/run-cutting",
  //   page: 13,
  // },
  {
    icon: "map",
    text: "Alerts Management",
    link: "/asset-management",
    page: 14,
  },
  // {
  //   icon: "map",
  //   text: "GPS Trackers",
  //   link: "/add-tracker",
  //   page: 16,
  // },
  {
    icon: "map",
    text: "Fleet Tracking",
    link: "/fleet-tracker",
    page: 29,
  },

  {
    icon: "coins",
    text: "Payments",
    page: 17,
    subMenu: [
      {
        icon: "coins",
        text: "Payment",
        link: "/Payment",
        page: 17,
      },
      {
        icon: "wallet-out",
        text: "Transactions",
        link: "/transactions",
        page: 19,
      },
    ],
  },
  // {
  //   icon: "property",
  //   text: "Beverage History",
  //   link: "/beverage-history",
  //   page: 18,
  // },

  {
    icon: "user-list",
    text: "Rider History",
    link: "/visitorhistory",
    page: 21,
  },
  {
    icon: "property",
    text: "Beverage List",
    link: "/counterlist",
    page: 22,
  },

  {
    icon: "user-alt-fill",
    text: "Visitors VIP",
    link: "/visitorsvip",
    page: 24,
  },
  {
    icon: "users",
    text: "Users",
    link: "/users",
    page: 25,
  },
  {
    icon: "property-alt",
    text: "Analytics",
    link: "/analytics",
    page: 26,
  },
  {
    icon: "cc-alt2-fill",
    text: "All Venues",
    link: "/all-venues",
    page: 33,
  },
  {
    icon: "cc-alt2-fill",
    text: "Attendance",
    link: "/attendance",
    page: 34,
  },
  {
    icon: "cc-alt2-fill",
    text: "Run",
    link: "/run",
    page: 35,
  },
  {
    icon: "chat-fill",
    text: "Support",
    link: "/support",
    page: 20,
  },
];
export default menu;
