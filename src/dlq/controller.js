import { queue } from "./queue.js";

export async function createUser(req,res) {
    const {name,email} = req.body

    console.log("SAVING USER: "+name+" "+email)

    await queue.add("demo-queue-email",{name,email},{
        attempts: 3,
        backoff:{
            type:'exponential',
            delay:2000
        },
        removeOnComplete: true,
        removeOnFail: false
    })
    res.json({ message: "User created + email scheduled" });
}