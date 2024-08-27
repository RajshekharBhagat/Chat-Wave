import GroupChatInput from "@/components/GroupChatInput";
import GroupChatMessage from "@/components/GroupChatMessage";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ParticipantsList from "@/components/ParticipantsList";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import { Input } from "postcss";
import { ReactNode } from "react";
import { getParticipantsByRoomId } from "../../../helper/getParticipantsByRoomId";

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {

  const participants = await getParticipantsByRoomId('FgGErcbMDe-FuSJ8_LEcF')

  return (
    <MaxWidthWrapper>
      <div className="w-full min-h-[calc(100vh-20px)] h-full flex">
        <div className="hidden md:flex border-r-2 px-2 border-orange-100 w-full max-w-72 grow flex-col gap-y-5 overflow-y-auto bg-neutral-50">
          <h1 className="text-xl text-left md:text-center md:text-2xl lg:text-3xl font-bold">
            Chat<span className="text-orange-500">Wave</span>
          </h1>
          <h3 className="text-center text-sm font-semibold">Participants</h3>
          {
            participants.map((participant) => (
              <div key={participant.name}>
                {participant.name}
              </div>
            ))
          }
        </div>
        <aside className="relative max-h-screen container w-full">
          {children}
        </aside>
      </div>
    </MaxWidthWrapper>
  );
};

export default Layout;
