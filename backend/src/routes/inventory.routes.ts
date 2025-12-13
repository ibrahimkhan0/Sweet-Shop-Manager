import { Router } from 'express';
import { purchaseSweet, restockSweet, checkoutCart } from '../controllers/inventory.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/checkout', checkoutCart);
router.post('/:id/purchase', purchaseSweet);
router.post('/:id/restock', authorizeAdmin, restockSweet);

export default router;
