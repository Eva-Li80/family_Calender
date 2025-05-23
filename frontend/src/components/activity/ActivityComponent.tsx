import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./activity.css";

interface ActivityComponentProps {
  selectedDay: string;
  onActivityChange: () => void;
}

interface Activity {
  id: string;
  name: string;
  time: string;
}

export const ActivityComponent: React.FC<ActivityComponentProps> = ({
  selectedDay,
  onActivityChange,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activity, setActivity] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const formatDate = (dateString: string): string => {
    const months = [
      "januari", "februari", "mars", "april", "maj", "juni",
      "juli", "augusti", "september", "oktober", "november", "december"
    ];
  
    const [year, month, day] = dateString.split("-");
    const monthName = months[parseInt(month) - 1];
    return `${parseInt(day)} ${monthName} ${year}`;
  };
  

  const fetchActivities = async () => {
    const q = query(
      collection(db, "activities"),
      where("date", "==", selectedDay)
    );
    const snapshot = await getDocs(q);
    const activitiesData: Activity[] = [];
    snapshot.forEach((doc) => {
      activitiesData.push({ ...doc.data(), id: doc.id } as Activity);
    });
    setActivities(activitiesData);
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedDay]);

  const handleAddActivity = async () => {
    if (activity.trim() === "" || time.trim() === "") return;

    try {
      await addDoc(collection(db, "activities"), {
        name: activity,
        date: selectedDay,
        time,
      });

      setActivity("");
      setTime("");
      fetchActivities();
      onActivityChange();
    } catch (e) {
      console.error("Error adding activity:", e);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      const activityDocRef = doc(db, "activities", id);
      await deleteDoc(activityDocRef);
      fetchActivities();
      onActivityChange();
    } catch (e) {
      console.error("Error deleting activity:", e);
    }
  };

  return (
    <div className="activitycontainer">
      <h3>{formatDate(selectedDay)}</h3>
      <ul className="activityul">
        {activities.map((activity) => (
          <li className="activityli" key={activity.id}>
            <span className="spantext">
              {activity.name} - Kl: {activity.time}
            </span>
            <button
              className="activitybtn"
              onClick={() => handleDeleteActivity(activity.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      <div className="acincontainer">
        <input
          className="acin"
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Lägg till aktivitet"
        />
        <input
          placeholder="Lägg till tid"
          className="acin"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <button className="acadd" onClick={handleAddActivity}>
        Spara aktivitet
      </button>
    </div>
  );
};
