import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ActivityComponent } from "../activity/ActivityComponent";
import "./calender.css";

const CalendarComponent: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [greenDays, setGreenDays] = useState<Set<string>>(new Set());

  const fetchActivitiesForMonth = async () => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysWithActivities = new Set<string>();

    for (let d = start.getDate(); d <= end.getDate(); d++) {
      const dayStr = `${date.getFullYear()}-${date.getMonth() + 1}-${d}`;
      const q = query(collection(db, "activities"), where("date", "==", dayStr));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        daysWithActivities.add(dayStr);
      }
    }

    setGreenDays(daysWithActivities);
  };

  const changeMonth = (direction: "previous" | "next") => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + (direction === "next" ? 1 : -1));
    setDate(newDate);
    setSelectedDay(null);
  };

  useEffect(() => {
    fetchActivitiesForMonth();
  }, [date]);

  const generateDaysInMonth = () => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days: string[] = [];

    for (let d = start.getDate(); d <= end.getDate(); d++) {
      days.push(`${date.getFullYear()}-${date.getMonth() + 1}-${d}`);
    }

    return days;
  };

  return (
    <div className="calendercontainer">
      <h2>Wilmas Kalender</h2>
      <div>
        <button className="calenderbtn" onClick={() => changeMonth("previous")}>
          bakåt
        </button>
        <span className="calendermonth">
          {date.toLocaleString("sv-SE", { month: "long", year: "numeric" })}
        </span>
        <button className="calenderbtn" onClick={() => changeMonth("next")}>
          framåt
        </button>
      </div>

      <div className="calendergrid">
        {generateDaysInMonth().map((day) => {
          const isGreen = greenDays.has(day);
          const isSelected = selectedDay === day;
          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`calenderday ${isGreen ? "green" : ""} ${isSelected ? "selected" : ""}`}
            >
              {day.split("-")[2]}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <ActivityComponent selectedDay={selectedDay} onActivityChange={fetchActivitiesForMonth} />
      )}
    </div>
  );
};

export default CalendarComponent;
