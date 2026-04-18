import { emailQueue } from "./queue.js"

export async function createUser(req,res) {
    const {name,email} = req.body

    console.log("SAVING USER: "+name+" "+email)

    await emailQueue.add("send-email",{name,email},{
        attempts: 3,
        backoff:{
            type:'exponential',
            delay:2000
        },
        removeOnComplete: true
    })
    res.json({ message: "User created + email scheduled" });
}