'use client';

import { useParams } from "next/navigation";

const Page = () => {
    const params = useParams<{
        roomId: string;
    }>()
    return (
        <div>
            The room Link is {params.roomId}
        </div>
    )
};

export default Page;