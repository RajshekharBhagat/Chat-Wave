'use client';
import axios from 'axios';
import { HousePlusIcon } from "lucide-react";
import { ApiResponse } from "../../types/ApiResponse";
import { buttonVariants } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useRouter } from 'next/navigation';

interface CreateRoomButtonProps {
  sessionId: string,
}

const CreateRoomButton = ({sessionId}: CreateRoomButtonProps) => {
  const {toast} = useToast();
  const router = useRouter();
  const createRoom = async() => {
    try {
      const response = await axios.post<ApiResponse>('/api/rooms/createRoom', {
        hostId: sessionId
      })
      if(!response.data.success) {
        toast({
          title: "Failed to create room",
          description: response.data.message || "Something went wrong",
          variant: "destructive",
        })
      }
      toast({
        title: "Room created",
        description: response.data.data,
      });
      router.push(`/chatroom/${response.data.data}`)
    } catch (error: any) {
      toast({
        title: "Failed to create room",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    }
  };
  return (
    <div
      onClick={createRoom}
      className={buttonVariants({
        variant: "ghost",
        class:
          "w-full group flex cursor-pointer items-center justify-items-start border border-gray-300 hover:translate-x-0.5 transition-transform duration-300 gap-2 p-2 rounded-lg shadow-sm hover:shadow-md",
      })}
    >
      <HousePlusIcon className="w-5 h-5 text-slate-900 mr-2 group-hover:text-orange-500 transition-colors ease-in-out duration-300" />
      <span className="truncate text-slate-900 group-hover:text-orange-500 transition-colors ease-in-out duration-300">
        Create Private Room
      </span>
    </div>
  );
};

export default CreateRoomButton;
