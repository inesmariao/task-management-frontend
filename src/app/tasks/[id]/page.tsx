"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: string;
  startDate: string;
  endDate: string;
  rating?: number;
}

export default function TaskDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/tasks/${id}`);
          setTask(response.data);
        } catch (error) {
          console.error('Error fetching task details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id]);

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
      <p className="text-lg mb-2"><strong>Description:</strong> {task.description}</p>
      <p className="text-lg mb-2"><strong>Assignee:</strong> {task.assignee}</p>
      <p className="text-lg mb-2"><strong>Priority:</strong> {task.priority}</p>
      <p className="text-lg mb-2"><strong>Start Date:</strong> {task.startDate}</p>
      <p className="text-lg mb-2"><strong>End Date:</strong> {task.endDate}</p>
      {task.rating && (
        <p className="text-lg mb-2"><strong>Rating:</strong> {task.rating}</p>
      )}
    </div>
  );
}
