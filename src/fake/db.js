export async function getUserProfileFromDB(userId){
 console.log("Fetching profile from DB...")

 return {
    id: userId,
    name: "Mohit",
    age: 22
 }
}