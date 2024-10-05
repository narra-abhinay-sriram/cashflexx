import { getServerSession } from "next-auth";
import { auth_options } from "./lib/auth";

import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(auth_options);
  if (session?.user) {
    redirect('/dashboard')
  } else {
    redirect('/api/auth/signin')
  }
}