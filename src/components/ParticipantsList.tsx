import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { getParticipantsByRoomId } from "../../helper/getParticipantsByRoomId";

interface ParticipantsListProps {
  roomId: string;
  participants: User[]
}

const ParticipantsList = async ({ roomId,participants }: ParticipantsListProps) => {
  
  return (
    <div className="max-h-[25rem] flex flex-col mt-4 border-t-2 border-orange-200 overflow-y-auto space-y-2.5">
      <div className="mt-4">
        {participants.map((participants) => (
          <div key={participants.name} className={cn(buttonVariants({variant:'ghost',class:'w-full'}))}>
            <h1 className="text-center font-semibold text-sm">
              {participants.name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
