"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  rating?: number;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

const borderColors = [
  "border-blue-400",
  "border-green-400",
  "border-yellow-400",
  "border-red-400",
  "border-purple-400",
  "border-pink-400",
  "border-indigo-400",
] as const;

const backgroundColors: Record<typeof borderColors[number], string> = {
  "border-blue-400": "#ebf8ff",
  "border-green-400": "#e6fffa",
  "border-yellow-400": "#fffff0",
  "border-red-400": "#ffe5e5",
  "border-purple-400": "#f3e8ff",
  "border-pink-400": "#ffe4e6",
  "border-indigo-400": "#e6e8ff",
};

function getRandomColor(): typeof borderColors[number] {
  return borderColors[Math.floor(Math.random() * borderColors.length)];
}

export default function DeletedTasksPage() {
  const [tasks, setTasks] = useState<{ [month: string]: Task[] }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDeletedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/tasks/deleted");
        const transformedTasks = response.data.map((task: Task) => ({
          ...task,
          id: task._id,
        }));

        const groupedTasks = transformedTasks.reduce(
          (acc: { [key: string]: Task[] }, task: Task) => {
            const taskDate = new Date(task.createdAt);
            const month = taskDate.getMonth();
            const year = taskDate.getFullYear();
            const monthKey = `${month + 1}/${year}`;

            if (!acc[monthKey]) acc[monthKey] = [];
            acc[monthKey].push(task);
            return acc;
          },
          {}
        );

        setTasks(groupedTasks);
      } catch (error) {
        console.error("Error fetching deleted tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedTasks();
  }, []);


  const handleUndoDelete = async (id: string) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${id}/restore`);
      Swal.fire("Restored!", "The task has been restored.", "success");
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const month in updatedTasks) {
          updatedTasks[month] = updatedTasks[month].filter((task) => task.id !== id);
          if (updatedTasks[month].length === 0) delete updatedTasks[month];
        }
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error restoring task:", error);
      Swal.fire("Error", "Failed to restore the task. Please try again.", "error");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading deleted tasks...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Deleted Tasks</h1>
        <button
          onClick={() => router.push("/tasks")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Tasks
        </button>
      </div>
      {Object.entries(tasks).map(([month, tasks]) => (
        <div key={month} className="w-full max-w-4xl mx-auto mb-6">
          <div className="flex flex-wrap gap-6 justify-center">
            {tasks.map((task) => {
              const borderColor = getRandomColor();
              const backgroundColor = backgroundColors[borderColor];

              return (
                <div
                  key={task.id}
                  className={`flex flex-col gap-2 p-4 border-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-2xl ${borderColor} sm:w-full lg:w-[calc(50%-1.5rem)]`}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                  }}
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p>
                    <strong>Assignee:</strong> {task.assignee || "N/A"}
                  </p>
                  <p>
                    <strong>Priority:</strong> {task.priority}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {task.endDate ? new Date(task.endDate).toLocaleDateString() : "N/A"}
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => handleUndoDelete(task.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Undo Deletion
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
