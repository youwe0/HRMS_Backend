import { Router } from 'express';
import { departmentController } from '../controllers/index.js';
import { departmentValidators, objectIdParamSchema } from '../validators/index.js';
import {
  authenticate,
  authorize,
  validate,
} from '../middlewares/index.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(departmentValidators.departmentListQuerySchema, 'query'), departmentController.getDepartments);
router.get('/:id', validate(objectIdParamSchema, 'params'), departmentController.getDepartment);

router.post(
  '/',
  authorize(ROLES.ADMIN, ROLES.HR),
  validate(departmentValidators.createDepartmentSchema),
  departmentController.createDepartment
);
router.patch(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.HR),
  validate(objectIdParamSchema, 'params'),
  validate(departmentValidators.updateDepartmentSchema),
  departmentController.updateDepartment
);
router.delete(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.HR),
  validate(objectIdParamSchema, 'params'),
  departmentController.deleteDepartment
);

export default router;
