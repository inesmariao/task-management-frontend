"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface TaskFormData {
  title: string;
  description: string;
  assignee: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
}


const STATUS_OPTIONS = ["pending", "in-progress", "completed"];
const PRIORITY_OPTIONS = ["normal", "medium", "high"];

const priorityColors: Record<string, string> = {
  high: "text-red-600",
  medium: "text-yellow-600",
  normal: "text-green-600",
};

export default function CreateTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    assignee: "",
    status: STATUS_OPTIONS[0],
    priority: PRIORITY_OPTIONS[0],
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Confirm Creation",
      text: "Are you sure you want to create this task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, create it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.post("http://localhost:4000/tasks", formData);

        await Swal.fire({
          title: "Task Created!",
          text: "The task has been successfully created.",
          icon: "success",
          confirmButtonText: "Go to Tasks",
          confirmButtonColor: "#28a745",
        });

        router.push("/tasks");
      } catch (error) {
        console.error("Error creating task:", error);
        await Swal.fire({
          title: "Creation Failed",
          text: "There was an error creating the task. Please try again.",
          icon: "error",
          confirmButtonText: "Back to Form",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto sm:px-6 border-4 border-green-500 rounded-lg shadow-2xl mt-10 mb-10">
      <h1 className="text-xl font-bold mb-4 text-center">Create Task</h1>
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
            rows={2}
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
            required
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
            required
          />
        </div>
        <div className="flex justify-center gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Task
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
