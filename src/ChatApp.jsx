import React from "react";
import UserList from "./UserList";
import Chatro from "./components/Chatro";


const ChatApp = ({room,setRoom}) => {
//   const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="flex flex-col md:flex-row min-h-[50vh]">
      <div className="md:w-1/3 p-4">
        <UserList  setRoom={setRoom} />
      </div>
      <div className="flex-1 p-4">
        {room ? (
          <Chatro room={room} />
        ) : (
          <div className="text-center mt-10 text-gray-500">👈 Select someone to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
