"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

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
  'border-blue-400',
  'border-green-400',
  'border-yellow-400',
  'border-red-400',
  'border-purple-400',
  'border-pink-400',
  'border-indigo-400',
] as const;

const backgroundColors: Record<typeof borderColors[number], string> = {
  'border-blue-400': '#ebf8ff',
  'border-green-400': '#e6fffa',
  'border-yellow-400': '#fffff0',
  'border-red-400': '#ffe5e5',
  'border-purple-400': '#f3e8ff',
  'border-pink-400': '#ffe4e6',
  'border-indigo-400': '#e6e8ff',
};

function getRandomColor(): typeof borderColors[number] {
  return borderColors[Math.floor(Math.random() * borderColors.length)];
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<{ [month: string]: Task[] }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/tasks');

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
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/tasks/edit/${id}`);
  };

  const updateRating = async (id: string, rating: number) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${id}`, { rating });
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const month in updatedTasks) {
          updatedTasks[month] = updatedTasks[month].map((task) =>
            task.id === id ? { ...task, rating } : task
          );
        }
        return updatedTasks;
      });
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Don't worry, this action can be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (confirm.isConfirmed) {
      try {
        await axios.patch(`http://localhost:4000/tasks/${id}`, { isDeleted: true });
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          for (const month in updatedTasks) {
            updatedTasks[month] = updatedTasks[month].filter((task) => task.id !== id);
            if (updatedTasks[month].length === 0) delete updatedTasks[month];
          }
          return updatedTasks;
        });
  
        Swal.fire("Deleted!", "The task has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire("Error", "Failed to delete the task. Please try again.", "error");
      }
    }
  };

  const handleCreateTask = () => {
    router.push('/tasks/new');
  };

  const handleShowDeleted = () => {
    router.push('/tasks/deleted');
  };

  const handleUndoDelete = async (id: string) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${id}/restore`);
      Swal.fire("Restored!", "The task has been restored.", "success");

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        for (const month in updatedTasks) {
          updatedTasks[month] = updatedTasks[month].filter((task) => task.id !== id);
        }
        return updatedTasks;
      });
    } catch (error) {
      console.error('Error restoring task:', error);
      Swal.fire('Error', 'Failed to restore the task. Please try again.', 'error');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading tasks...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Task Overview</h1>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <button
            onClick={handleCreateTask}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Task
          </button>
          <button
            onClick={handleShowDeleted}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Show Deleted Tasks
          </button>
        </div>
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
                    (e.currentTarget as HTMLElement).style.backgroundColor = '';
                  }}
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p>
                    <strong>Assignee:</strong> {task.assignee || 'N/A'}
                  </p>
                  <p>
                    <strong>Priority:</strong> {task.priority}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{' '}
                    {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p>
                    <strong>End Date:</strong>{' '}
                    {task.endDate ? new Date(task.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`text-2xl cursor-pointer ${
                          index < (task.rating ?? 0) ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                        onClick={() => updateRating(task.id, index + 1)}
                      >
                        ★
                      </span>
                    ))}
                    <button
                      className="ml-2 text-sm text-red-500 underline"
                      onClick={(e) => {
                        e.preventDefault();
                        updateRating(task.id, 0);
                      }}
                    >
                      Clear Rating
                    </button>
                  </div>
                  <span
                    className={`mt-2 inline-block px-3 py-1 text-sm font-semibold text-white rounded-lg ${
                      task.status === 'completed'
                        ? 'bg-green-500'
                        : task.status === 'in-progress'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    {task.status}
                  </span>
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(task.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    {!task.isDeleted && (
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                    {task.isDeleted && (
                      <button
                        onClick={() => handleUndoDelete(task.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Undo Deletion
                      </button>
                    )}
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
