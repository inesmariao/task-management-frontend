"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  rating?: number;
}

const STATUS_OPTIONS = ["pending", "in-progress", "completed"];
const PRIORITY_OPTIONS = ["high", "medium", "normal"];

const priorityColors: Record<string, string> = {
  high: "text-red-600",
  medium: "text-yellow-600",
  normal: "text-green-600",
};


export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<Task>({
    id: "",
    title: "",
    description: "",
    assignee: "",
    status: STATUS_OPTIONS[0],
    priority: PRIORITY_OPTIONS[0],
    startDate: "",
    endDate: "",
    rating: 0,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskId = params?.id;
        if (!taskId) {
          setError("Task ID is missing in the URL");
          return;
        }
        const response = await axios.get(`http://localhost:4000/tasks/${taskId}`);
        const taskData = response.data;

        setFormData({
          id: taskData._id,
          title: taskData.title,
          description: taskData.description,
          assignee: taskData.assignee || "",
          status: taskData.status || STATUS_OPTIONS[0],
          priority: taskData.priority || PRIORITY_OPTIONS[0],
          startDate: taskData.startDate?.split("T")[0] || "",
          endDate: taskData.endDate?.split("T")[0] || "",
          rating: taskData.rating ?? 0,
        });
      } catch {
        setError("Failed to load the task");
      }
    };

    fetchTask();
  }, [params?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prevData) => ({
      ...prevData,
      rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Confirm Update",
      text: "Are you sure you want to save these changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    });

    if (confirm.isConfirmed) {
      try {
        const taskId = params?.id;
        if (!taskId) {
          Swal.fire({
            title: "Error",
            text: "Task ID is missing in the URL.",
            icon: "error",
          });
          return;
        }

        const { id, ...updatedData } = formData;
        console.log(`Task ID: ${id}`);
        await axios.patch(`http://localhost:4000/tasks/${taskId}`, updatedData);

        await Swal.fire({
          title: "Task Updated!",
          text: "The task has been successfully updated.",
          icon: "success",
          confirmButtonText: "Go to Tasks",
        });

        router.push("/tasks");
      } catch (error) {
        console.error("Error updating task:", error);
        await Swal.fire({
          title: "Update Failed",
          text: "There was an error updating the task. Please try again.",
          icon: "error",
          confirmButtonText: "Back to Edit",
        });
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-xl mx-auto sm:px-6 border-4 border-blue-500 rounded-lg shadow-2xl mt-10 mb-10">
      <h1 className="text-xl font-bold mb-4 text-center">Edit Task</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-bold mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-bold mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="assignee" className="block text-sm font-bold mb-1">
            Assignee
          </label>
          <input
            id="assignee"
            type="text"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-bold mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-bold mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${priorityColors[formData.priority]}`}
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-bold mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-bold mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`text-2xl cursor-pointer ${
                index < (formData.rating ?? 0) ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => handleRatingChange(index + 1)}
            >
              ★
            </span>
          ))}
          <button
            type="button"
            className="ml-2 text-sm text-red-500 underline"
            onClick={(e) => {
              e.preventDefault();
              handleRatingChange(0);
            }}
          >
            Clear Rating
          </button>
        </div>
        <div className="flex justify-center gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => router.push("/tasks")}
          >
            Back to Tasks
        </button>
        </div>
      </form>
    </div>
  );
}
