const models = require('./models')
const datos = require('./productos.json')

models.sequelize
    .sync({force: true})
    .then(
        () => { 
            console.log("Models synched")
            datos.map((producto)=>
                models.product.create(producto)
            )
    
    },
        (err) => { console.log("Error:", err)}
    )
