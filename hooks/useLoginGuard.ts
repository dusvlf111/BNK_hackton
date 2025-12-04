import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useLoginGuard() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
  
    useEffect(() => {
      if (!isPending && !session) {
        router.push("/auth/login");
      }
    }, [session, router, isPending]);
}