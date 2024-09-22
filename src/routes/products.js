import { Router } from "express";
import fs from "fs"


let router = Router();

const products = await fs.promises.readFile("src/db/products.json", "utf-8")

router.get('/', (req, res) => {
   const params = req
    const limit = req.query.limit
    const parsedProducts = JSON.parse(products)
    res.send(parsedProducts.slice(0,limit))
})

router.get('/:product', (req, res) => {
    const params = req.params.product
     const parsedProducts = JSON.parse(products).filter(products => products.id === params)
     res.send(parsedProducts)
 })


router.post('/', (req,res) => {
    const product = req.body;
    if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category ) {
        return res.status(422).send({ status: 'error', error: 'Valores incompletos'})
    }
    products.push(product);
    res.send({status: 'success', message: 'Producto creado'})
})

router.put('/:id', (req, res) => {
    const productID = req.params.id
    const updateProduct = req.body

    const index = products.findIndex(product => product.id == productID)

    if (index === -1) {
        return res.status(404).send({status: 'error', message: 'Producto no encontrado'})
    }

    if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category ) {
        return res.status(422).send({ status: 'error', error: 'Valores incompletos'})
    }

    products[index] = updateProduct
    res.send({status: 'success', message: 'Producto editado'})

})

router.delete('/:id', (req, res) => {
    const productID = req.params.id;
    const currentLenght = products.length

    products = products.filter(product => productID != product.id)

    if (currentLenght === products.length) {
        return res.status(404).send({status: 'error', message: 'Producto no encontrado'})
    }

    res.send({status: 'success', message: products})
})

export default router;


// await fs.promises.writeFile(this.path, JSON.stringify(users))