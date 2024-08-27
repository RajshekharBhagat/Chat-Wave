import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    <div className="w-full flex flex-col gap-3">
        <Skeleton className="mb-4 h-[60] width-[500]" />
        <Skeleton className='h-[20] width-[150]' />
        <Skeleton className='h-[50] width-[140]' />
    </div>
};

export default Loading