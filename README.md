# CLI2Text

`CLI2Text` est un script Node.js qui génère un fichier `outputGPT.txt` contenant une liste détaillée des fichiers et dossiers présents dans un répertoire donné, ainsi que leur contenu, en excluant certains fichiers ou dossiers définis.

## Fonctionnalités

- Analyse récursive d'un répertoire.
- Génère une sortie formatée contenant :
  - Les noms des fichiers et des dossiers.
  - Les tailles des fichiers.
  - Le contenu lisible des fichiers.
- Exclusion de certains fichiers et dossiers comme `node_modules` et `.git`.
