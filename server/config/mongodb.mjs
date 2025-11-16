import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        mongoose.connection.on('connected',()=>{
            console.log("connected to the database");
        })
        await mongoose.connect("mongodb+srv://dj338832_db_user:ZOQ3clx12RLM1vGz@cluster0.fzpqnnu.mongodb.net/team-task-manager?appName=Cluster0");
    } catch (error) {
        console.log(error);
    } 
}