// import React, { useState, useEffect } from "react";
// import "./Alarm.css";

// function Alarm() {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [alarmTime, setAlarmTime] = useState("");
//   const [isAlarmSet, setIsAlarmSet] = useState(false);
//   const [isAlarmRinging, setIsAlarmRinging] = useState(false);
//   const [audio] = useState(
//     new Audio(
//       "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"
//     )
//   );

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//       checkAlarm();
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [alarmTime, isAlarmSet]);

//   useEffect(() => {
//     if (isAlarmRinging) {
//       audio.loop = true;
//       audio.play().catch((err) => console.log("Audio play blocked:", err));
//     } else {
//       audio.pause();
//       audio.currentTime = 0;
//     }
//   }, [isAlarmRinging]);

//   const checkAlarm = () => {
//     if (!isAlarmSet || !alarmTime) return;

//     const current = currentTime.toTimeString().slice(0, 5); // Extract "HH:MM"

//     if (current === alarmTime) {
//       setIsAlarmRinging(true);
//     }
//   };

//   const handleSetAlarm = () => {
//     if (!alarmTime) return;
//     setIsAlarmSet(true);
//     setIsAlarmRinging(false);
//   };

//   const handleStopAlarm = () => {
//     setIsAlarmSet(false);
//     setIsAlarmRinging(false);
//   };

//   return (
//     <div className={`alarm-container ${isAlarmRinging ? "ringing" : ""}`}>
//       <div className="clock">
//         <h1>{currentTime.toLocaleTimeString()}</h1>
//         <p>{currentTime.toLocaleDateString()}</p>
//       </div>

//       <div className="alarm-controls">
//         <input
//           type="time"
//           value={alarmTime}
//           onChange={(e) => setAlarmTime(e.target.value)}
//           disabled={isAlarmSet}
//         />

//         {!isAlarmSet ? (
//           <button onClick={handleSetAlarm} disabled={!alarmTime}>
//             Set Alarm
//           </button>
//         ) : (
//           <button onClick={handleStopAlarm}>Stop Alarm</button>
//         )}
//       </div>

//       <div className="alarm-status">
//         {isAlarmSet && !isAlarmRinging && <p>Alarm set for {alarmTime}</p>}
//         {isAlarmRinging && <p>⏰ Alarm Ringing!</p>}
//       </div>
//     </div>
//   );
// }

// export default Alarm;

import { useState, useEffect, useRef } from "react";
import "./Alarm.css";

// const Alarm = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [alarms, setAlarms] = useState([]);
//   const [newAlarmTime, setNewAlarmTime] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const audioRef = useRef(null);

//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//       checkAlarms();
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Check alarms against current time
//   const checkAlarms = () => {
//     alarms.forEach((alarm) => {
//       if (
//         !alarm.isTriggered &&
//         alarm.isActive &&
//         currentTime.getHours() === alarm.time.getHours() &&
//         currentTime.getMinutes() === alarm.time.getMinutes()
//       ) {
//         triggerAlarm(alarm.id);
//       }
//     });
//   };

//   // Trigger alarm
//   const triggerAlarm = (id) => {
//     setAlarms(
//       alarms.map((alarm) =>
//         alarm.id === id ? { ...alarm, isTriggered: true } : alarm
//       )
//     );
//     audioRef.current.play();
//     setIsModalOpen(true);
//   };

//   // Add new alarm
//   const addAlarm = () => {
//     if (!newAlarmTime) return;

//     const newAlarm = {
//       id: Date.now(),
//       time: new Date(newAlarmTime),
//       isActive: true,
//       isTriggered: false,
//     };

//     setAlarms([...alarms, newAlarm]);
//     setNewAlarmTime("");
//   };

//   // Delete alarm
//   const deleteAlarm = (id) => {
//     setAlarms(alarms.filter((alarm) => alarm.id !== id));
//   };

//   // Toggle alarm active state
//   const toggleAlarm = (id) => {
//     setAlarms(
//       alarms.map((alarm) =>
//         alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
//       )
//     );
//   };

//   // Snooze functionality
//   const snoozeAlarm = () => {
//     audioRef.current.pause();
//     audioRef.current.currentTime = 0;
//     setIsModalOpen(false);

//     setAlarms(
//       alarms.map((alarm) => {
//         if (alarm.isTriggered) {
//           const newTime = new Date(alarm.time);
//           newTime.setMinutes(newTime.getMinutes() + 5);
//           return { ...alarm, time: newTime, isTriggered: false };
//         }
//         return alarm;
//       })
//     );
//   };

//   // Stop alarm
//   const stopAlarm = () => {
//     audioRef.current.pause();
//     audioRef.current.currentTime = 0;
//     setIsModalOpen(false);

//     setAlarms(
//       alarms.map((alarm) =>
//         alarm.isTriggered ? { ...alarm, isTriggered: false } : alarm
//       )
//     );
//   };

//   return (
//     <div className="alarm-container">
//       <div className="clock-display">
//         <h1>{currentTime.toLocaleTimeString()}</h1>
//         <p>{currentTime.toLocaleDateString()}</p>
//       </div>

//       <div className="alarm-controls">
//         <input
//           type="time"
//           value={newAlarmTime}
//           onChange={(e) => setNewAlarmTime(e.target.value)}
//         />
//         <button onClick={addAlarm}>Add Alarm</button>
//       </div>

//       <div className="alarms-list">
//         <h2>Active Alarms</h2>
//         {alarms.map((alarm) => (
//           <div key={alarm.id} className="alarm-item">
//             <span className={!alarm.isActive ? "disabled" : ""}>
//               {alarm.time.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </span>
//             <div className="alarm-actions">
//               <button
//                 className={`toggle ${alarm.isActive ? "active" : "inactive"}`}
//                 onClick={() => toggleAlarm(alarm.id)}
//               >
//                 {alarm.isActive ? "ON" : "OFF"}
//               </button>
//               <button className="delete" onClick={() => deleteAlarm(alarm.id)}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {isModalOpen && (
//         <div className="alarm-modal">
//           <div className="modal-content">
//             <h2>Alarm Triggered!</h2>
//             <div className="modal-buttons">
//               <button onClick={snoozeAlarm}>Snooze (5 mins)</button>
//               <button onClick={stopAlarm}>Stop Alarm</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <audio
//         ref={audioRef}
//         src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"
//       />
//     </div>
//   );
// };

const Alarm = () => {
  const [Time, setTime] = useState(new Date());
  const [AlarmTime, setAlarmTime] = useState(""); // FIX: Initialize as a string
  const [arr, setarr] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      if (arr.length > 0) {
        ring();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [arr]); // FIX: Only re-run when alarms change

  function SetAlarm(val) {
    setAlarmTime(val);
  }

  function ring() {
    const currentTime = new Date()
      .toLocaleTimeString("en-US", { hour12: false })
      .slice(0, 5); // FIX: Extract HH:MM format

    arr.forEach((t) => {
      if (t === currentTime) {
        console.log("🔔 Alarm ringing for:", t);
      }
    });
  }

  function addAlarm() {
    if (AlarmTime) {
      setarr((prev) => [...prev, AlarmTime]); // FIX: Use functional update
    }
  }

  useEffect(() => {
    console.log("Updated Alarms: ", arr);
  }, [arr]); // FIX: Log updated alarms

  return (
    <>
      <div className="alarm-container">
        <center>{Time.toLocaleTimeString()}</center>
        <center className="alarm-controls">
          <input
            type="time"
            value={AlarmTime}
            onChange={(e) => SetAlarm(e.target.value)}
          />
          <button onClick={addAlarm}>Add Alarm</button>
        </center>
      </div>
    </>
  );
};

export default Alarm;
