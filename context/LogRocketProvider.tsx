"use client";

import { useEffect } from "react";
import LogRocket from "logrocket";
import { createClient } from "@/lib/supabase/client";
export default function LogRocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_URL === "http://localhost:3000") {
      return;
    }
    if (typeof window !== "undefined") {
      LogRocket.init("nurexi/nurexi-web");
    }

    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        ["INITIAL_SESSION", "SIGNED_IN", "TOKEN_REFRESHED"].includes(event) &&
        session?.user
      ) {
        const userId = session.user.id;

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", userId)
          .maybeSingle();

        const userEmail = profile?.email || session.user.email || "";
        const userName =
          profile?.full_name ||
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          "New User";

        LogRocket.identify(userId, {
          email: userEmail,
          name: userName,
        });
      }
    });

    // 3. Clean up subscription on component teardown
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
