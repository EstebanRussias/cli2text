import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

// liste des fichiers/dossiers à ignorer
const IGNORE = [
  "node_modules",
  ".git",
  "package.json",
  "package-lock.json",
  "output.txt",
  "outputGPT.txt",
  "README.md",
  "cli2text.js",
];

// taille des fichiers en bits
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }
  return `${bytes.toFixed(1)} ${units[index]}`;
}

// arborescence des fichiers et dossiers
async function listFichiers(dossiers, adentation = '', list_fichier = []) {
  const entrees = await fs.readdir(dossiers, { withFileTypes: true });

  for (const the_entree of entrees) {
    if (IGNORE.includes(the_entree.name)) continue;

    const fullPath = path.join(dossiers, the_entree.name);
    if (the_entree.isDirectory()) {
      console.log(`${adentation}${chalk.green('📂')} ${the_entree.name}`);
      list_fichier.push(`${adentation}📂 ${the_entree.name}`);
      await listFichiers(fullPath, `${adentation}   `, list_fichier);
    } else {
      const stats = await fs.stat(fullPath);
      const size = formatSize(stats.size);
      console.log(`${adentation}${chalk.blue('📄')} ${the_entree.name} (${size})`);
      list_fichier.push({ name: the_entree.name, size, path: fullPath });
    }
  }
  return list_fichier;
}

// export outputGPT.tkt
async function output(dossiers = './') {
  try {
    console.log(chalk.yellow(`Génération de la sortie pour : ${dossiers}`));
    const fichiers = await listFichiers(dossiers);

    const outputContent = await Promise.all(
      fichiers
        .filter((file) => typeof file === 'object') // On ne garde que les fichiers
        .map(async (file) => {
          let fileContent = '';
          try {
            // Lecture du contenu du fichier
            fileContent = await fs.readFile(file.path, 'utf-8');
          } catch {
            fileContent = 'Fichier non lisible ou binaire.';
          }
          return `${file.name} (${file.size})\n${file.path}\n---------------------------------------------------------------------------------------------------------------------------------------------------------\n${fileContent}\n---------------------------------------------------------------------------------------------------------------------------------------------------------`;
        })
    );

    await fs.writeFile('outputGPT.txt', outputContent.join('\n\n'), 'utf-8');
    console.log(chalk.green('La sortie a été enregistrée dans "outputGPT.txt".'));
  } catch (error) {
    console.error(chalk.red(`Erreur : ${error.message}`));
  }
}

// Appel de la fonction principale
output();
