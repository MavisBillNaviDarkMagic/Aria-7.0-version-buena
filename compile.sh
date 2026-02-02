
#!/bin/bash
echo ">>> ARIA NEXUS PRIME: INICIANDO RECOPILACIÓN UNIFICADA <<<"

# 1. Limpieza
rm -rf dist
rm -rf android/app/build

# 2. Build Web
npm install
npm run build

# 3. Sync Android
npx cap sync android

# 4. Gradle Build (Fuerza bruta sobre permisos)
cd android
chmod +x gradlew
./gradlew assembleRelease

echo ">>> COMPILACIÓN FINALIZADA CON ÉXITO <<<"
