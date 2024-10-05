import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { auth_options } from "../../lib/auth";

export const GET=async ()=>{
    const session=await getServerSession(auth_options)
    if(session.user){
        return NextResponse.json({
            user:session.user
        })

    }
    return NextResponse.json({message:"you are not logged in"},{status:403})
}