export default function TaskList({ tasks }) {
  return (
    <div>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-600">No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
