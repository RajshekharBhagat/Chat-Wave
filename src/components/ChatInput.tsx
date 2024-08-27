"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { SendMessageSchema } from "@/schema/SendMessageSchema";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/app/(dashboard)/dashboard/chat/[chatId]/actions";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput = ({ chatPartner, chatId }: ChatInputProps) => {
  const { toast } = useToast();
  const [text,setText] = useState<string>('');
  const form = useForm({
    resolver: zodResolver(SendMessageSchema),
    defaultValues: {
      text: "",
    },
  });
  const { mutate: send, isPending } = useMutation({
    mutationKey: ["send-message"],
    mutationFn: async ({text,chatId}:{text: string, chatId: string}) => await sendMessage({text,chatId}),
    onSuccess: (response) => {
      if (!response.success){
        toast({
          title: "Failed to send message",
          description: response.message,
          variant: "destructive",
        });
      }
    },
    onError(error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const onSubmit = async (data: z.infer<typeof SendMessageSchema>) => {
    if(data.text === '') {return }
    await send({text: data.text, chatId});
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-between gap-1.5 border"
      >
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Textarea
                  placeholder={`Message ${chatPartner.name}`}
                  className="resize-none border-orange-200 bg-neutral-50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant={"ghost"}
          className="rounded-full flex items-center h-full justify-center"
          size={"sm"}
          type="submit"
          isLoading={isPending}
          loadingText=""
          spinner={true}
        >
          <Send className={cn('h-6 w-6 text-orange-500', isPending ? 'hidden' : 'block')} />
        </Button>
      </form>
    </Form>
  );
};

export default ChatInput;
