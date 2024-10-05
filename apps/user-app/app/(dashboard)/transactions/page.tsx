import { OnRampTransactions } from "../../../components/Onramp";
import { getServerSession } from "next-auth";
import prisma from"@repo/db/client"
import { auth_options } from "../../lib/auth";

async function getOnRampTransactions() {
    const session = await getServerSession(auth_options);
    const txns = await prisma.onramp.findMany({
        where: {
            userid: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function Transactions() {
    const transactions = await getOnRampTransactions();


    return (
        <div className="w-full">
        <OnRampTransactions transactions={transactions} />
    </div>
    );
  }
  