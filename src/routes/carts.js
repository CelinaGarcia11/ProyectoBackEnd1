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

export default router;