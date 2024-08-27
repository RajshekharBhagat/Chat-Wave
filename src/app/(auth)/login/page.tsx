"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { SignInSchema } from "@/schema/SignInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function loginWithGoogle() {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.log("Failed to signin using google: ", error);
      toast({
        title: "Login Failed",
        description: "Something went wrong while login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit() {}

  return (
    <div className="w-full min-h-screen  flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 ">
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-2 bg-orange-50 ring-2 ring-inset ring-orange-600/10 rounded-lg max-w-md md:max-w-4xl w-full shadow-lg">
        <div className={cn("", showLogin ? "hidden md:block" : "block")}>
          <div
            className={cn(
              "absolute hidden z-30 bg-orange-400 h-full rounded-xl md:flex flex-col items-center space-y-5 transition-all duration-500 ease-in-out",
              showLogin ? "left-0 right-1/2" : "left-1/2 right-0"
            )}
          >
            <h1 className="text-3xl font-bold mt-4">ChatWave</h1>
          </div>
          <div className="max-w-sm py-10 w-full p-4 rounded-lg mx-auto flex flex-col space-y-4">
            <div className="flex flex-col items-center gap-8">
              <span className="block md:hidden">Logo</span>
              <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
                Sign into your account
              </h2>
            </div>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 flex flex-col"
                >
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="password" className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="flex-1" type="submit">
                    Login
                  </Button>
                </form>
              </Form>
            </div>
            <span className="text-center font-semibold text-gray-700">or</span>
            <Button
              isLoading={isLoading}
              loadingText="Signing in..."
              onClick={loginWithGoogle}
              className="bg-black hover:bg-black/80"
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="github"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
            <Button className="flex-1" onClick={() => setShowLogin(true)}>
              Login
            </Button>
          </div>
        </div>
        <div className={cn('', showLogin ? 'block':'hidden md:block')}>
        <div className="max-w-sm py-10 w-full p-4 rounded-lg mx-auto flex flex-col space-y-4">
          <div className="flex flex-col items-center gap-8">
            <span className="block md:hidden">Logo</span>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
              Sign into your account
            </h2>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 flex flex-col"
              >
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          className="bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="password" className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Login</Button>
              </form>
            </Form>
          </div>
          <span className="text-center font-semibold text-gray-700">or</span>
          <Button
            isLoading={isLoading}
            loadingText="Signing in..."
            onClick={loginWithGoogle}
            className="bg-black hover:bg-black/80"
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="github"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </Button>
          <Button className="flex-1" onClick={() => setShowLogin(false)}>
            Sigh up
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Page;