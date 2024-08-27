"use client";
import AddFiendButton from "@/components/AddFriendButton";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { addFriend } from "./action";

const Page = async() => {

  const {toast} = useToast();
  const [errorMessage,SetErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {mutate: addFriendMutate, isPending} = useMutation({
    mutationKey: ['add-friend-mutation'],
    mutationFn: async(email: string) => await addFriend(email),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Request Sent',
          description: data.message,
        });
        setIsSuccess(true);
      } else {
        toast({
          title: 'Failed to send friend request',
          description: data.message,
          variant: 'destructive',
        });
        SetErrorMessage(data.message);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      SetErrorMessage(error.message);
    }
  });

  return (
    <div className="px-2 md:px-4 mt-10">
        <div className=" flex flex-col space-y-4">
          <h1 className="text-4xl font-semibold">Add Friend</h1>
          <h3>Add friends by email</h3>
            <AddFiendButton errorMessage={errorMessage} isSuccess={isSuccess} isLoading={isPending} addFriendFunction={addFriendMutate} />
        </div>
    </div>
  );
};

export default Page;
