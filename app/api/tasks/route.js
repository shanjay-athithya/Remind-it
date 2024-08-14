import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions'; // Ensure this file exists and exports authOptions

// GET handler to fetch tasks
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const userId = session.user.email; // Assuming user email as userId
    const tasksCollection = collection(db, 'tasks');
    const tasksQuery = query(tasksCollection, where('userId', '==', userId));
    const taskSnapshot = await getDocs(tasksQuery);
    const tasksList = taskSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(tasksList), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// POST handler to create a new task
export async function POST(request) {
  try {
    const data = await request.json();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const userId = session.user.email; // Assuming user email as userId
    const tasksCollection = collection(db, 'tasks');
    await addDoc(tasksCollection, { ...data, userId });

    return new Response(JSON.stringify({ message: 'Task created' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(JSON.stringify({ error: 'Failed to create task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// PUT handler to update an existing task
export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const userId = session.user.email; // Assuming user email as userId
    const taskDoc = doc(db, 'tasks', id);
    const taskSnapshot = await getDoc(taskDoc);

    if (!taskSnapshot.exists()) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const taskData = taskSnapshot.data();
    if (taskData.userId !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    await updateDoc(taskDoc, data);

    return new Response(JSON.stringify({ message: 'Task updated' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return new Response(JSON.stringify({ error: 'Failed to update task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
