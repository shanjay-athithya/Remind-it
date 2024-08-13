import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export async function GET() {
  try {
    const tasksCollection = collection(db, 'tasks');
    const taskSnapshot = await getDocs(tasksCollection);
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
    const tasksCollection = collection(db, 'tasks');
    await addDoc(tasksCollection, data);

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
