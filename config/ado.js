// 后端数据库连接及CURD接口封装
const MongoClient = require('mongodb').MongoClient

class ADO {
    constructor(url, dbName, collectionName) {
        this.url = url;
        this.dbName = dbName;
        this.collectionName = collectionName;
    }
    _connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.url, { useUnifiedTopology: true }, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    return reject(err)
                } else {
                    resolve(client)
                }
            })
        })
    }
    // 封装CURD
    insert(obj, isMany) {
        return new Promise((resolve, reject) => {
            this._connect.then(client => {
                let dbo = client.db(this.dbName)
                if (isMany) {
                    dbo.collection(this.collectionName).insertMany(obj).then((err, res) => {
                        if (err) throw err;
                        resolve(res)
                        console.log("插入的文档数量为：" + res.insertedCount)
                        client.close()
                    })
                } else {
                    dbo.collection(this.collectionName).insertOne(obj).then((err, res) => {
                        if (err) throw err;
                        resolve(res)
                        client.close()
                    })
                }
            })
        })
    }

    delect(obj, isMany){
        return new Promise((resolve, reject) => {
            this._connect.then(client => {
                let dbo = client.db(this.dbName)
                if(isMany){
                    dbo.collection(this.collectionName).delectMany(obj).then( res => {
                        resolve(res)
                        client.close()
                    })
                } else {
                    dbo.collection(this.collectionName).delectOne(obj).then( res=> {
                        resolve(res)
                        client.close()
                    })
                }
            })
        })
    }

    updata(filter, updatar) {
        return new Promise((resolve, reject) => {
            this._connect().then( client => {
                let updataCpy = { $set: updatar };
                let dbo = client.db(this.dbName);
                dbo.collection(this.collectionName).updataMany(filter, updataCpy).then((err, res) => {
                    if(err) throw err
                    resolve(res)
                    console.log(res.result.nModified + "条文档被更新")
                    client.close()
                })
            })
        })
    }

    query(obj) {
        obj = obj || {} //查询条件，不传即查询全部
        return new Promise((resolve, reject) => {
            this._connect().then(client => {
                let dbo = client.db(this.dbName)
                dbo.collection(this.collectionName).find(obj).toArray((err, res) => {
                    if(err) throw err;
                    resolve(res)
                    client.close()
                })
            })
        })
    }
}

// module.exports = ADO

const ado = new ADO('mongodb://localhost:27017/', 'vue_webgis', 'users')

ado.query({name: 'renliang'}).then(arr => {console.log(arr)})