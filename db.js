const { MongoClient } = require('mongodb')

let dbConnection;

// mongodb+srv://AnantShree_Twitter:Shree@#9110@cluster0.eqyuh72.mongodb.net/

const uri='mongodb+srv://AnantShree_Twitter:Shree%40%239110@cluster0.eqyuh72.mongodb.net/twitter';

module.exports={
    connectToDB:(cb)=>{
        MongoClient.connect(uri)
        .then((client)=>{
           dbConnection = client.db()
           return cb();
        })
        .catch(err=>{
            console.log(err)
            return cb(err);
        })
    },
    getDb:()=>{
        return dbConnection;
    }
}