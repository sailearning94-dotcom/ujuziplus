import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');

  // Find all enums
  const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g;
  const enums = [];
  let match;
  while ((match = enumRegex.exec(schema)) !== null) {
    const name = match[1];
    const values = match[2].split('\n').map(v => v.trim()).filter(v => v && !v.startsWith('//'));
    enums.push({ name, values });
  }

  // Build model-to-table mapping
  const modelMap = {};
  const mapRegex = /@@map\("(\w+)"\)/g;
  let mapMatch;
  while ((mapMatch = mapRegex.exec(schema)) !== null) {
    const before = schema.substring(0, mapMatch.index);
    const modelMatch = before.match(/model\s+(\w+)/g);
    if (modelMatch) {
      const modelName = modelMatch[modelMatch.length - 1].replace('model ', '');
      modelMap[modelName] = mapMatch[1];
    }
  }

  // Find all enum-typed columns with their defaults
  const columnsToConvert = [];
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
  let modelMatch;
  while ((modelMatch = modelRegex.exec(schema)) !== null) {
    const modelName = modelMatch[1];
    const tableName = modelMap[modelName] || modelName.toLowerCase();
    const body = modelMatch[2];

    for (const e of enums) {
      // Find: fieldName EnumType @default("VALUE") or @default(VALUE)
      const fieldRegex = new RegExp(`(\\w+)\\s+${e.name}\\s+@default\\(([^)]+)\\)`, 'g');
      let fm;
      while ((fm = fieldRegex.exec(body)) !== null) {
        columnsToConvert.push({
          table: tableName,
          column: fm[1].toLowerCase(),
          enumType: e.name,
          defaultValue: fm[2]
        });
      }
    }
  }

  console.log(`Converting ${columnsToConvert.length} columns:\n`);

  for (const col of columnsToConvert) {
    // Step 1: Drop default
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${col.table}" ALTER COLUMN "${col.column}" DROP DEFAULT;`
      );
    } catch (e) {
      // May not have a default, that's fine
    }

    // Step 2: Convert type
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${col.table}" ALTER COLUMN "${col.column}" TYPE "${col.enumType}" USING "${col.column}"::"${col.enumType}";`
      );
      console.log(`OK ${col.table}.${col.column} -> ${col.enumType}`);
    } catch (err) {
      const m = err.message?.split('\n')[0] || String(err);
      console.log(`~ ${col.table}.${col.column}: ${m}`);
      continue;
    }

    // Step 3: Re-add default (quoted)
    try {
      const def = col.defaultValue.includes('"') ? col.defaultValue : `"${col.defaultValue}"`;
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${col.table}" ALTER COLUMN "${col.column}" SET DEFAULT ${def}::"${col.enumType}";`
      );
    } catch (e) {
      // Non-critical
    }
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
