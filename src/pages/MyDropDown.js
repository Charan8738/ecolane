import React from "react";
import Select from "react-select";
import styled from "styled-components";

const DropdownContainer = styled.div`
  width: 200px;
  position: relative;
`;

const Dropdown = styled(Select)`
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

const MyDropdown = ({ onChangeHandle, driverlist }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#ccc",
      "&:hover": {
        borderColor: "#999",
      },
    }),
  };

  const options = driverlist
    .filter((driver) => !driver.schedule)
    .map((driver) => ({
      value: driver.id,
      label: `${driver.driver_first_name} ${driver.driver_last_name}`,
    }));

  const handleChange = (selectedOption) => {
    console.log("Selected option:", selectedOption);
    onChangeHandle(selectedOption);
  };

  return (
    <DropdownContainer>
      <Dropdown
        options={options}
        onChange={handleChange}
        isSearchable
        placeholder="Select Driver"
        styles={customStyles}
      />
    </DropdownContainer>
  );
};

export default MyDropdown;
