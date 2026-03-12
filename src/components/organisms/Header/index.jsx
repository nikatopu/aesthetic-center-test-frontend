import "./Header.css";
import { useGlobalContext } from "../../../store/GlobalContext";
import { useState, useRef } from "react";

export default function Header() {
  const { selectedDate, setSelectedDate, setPage, page } = useGlobalContext();
  const dateInputRef = useRef(null);

  const navigationConfig = [
    { label: "Schedule", page: "schedule" },
    { label: "Staff", page: "staff" },
    { label: "Services", page: "services" },
  ];

  function formatDateDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function handleDateChange(e) {
    setSelectedDate(e.target.value);
  }

  function openDatePicker() {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  }

  function handlePreviousDay() {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().split("T")[0]);
  }

  function handleNextDay() {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(current.toISOString().split("T")[0]);
  }

  return (
    <nav className="header">
      <div className="navigation-links-container">
        {navigationConfig.map((nav) => (
          <button
            key={nav.page}
            className={`nav-link ${page === nav.page ? "nav-link-active" : ""}`}
            onClick={() => {
              setPage(nav.page);
            }}
          >
            {nav.label}
          </button>
        ))}
      </div>

      {page === "schedule" && (
        <div className="navigation-schedule-controls">
          <button onClick={handlePreviousDay}>
            <svg height="30px" width="30px" viewBox="0 0 34.075 34.075">
              <g>
                <g>
                  <path d="M24.57,34.075c-0.505,0-1.011-0.191-1.396-0.577L8.11,18.432c-0.771-0.771-0.771-2.019,0-2.79    L23.174,0.578c0.771-0.771,2.02-0.771,2.791,0s0.771,2.02,0,2.79l-13.67,13.669l13.67,13.669c0.771,0.771,0.771,2.021,0,2.792    C25.58,33.883,25.075,34.075,24.57,34.075z" />
                </g>
              </g>
            </svg>
          </button>

          <div className="date-display-container">
            <input
              ref={dateInputRef}
              type="date"
              className="navigation-schedule-date-input"
              value={selectedDate}
              onChange={handleDateChange}
              onClick={openDatePicker}
            />
            <span className="formatted-date-display" onClick={openDatePicker}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3498db"
                stroke-linecap="round"
                stroke-linejoin="round"
                height="18"
                width="18"
              >
                <path d="M8 2v4" stroke-width="2"></path>
                <path d="M16 2v4" stroke-width="2"></path>
                <path
                  d="M5 4h14s2 0 2 2v14s0 2 -2 2H5s-2 0 -2 -2V6s0 -2 2 -2"
                  stroke-width="2"
                ></path>
                <path d="M3 10h18" stroke-width="2"></path>
              </svg>
              {formatDateDisplay(selectedDate)}
            </span>
          </div>

          <button onClick={handleNextDay}>
            <svg
              height="30px"
              width="30px"
              viewBox="0 0 34.075 34.075"
              style={{ transform: "rotate(180deg)" }}
            >
              <g>
                <g>
                  <path d="M24.57,34.075c-0.505,0-1.011-0.191-1.396-0.577L8.11,18.432c-0.771-0.771-0.771-2.019,0-2.79    L23.174,0.578c0.771-0.771,2.02-0.771,2.791,0s0.771,2.02,0,2.79l-13.67,13.669l13.67,13.669c0.771,0.771,0.771,2.021,0,2.792    C25.58,33.883,25.075,34.075,24.57,34.075z" />
                </g>
              </g>
            </svg>
          </button>
        </div>
      )}
    </nav>
  );
}
