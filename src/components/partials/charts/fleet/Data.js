export var trafficSources = {
  labels: ["Organic Search", "Social Media", "Referrals", "Others"],
  dataUnit: "People",
  legend: false,
  datasets: [
    {
      borderColor: "#fff",
      backgroundColor: ["#b695ff", "#b8acff", "#ffa9ce", "#f9db7b"],
      data: [4305, 859, 482, 138],
    },
  ],
};

export var trafficSourcesSet2 = {
  labels: ["Vehicles Running", "Vehicles Idle", "Vehicles Parked", "Vehicles Offline"],
  dataUnit: "People",
  legend: false,
  datasets: [
    {
      borderColor: "#fff",
      backgroundColor: ["#1ee0ac", "#364a63", "#f4bd0e", "#e85347"],
      data: [8, 0, 7, 7],
    },
  ],
};
