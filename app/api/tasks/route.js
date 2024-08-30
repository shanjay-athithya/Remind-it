import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions'; // Ensure this file exists and exports authOptions

// Helper function to set response headers
function createResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// GET handler to fetch tasks
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return createResponse({ error: 'Unauthorized' }, 401);
    }

    const userId = session.user.email;
    const tasksCollection = collection(db, 'tasks');
    const tasksQuery = query(tasksCollection, where('userId', '==', userId));
    const taskSnapshot = await getDocs(tasksQuery);

    const tasksList = taskSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return createResponse(tasksList, 200);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return createResponse({ error: 'Failed to fetch tasks' }, 500);
  }
}

// POST handler to create a new task
export async function POST(request) {
  try {
    const data = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return createResponse({ error: 'Unauthorized' }, 401);
    }

    const userId = session.user.email;
    const tasksCollection = collection(db, 'tasks');
    await addDoc(tasksCollection, { ...data, userId });

    return createResponse({ message: 'Task created' }, 201);
  } catch (error) {
    console.error('Error creating task:', error);
    return createResponse({ error: 'Failed to create task' }, 500);
  }
}

// PUT handler to update an existing task
export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return createResponse({ error: 'Unauthorized' }, 401);
    }

    const userId = session.user.email;
    const taskDoc = doc(db, 'tasks', id);
    const taskSnapshot = await getDoc(taskDoc);

    if (!taskSnapshot.exists()) {
      return createResponse({ error: 'Task not found' }, 404);
    }

    const taskData = taskSnapshot.data();
    if (taskData.userId !== userId) {
      return createResponse({ error: 'Unauthorized' }, 403);
    }

    await updateDoc(taskDoc, data);

    return createResponse({ message: 'Task updated' }, 200);
  } catch (error) {
    console.error('Error updating task:', error);
    return createResponse({ error: 'Failed to update task' }, 500);
  }
}

 