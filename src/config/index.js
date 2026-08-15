import env from './env.js';
import db from './db.js';

// Central config object — config folder exports config objects only.
export default {
  ...env,
  db,
};
