import { log } from '../utils/logger';

const { Pool, Client } = require('pg')
// pools will use environment variables
// for connection information
const pool = new Pool()
pool.query('SELECT NOW()', (err: any, res: any) => {
  log.debug(err, res)
  pool.end()
})