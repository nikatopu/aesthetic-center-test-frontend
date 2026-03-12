import React, { createContext, useState, useEffect } from "react";
import { SpecialistAPI, ServiceAPI } from "../api/client";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [page, setPage] = useState("schedule");
  const [specialists, setSpecialists] = useState([]);
  const [services, setServices] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

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
