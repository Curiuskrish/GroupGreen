import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import {  updateDoc } from "firebase/firestore";
const UserList = (setRoom) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

const handleStartChat = (otherUser) => {
  const currentUser = auth.currentUser;
  const chatRoomId =
    currentUser.uid > otherUser.uid
      ? `${currentUser.uid}_${otherUser.uid}`
      : `${otherUser.uid}_${currentUser.uid}`;
  setRoom(chatRoomId);
};
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const currentUid = auth.currentUser?.uid;

        const userList = querySnapshot.docs
          .filter((doc) => doc.id !== currentUid) // ✂️ remove current user
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setUsers(userList);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center mt-10 text-green-600">🌾 Loading users...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg border border-green-300">
      <h2 className="text-xl font-bold text-green-700 mb-4">👥 Other Users</h2>
      <ul className="divide-y divide-green-200">
        {users.map((user) => (
          <li key={user.id} className="py-3 flex items-center space-x-4">
            <img
              src={user.photoURL}
              alt={user.name}
              className="w-10 h-10 rounded-full border border-green-400"
            />
            <div className="text-left">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
              <button onClick={() => handleStartChat(user)} className="ml-auto bg-green-500 text-white px-3 py-1 rounded">
    Chat 💬
  </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
