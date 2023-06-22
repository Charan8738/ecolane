import React, { useState } from "react";
import moment from "moment";
import Select from "react-select";
import styled from "styled-components";

const DropdownContainer = styled.div`
  width: 240px;
  position: relative;
`;

const StyledSelect = styled(Select)`
  .react-select__control {
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: none;
    height: 40px;
    position: relative;
    background-color: #fff;
  }

  .react-select__value-container {
    padding: 0 10px;
  }

  .react-select__menu {
    margin-top: 0;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .react-select__indicator-separator {
    display: none;
  }

  .react-select__dropdown-indicator {
    color: #999;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }

  .react-select__dropdown-indicator svg {
    fill: #999;
    transition: transform 0.3s;
  }

  .react-select__dropdown-indicator:hover svg {
    transform: translateY(-50%) rotate(180deg);
  }
`;

const WeeklyDatePicker = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const startDate = moment("01/1/2023", "M/D/YYYY");
  const endDate = moment("12/31/2030", "M/D/YYYY");
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#ccc",
      "&:hover": {
        borderColor: "#999",
      },
    }),
  };

  const generateWeeklyDateOptions = () => {
    const options = [];
    let currentStartDate = startDate.clone();

    while (currentStartDate <= endDate) {
      const optionText = `${currentStartDate.format("M/D/YYYY")} to ${currentStartDate
        .clone()
        .add(6, "days")
        .format("M/D/YYYY")}`;
      options.push({ value: optionText, label: optionText });
      currentStartDate.add(7, "days");
    }

    return options;
  };

  const handleOptionChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const [start, end] = selectedOption.value.split(" to ");
    const startDate = moment(start, "M/D/YYYY");
    const endDate = moment(end, "M/D/YYYY");

    const dates = [];
    let currentDate = startDate.clone();

    while (currentDate <= endDate) {
      dates.push({
        date: currentDate.format("M/D/YYYY"),
        day: currentDate.format("dddd"),
      });
      currentDate.add(1, "day");
    }

    console.log(dates);
  };

  return (
    <DropdownContainer>
      <StyledSelect
        value={selectedOption}
        onChange={handleOptionChange}
        options={generateWeeklyDateOptions()}
        isSearchable
        styles={customStyles}
        placeholder="Select a weekly date range"
      />
    </DropdownContainer>
  );
};

export default WeeklyDatePicker;
