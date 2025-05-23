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
    const year = date.getFullYear();
    const month = date.getMonth();
    const end = new Date(year, month + 1, 0);
    const daysWithActivities = new Set<string>();

    for (let d = 1; d <= end.getDate(); d++) {
      const dayStr = `${year}-${month + 1}-${d}`;
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
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const days: (string | null)[] = [];

    let weekday = firstDay.getDay();
    if (weekday === 0) weekday = 7; // söndag → 7

    // Lägg till tomma celler innan månadens första dag
    for (let i = 1; i < weekday; i++) {
      days.push(null);
    }

    // Lägg till riktiga datum
    for (let d = 1; d <= end.getDate(); d++) {
      days.push(`${year}-${month + 1}-${d}`);
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
          {date.toLocaleString("sv-SE", { month: "long"})}
        </span>
        <button className="calenderbtn" onClick={() => changeMonth("next")}>
          framåt
        </button>
      </div>

      <div className="calendergrid">
        {["M", "Ti", "O", "To", "F", "L", "S"].map((day) => (
          <div key={day} className="calenderday header" style={{color: "black"}}>
            {day}
          </div>
        ))}

        {generateDaysInMonth().map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calenderday empty"></div>;
          }

          const isGreen = greenDays.has(day);
          const isSelected = selectedDay === day;
          const dateParts = day.split("-");
          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

          return (
            <div
              key={day}
              title={`Aktiviteter för ${formattedDate}`}
              onClick={() => setSelectedDay(day)}
              className={`calenderday ${isGreen ? "green" : ""} ${isSelected ? "selected" : ""}`}
            >
              {dateParts[2]}
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
