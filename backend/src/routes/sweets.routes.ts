import { Router } from 'express';
import { createSweet, getSweets, searchSweets, updateSweet, deleteSweet } from '../controllers/sweets.controller';
import { purchaseSweet, restockSweet } from '../controllers/inventory.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createSweet);
router.get('/', getSweets);
router.get('/search', searchSweets);
router.put('/:id', updateSweet);
router.delete('/:id', authorizeAdmin, deleteSweet);

router.post('/:id/purchase', purchaseSweet);
router.post('/:id/restock', authorizeAdmin, restockSweet);

export default router;
