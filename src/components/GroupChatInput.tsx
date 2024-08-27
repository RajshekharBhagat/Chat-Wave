'use client';
import { useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendMessageSchema } from "@/schema/SendMessageSchema";
import { text } from "stream/consumers";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface GroupChatInputProps {
    roomId: string,
    name?: string,
}

const GroupChatInput = ({roomId}:GroupChatInputProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(SendMessageSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SendMessageSchema>) => {
    console.log(data.text);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center justify-center gap-1.5 border"
      >
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Textarea
                  placeholder={`Message`}
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
          isLoading={isLoading}
          loadingText=""
          spinner={true}
        >
          <Send className={cn('h-6 w-6 text-orange-500', isLoading ? 'hidden' : 'block')} />
        </Button>
      </form>
    </Form>
  );
};

export default GroupChatInput;
