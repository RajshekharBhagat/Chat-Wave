import { SideBarOption } from "@/app/(dashboard)/dashboard/layout";
import { Menu } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import FriendRequestSideBarOption from "./FriendRequestSideBarOption";
import { Icons } from "./Icons";
import SideBarChatList from "./SideBarChatList";
import SignOutButton from "./SignOutButton";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";

interface MobileLayoutProps {
  friends: User[];
  session: Session;
  unseenRequestCount: number;
  sidebarOptions: SideBarOption[];
  className?: string;
}

const MobileLayout = ({
  friends,
  session,
  unseenRequestCount,
  sidebarOptions,
  className,
}: MobileLayoutProps) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="absolute top-0 left-0 md:hidden" />
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[400]  border border-red-500   bg-neutral-50">
        <SheetHeader>
          <SheetTitle>
            <Link
              href={"/dashboard"}
              className="text-xl text-left md:text-center md:text-2xl lg:text-3xl font-bold"
            >
              Chat<span className="text-orange-500">Wave</span>
            </Link>
          </SheetTitle>
          <SheetDescription>
            <div className="flex flex-col flex-auto px-0.5 h-full w-full gap-y-5 overflow-y-auto">
              {friends.length > 0 ? (
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Your chats
                </div>
              ) : null}
              <nav className="flex flex-col flex-1">
                <ul role="list" className="flex flex-col flex-1 gap-y-4">
                  <li>
                    <SideBarChatList
                      sessionId={session.user.id}
                      friends={friends}
                    />
                  </li>
                  <li>
                    <div className="font-semibold text-xs text-gray-400">
                      Overview
                    </div>
                    <ul role="list" className="mt-2 space-y-1">
                      {sidebarOptions.map((option) => {
                        const Icon = Icons[option.icon];
                        return (
                          <li key={option.id}>
                            <Link
                              href={option.href}
                              className={buttonVariants({
                                variant: "ghost",
                                class:
                                  "w-full group flex items-center justify-items-start border border-gray-300 hover:translate-x-0.5 transition-transform duration-300 gap-2 p-2 rounded-lg shadow-sm hover:shadow-md",
                              })}
                            >
                              <Icon className="w-5 h-5 text-slate-900 mr-2 group-hover:text-orange-500 transition-colors ease-in-out duration-300" />
                              <span className="truncate text-slate-900 group-hover:text-orange-500 transition-colors ease-in-out duration-300">
                                {option.name}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                  <li>
                    <FriendRequestSideBarOption
                      sessionId={session.user.id}
                      initialUnseenRequestCount={unseenRequestCount}
                    />
                  </li>
                  <li className="mt-auto flex flex-col">
                    <div className="flex border-t-2 border-orange-200 py-2 items-center">
                      <div className="relative shrink-0 w-8 h-8">
                        <Image
                          fill
                          src={session.user.image!}
                          className="rounded-full"
                          referrerPolicy="no-referrer"
                          alt="Profile Image"
                        />
                      </div>
                      <div className="ml-1.5 flex flex-col">
                        <span>
                          <h1 className="text-xs font-semibold truncate text-zinc-900">
                            {session.user.name}
                          </h1>
                        </span>
                        <span>
                          <h1 className="text-xs truncate text-zinc-500">
                            {session.user.email}
                          </h1>
                        </span>
                      </div>
                      <SignOutButton />
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileLayout;

{
  /* <Sheet>
  <SheetTrigger>
        <Button>
        Menu <Menu className="h-6 w-6 text-orange-600" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            ChatWave
          </SheetDescription>
          <div className="hidden md:flex border-r-2 px-2 border-orange-100 h-full w-full max-w-72 grow flex-col gap-y-5 overflow-y-auto bg-neutral-50">
            <Link
              href={"/dashboard"}
              className="text-xl text-left md:text-center md:text-2xl lg:text-3xl font-bold"
            >
              Chat<span className="text-orange-500">Wave</span>
            </Link>
            {friends.length > 0 ? (
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Your chats
              </div>
            ) : null}
            <nav className="flex flex-col flex-1">
              <ul role="list" className="flex flex-col flex-1 gap-y-4">
                <li>
                  <SideBarChatList
                    sessionId={session.user.id}
                    friends={friends}
                  />
                </li>
                <li>
                  <div className="font-semibold text-xs text-gray-400">
                    Overview
                  </div>
                  <ul role="list" className="mt-2 space-y-1">
                    {sidebarOptions.map((option) => {
                      const Icon = Icons[option.icon];
                      return (
                        <li key={option.id}>
                          <Link
                            href={option.href}
                            className={buttonVariants({
                              variant: "ghost",
                              class:
                                "w-full group flex items-center justify-items-start border border-gray-300 hover:translate-x-0.5 transition-transform duration-300 gap-2 p-2 rounded-lg shadow-sm hover:shadow-md",
                            })}
                          >
                            <Icon className="w-5 h-5 text-slate-900 mr-2 group-hover:text-orange-500 transition-colors ease-in-out duration-300" />
                            <span className="truncate text-slate-900 group-hover:text-orange-500 transition-colors ease-in-out duration-300">
                              {option.name}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li>
                  <FriendRequestSideBarOption
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
                <li className="mt-auto flex flex-col">
                  <div className="flex border-t-2 border-orange-200 py-2 items-center">
                    <div className="relative shrink-0 w-8 h-8">
                      <Image
                        fill
                        src={session.user.image!}
                        className="rounded-full"
                        referrerPolicy="no-referrer"
                        alt="Profile Image"
                      />
                    </div>
                    <div className="ml-1.5 flex flex-col">
                      <span>
                        <h1 className="text-xs font-semibold truncate text-zinc-900">
                          {session.user.name}
                        </h1>
                      </span>
                      <span>
                        <h1 className="text-xs truncate text-zinc-500">
                          {session.user.email}
                        </h1>
                      </span>
                    </div>
                    <SignOutButton />
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet> */
}
