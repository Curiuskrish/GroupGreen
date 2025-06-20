import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

const UserList = ({ setRoom }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔼 Upvote / Downvote Logic
  const voteOnUser = async (targetUserId, voteType) => {
    const voterId = auth.currentUser.uid;
    const userRef = doc(db, "users", targetUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const data = userSnap.data();
    const alreadyUp = data.upvotedBy?.includes(voterId);
    const alreadyDown = data.downvotedBy?.includes(voterId);

    let newTrust = data.trustScore || 100;
    let upvotedBy = data.upvotedBy || [];
    let downvotedBy = data.downvotedBy || [];

    if (voteType === "upvote" && !alreadyUp) {
      newTrust += 10;
      upvotedBy.push(voterId);
      downvotedBy = downvotedBy.filter((id) => id !== voterId);
    } else if (voteType === "downvote" && !alreadyDown) {
      newTrust -= 10;
      downvotedBy.push(voterId);
      upvotedBy = upvotedBy.filter((id) => id !== voterId);
    } else {
      console.log("🚫 Already voted");
      return;
    }

    await updateDoc(userRef, {
      trustScore: newTrust,
      upvotedBy,
      downvotedBy
    });

    console.log("✅ Voted:", voteType, "New Score:", newTrust);

    // Refresh that user’s trust score in UI
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === targetUserId
          ? { ...u, trustScore: newTrust, upvotedBy, downvotedBy }
          : u
      )
    );
  };

  // 💬 Start private chat
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
          .filter((doc) => doc.id !== currentUid)
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
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

  if (loading)
    return (
      <div className="text-center mt-10 text-green-600">
        🌾 Loading users...
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg border border-green-300">
      <h2 className="text-xl font-bold text-green-700 mb-4">
        👥 Other Users
      </h2>
      <ul className="divide-y divide-green-200">
        {users.map((user) => (
          <li
            key={user.id}
            className="py-3 flex items-center space-x-4 relative"
          >
            <img
              src={user.photoURL}
              alt={user.name}
              className="w-10 h-10 rounded-full border border-green-400"
            />
            <div className="text-left">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm font-semibold text-yellow-700">
                🌟 Trust: {user.trustScore ?? 100}
              </p>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => voteOnUser(user.id, "upvote")}
                  className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                >
                  👍
                </button>
                <button
                  onClick={() => voteOnUser(user.id, "downvote")}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  👎
                </button>
              </div>
            </div>
            <button
              onClick={() => handleStartChat(user)}
              className="ml-auto bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              💬 Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
// ...existing code...


// ...existing code...