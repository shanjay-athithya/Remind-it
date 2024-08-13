export default function TaskList({ tasks, filter }) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    if (filter === 'Important') return task.important;
    if (filter === 'Incomplete') return task.status !== 'Completed' && new Date(task.deadline) < new Date();
    return task.status === filter;
  });

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-600 col-span-3">No tasks found.</p>
      ) : (
        filteredTasks.map((task) => (
          <div key={task.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-red-600 font-semibold mt-2">
              Deadline: <span className="text-red-800">{task.deadline}</span>
            </p>
            <p className={`mt-2 font-bold ${task.important ? 'text-red-600' : 'text-gray-500'}`}>
              {task.important ? 'Important' : 'Not Important'}
            </p>
            <p className="mt-2 text-gray-500">{task.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
