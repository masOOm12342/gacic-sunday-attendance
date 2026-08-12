import { query } from './src/db/index';

async function main() {
  const visitors = await query('SELECT * FROM visitors');
  console.log(JSON.stringify(visitors, null, 2));
  process.exit(0);
}

main();
