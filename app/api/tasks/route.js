import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions'; // Ensure this file exists and exports authOptions

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
