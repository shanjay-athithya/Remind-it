import { useState, useEffect } from 'react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the response is empty
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Optionally set an empty state or handle errors in the UI
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      {/* Render your tasks here */}
    </div>
  );
}
