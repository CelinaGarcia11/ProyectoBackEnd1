import express from 'express'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'

const app = express();

app.use(express.json());

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.get('/', (req,res) => {
    res.send('Tienda de ropa "Olivia Clothes"')
})

const server = app.listen(8080, () => {
    console.log('Server ON')
})