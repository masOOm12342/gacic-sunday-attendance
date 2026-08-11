/**
 * ONE-TIME MIGRATION SCRIPT
 * 
 * Problem: REG-2026-00063 (Sagar Nikam) and REG-2026-00064 (Jagruti Nikam)
 * are duplicates of REG-2026-00022 and REG-2026-00023 respectively.
 * 
 * Fix:
 *   1. Delete the 2 duplicate Nikam entries (REG-2026-00063 & 00064)
 *   2. Renumber REG-2026-00065 → REG-2026-00063, 
 *             REG-2026-00066 → REG-2026-00064, ...
 *             REG-2026-00139 → REG-2026-00137
 * 
 * Run: cd backend && npx ts-node src/db/migrateRegIds.ts
 */

import pool from './index';

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('[Migration] Starting reg_id renumbering...');
    await client.query('BEGIN');

    // Step 1: Delete the 2 duplicate Nikam entries
    const del = await client.query(
      `DELETE FROM members WHERE reg_id IN ('REG-2026-00063', 'REG-2026-00064') RETURNING reg_id, full_name`
    );
    console.log(`[Migration] Deleted ${del.rowCount} duplicate records:`);
    del.rows.forEach((r: any) => console.log(`  - ${r.reg_id}: ${r.full_name}`));

    // Step 2: Renumber REG-2026-00065 through REG-2026-00139 down by 2
    // Must rename in REVERSE order to avoid unique constraint conflicts
    for (let i = 139; i >= 65; i--) {
      const oldId = `REG-2026-${String(i).padStart(5, '0')}`;
      const newId = `REG-2026-${String(i - 2).padStart(5, '0')}`;
      const result = await client.query(
        `UPDATE members SET reg_id = $1 WHERE reg_id = $2 RETURNING full_name`,
        [newId, oldId]
      );
      if (result.rowCount && result.rowCount > 0) {
        console.log(`[Migration] ${oldId} -> ${newId}: ${result.rows[0]?.full_name}`);
      }
    }

    await client.query('COMMIT');
    console.log('[Migration] Migration complete! Last member is now REG-2026-00137.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Migration] Error, rolled back:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
