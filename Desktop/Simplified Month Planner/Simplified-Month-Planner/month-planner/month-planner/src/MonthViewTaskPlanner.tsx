import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isWithinInterval,
  format,
  isBefore,
  isAfter,
} from "date-fns";

type TaskCategory = "To Do" | "In Progress" | "Review" | "Completed";

interface Task {
  id: number;
  name: string;
  category: TaskCategory;
  startDate: Date;
  endDate: Date;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthViewTaskPlannerStep1: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [selectStart, setSelectStart] = useState<Date | null>(null);
  const [selectEnd, setSelectEnd] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Modal inputs
  const [taskName, setTaskName] = useState("");
  const [taskCategory, setTaskCategory] = useState<TaskCategory>("To Do");

  // Compute calendar days for display (6 weeks grid)
  useEffect(() => {
    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let day = startDate;
    while (!isAfter(day, endDate)) {
      days.push(day);
      day = addDays(day, 1);
    }
    setCalendarDays(days);
  }, [currentMonth]);

  // Helpers to check if a date is in the selected range
  const inSelectedRange = (day: Date) => {
    if (!selectStart || !selectEnd) return false;
    return isWithinInterval(day, {
      start: selectStart < selectEnd ? selectStart : selectEnd,
      end: selectEnd > selectStart ? selectEnd : selectStart,
    });
  };

  // Mouse handlers for selection
  const onDayMouseDown = (day: Date) => {
    setSelectStart(day);
    setSelectEnd(day);
    setIsSelecting(true);
  };
  const onDayMouseEnter = (day: Date) => {
    if (isSelecting) {
      setSelectEnd(day);
    }
  };
  const onMouseUp = () => {
    if (isSelecting && selectStart && selectEnd) {
      setModalOpen(true);
    }
    setIsSelecting(false);
  };

  // Modal submit handler
  const onModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      name: taskName.trim(),
      category: taskCategory,
      startDate: selectStart && selectEnd && selectStart < selectEnd ? selectStart : selectEnd || selectStart!,
      endDate: selectStart && selectEnd && selectStart > selectEnd ? selectStart : selectEnd || selectStart!,
    };
    setTasks((prev) => [...prev, newTask]);
    setTaskName("");
    setTaskCategory("To Do");
    setModalOpen(false);
    setSelectStart(null);
    setSelectEnd(null);
  };

  return (
    <div
      style={{ userSelect: "none", width: 900, margin: "20px auto", fontFamily: "Arial, sans-serif" }}
      onMouseUp={onMouseUp}
    >
      <h2 style={{ textAlign: "center" }}>
        {format(currentMonth, "MMMM yyyy")}
      </h2>

      {/* Weekday Headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: "2px solid #ddd",
          marginBottom: 4,
        }}
      >
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} style={{ fontWeight: "bold", textAlign: "center", padding: 8 }}>
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
          border: "1px solid #ddd",
        }}
      >
        {calendarDays.map((day) => {
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const selected = inSelectedRange(day);
          // Tasks covering this day
          const dayTasks = tasks.filter(
            (t) => !isBefore(day, t.startDate) && !isAfter(day, t.endDate)
          );

          return (
            <div
              key={day.toISOString()}
              onMouseDown={() => onDayMouseDown(day)}
              onMouseEnter={() => onDayMouseEnter(day)}
              style={{
                minHeight: 80,
                backgroundColor: selected
                  ? "#90caf9"
                  : isToday
                  ? "#e3f2fd"
                  : isCurrentMonth
                  ? "#fff"
                  : "#f0f0f0",
                border: "1px solid #ddd",
                padding: 4,
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontWeight: isToday ? "bold" : "normal",
                  color: isCurrentMonth ? "#000" : "#999",
                  fontSize: 14,
                  marginBottom: 6,
                }}
              >
                {format(day, "d")}
              </div>

              {/* Show tasks as bars */}
              {dayTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    position: "absolute",
                    bottom: 4,
                    left: 4,
                    right: 4,
                    backgroundColor: {
                      "To Do": "#2196f3",
                      "In Progress": "#ff9800",
                      Review: "#9c27b0",
                      Completed: "#4caf50",
                    }[task.category],
                    color: "white",
                    fontSize: 12,
                    padding: "2px 4px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={`${task.name} (${task.category})`}
                >
                  {task.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={onModalSubmit}
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 6,
              minWidth: 300,
            }}
          >
            <h3>Create Task</h3>
            <label>
              Name:
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
                autoFocus
                style={{ width: "100%", padding: 6, marginTop: 6, marginBottom: 12 }}
              />
            </label>
            <label>
              Category:
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
                style={{ width: "100%", padding: 6, marginTop: 6, marginBottom: 12 }}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
            <div style={{ marginTop: 12, textAlign: "right" }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </button>
              <button type="submit">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MonthViewTaskPlannerStep1;
