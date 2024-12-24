import fs from 'fs/promises';

export async function saveToFile(content) {
  const filename = `docs_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
  await fs.writeFile(filename, content);
  return filename;
}