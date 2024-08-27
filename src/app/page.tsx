import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/dbConnect";
import Image from "next/image";

export default async function Home() {
  await db.set('hello','hello')
  return (
    <div>
      <MaxWidthWrapper>
        <div className="flex items-center gap-2 justify-center mt-16">
          Hello World
          <Button  isLoading={true} spinner loadingText="Loading"></Button>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
