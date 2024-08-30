export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'DELETE':
            try {
                const { id } = req.query;
                await deleteTask(id); // Replace with your delete function
                res.status(200).json({ message: 'Task deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete task' });
            }
            break;
        default:
            res.setHeader('Allow', ['DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}