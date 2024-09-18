import { Router } from "express";
import fs from "fs"


const router = Router();

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
    products.push(product);
    res.send({status: 'success'})
})


export default router;


// await fs.promises.writeFile(this.path, JSON.stringify(users))