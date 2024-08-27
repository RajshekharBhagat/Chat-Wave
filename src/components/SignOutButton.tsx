'use client';
import { signOut } from "next-auth/react";
import { cloneElement, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Button, buttonVariants } from "./ui/button";
import { Loader2, LogOut, LogOutIcon } from "lucide-react";

const SignOutButton = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();
    const sighOutFunction = async () => {
        try {
            setIsLoading(true);
            await signOut();
        } catch (error: any) {
            console.log('Failed to Sign out: ',error);
            toast({
                title: 'Failed to Sign out',
                description: error.message,
                variant: 'destructive',
            })
        }
    }
    return (
        <Button variant={'ghost'} isLoading={isLoading} spinner={true} loadingText=" " onClick={sighOutFunction} className="group w-full h-full">
            <LogOut className="h-4 w-4 group-hover:text-red-500 transition-colors duration-300 ease-in-out" />
        </Button>
    )
};

export default SignOutButton;