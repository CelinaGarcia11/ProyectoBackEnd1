import { Router } from "express";

const router = Router();

const carts = [];

router.get('/', (req, res) => {
    res.send(carts)
})

router.post('/', (req,res) => {
    const cart = req.body;
    carts.push(cart);
    res.send({status: 'success'})
})

router.post('/', (req,res) => {
    const cart = req.body;
    if (!cart.id || !cart.products.json ) {
        return res.status(422).send({ status: 'error', error: 'Valores incompletos'})
    }
    carts.push(cart);
    res.send({status: 'success', message: 'Carrito creado'})
})

router.get('/:cart', (req, res) => {
    const params = req
     const parsedCarts= JSON.parse(carts)
     res.send(parsedCarts.slice(0))
 })

 
 


export default router;