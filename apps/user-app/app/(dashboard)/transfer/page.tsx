import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/Addmoney";
import { BalanceCard } from "../../../components/Balance";
import { OnRampTransactions } from "../../../components/Onramp";
import { getServerSession } from "next-auth";
import { auth_options } from "../../lib/auth";

async function getBalance() {
    const session = await getServerSession(auth_options);
    const balance = await prisma.balance.findFirst({
        where: {
            userid: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

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

export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <AddMoney />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}