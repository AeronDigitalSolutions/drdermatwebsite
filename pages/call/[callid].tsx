import Layout from "@/components/Layout/Layout";
import { log } from "console";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function callid() {
  const session = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session.status == "unauthenticated") {
      router.push("/login");
    }

    if (session.status == "authenticated") {
      setLoading(false);
    }
  }, [session, session.status]);

  console.log(router.query.callid);

  if (loading) {
    return <h1>Loading</h1>;
  }

  return <div>callid</div>;
}

export default callid;
