"use client";

import { cn } from "@/lib/utils";
import { AddFriendSchema } from "@/schema/AddFriendSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface AddFiendButtonProps {
addFriendFunction: (email: string) => void;
isLoading: boolean
isSuccess: boolean
errorMessage?: string
}

const AddFiendButton = ({ addFriendFunction,isLoading,isSuccess,errorMessage }: AddFiendButtonProps) => {
  const form = useForm<z.infer<typeof AddFriendSchema>>({
    resolver: zodResolver(AddFriendSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof AddFriendSchema>) => {
    addFriendFunction(data.email);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xs w-full flex flex-col justify-between"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="email" className="bg-white placeholder:text-gray-700" {...field} />
              </FormControl>
                {
                  isSuccess ? (
                    <span className={cn('text-sm mt-1 ml-2 text-green-500 ')}>Friend request sent</span>
                  ) : (
                    <span className={cn('text-xs mt-1 ml-2 text-wrap text-red-500 ')}>{errorMessage}</span>
                  )
                }
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={isLoading} loadingText='' spinner type="submit">Add Friend</Button>
      </form>
    </Form>
  );
};

export default AddFiendButton;
