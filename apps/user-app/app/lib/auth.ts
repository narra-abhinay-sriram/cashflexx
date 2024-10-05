import db from "@repo/db/client"
import  CredentialsProvider  from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import Email from "next-auth/providers/email"

export const auth_options={  
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                phone:{label:"Phone Number",type:"text",placeholder:"1231231231"},
                password:{label:"Password",type:"password"},
                email:{label:"Email",type:"text"},
                name:{label:"username",type:"text"}

            },
            async authorize(credentials: any){
                const hashedpass=await bcrypt.hash(credentials.password,10)
                const existing=await db.user.findFirst({
                    where :{
                        number:credentials.phone
                    }
                })
                if(existing){
                    const validpass=await bcrypt.compare(credentials.password,existing.password)
                    if(validpass)
                    {
                        return {
                            id:existing.id.toString(),
                            name:existing.name,
                            email:existing.email,
                            
                        }
                    }
                    return null

                }

                try{
                    const user = await db.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedpass,
                            email: credentials.email ,
                            name: credentials.name 
                        }
                    });
    
               return{
                id:user.id.toString(),
                name:user.name,
                email:user.email
               }
                }
                catch(e){
                    console.error(e)
                }
                return null
            }
        })
    ],
    secret:process.env.NEXTAUTH_SECRET || "SECRET",
    callbacks:{
        async session({token,session}:any){
            session.user.id=token.sub
            return session
        }
    }
}