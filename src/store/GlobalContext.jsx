import React, { createContext, useState, useEffect } from "react";
import { SpecialistAPI, ServiceAPI } from "../api/client";

export const GlobalContext = createContext();

// Utility function to get current date in UTC (yyyy-MM-dd)
const getCurrentDateUTC = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const GlobalProvider = ({ children }) => {
  const [page, setPage] = useState("schedule");
  const [specialists, setSpecialists] = useState([]);
  const [services, setServices] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getCurrentDateUTC());

  const refreshData = async () => {
    const [specRes, servRes, fieldRes] = await Promise.all([
      SpecialistAPI.getAll(),
      ServiceAPI.getAll(),
      ServiceAPI.getFields(),
    ]);
    setSpecialists(specRes.data);
    setServices(servRes.data);
    setCustomFields(fieldRes.data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        specialists,
        services,
        customFields,
        refreshData,
        selectedDate,
        setSelectedDate,
        page,
        setPage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  const context = React.useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
