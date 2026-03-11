import React, { createContext, useState, useEffect } from "react";
import { SpecialistAPI, ServiceAPI } from "../api/client";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [specialists, setSpecialists] = useState([]);
  const [services, setServices] = useState([]);
  const [customFields, setCustomFields] = useState([]);

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
      value={{ specialists, services, customFields, refreshData }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
