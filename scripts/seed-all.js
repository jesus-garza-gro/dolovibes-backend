#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════
 *  SCRIPT MAESTRO DE POBLACIÓN DE CONTENIDO - DoloVibes
 * ═══════════════════════════════════════════════════════════════
 * 
 * Ejecuta todos los scripts de seed en orden correcto.
 * 100% IDEMPOTENTE: Puede ejecutarse múltiples veces sin crear duplicados.
 * 
 * REQUISITOS PREVIOS:
 * 1. Strapi ejecutándose en localhost:1337
 * 2. Locales configurados en Strapi Admin (ES, EN, IT, DE)
 * 3. STRAPI_API_TOKEN en .env
 * 
 * USO:
 *   node scripts/seed-all.js              # Ejecutar todo
 *   node scripts/seed-all.js --dry-run    # Solo mostrar qué haría
 *   node scripts/seed-all.js --lang=it    # Solo italiano
 *   node scripts/seed-all.js --verify     # Solo verificar estado
 * 
 * @author Dev Consultor
 * @version 1.0.0
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

const SCRIPTS_DIR = __dirname;

// Orden de ejecución (crítico para dependencias)
const SEED_ORDER = [
    // 1. Contenido base español (requisito para todo lo demás)
    { name: 'create-spanish-content.js', desc: 'Contenido base ES', lang: 'es' },

    // 2. Traducciones de packages
    { name: 'seed-english-content.js', desc: 'Packages EN', lang: 'en' },
    { name: 'seed-italian-packages.js', desc: 'Packages IT', lang: 'it' },
    { name: 'seed-german-packages.js', desc: 'Packages DE', lang: 'de' },

    // 3. Traducciones de experiences
    { name: 'seed-experiences-english.js', desc: 'Experiences EN', lang: 'en' },
    { name: 'seed-italian-content.js', desc: 'Experiences IT', lang: 'it' },
    { name: 'seed-german-content.js', desc: 'Experiences DE', lang: 'de' },

    // 4. Single Types (Hero, About)
    { name: 'seed-hero-about-automated.js', desc: 'Hero/About IT,DE', lang: 'multi' },
];

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    return {
        dryRun: args.includes('--dry-run'),
        verify: args.includes('--verify'),
        lang: args.find(a => a.startsWith('--lang='))?.split('=')[1] || null,
        help: args.includes('--help') || args.includes('-h'),
    };
}

function printHeader() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  🌐 SEED MAESTRO - DoloVibes Strapi Population');
    console.log('═══════════════════════════════════════════════════════════════\n');
}

function printHelp() {
    console.log(`
OPCIONES:
  --dry-run     Mostrar qué haría sin ejecutar
  --verify      Solo ejecutar verificación de estado
  --lang=XX     Solo ejecutar scripts de un idioma (es, en, it, de)
  --help, -h    Mostrar esta ayuda

EJEMPLOS:
  node scripts/seed-all.js                # Ejecutar todo
  node scripts/seed-all.js --dry-run      # Ver plan de ejecución
  node scripts/seed-all.js --lang=it      # Solo italiano
  node scripts/seed-all.js --verify       # Verificar estado actual
`);
}

async function checkRequirements() {
    console.log('📋 Verificando requisitos...\n');

    // 1. Verificar .env
    const envPath = path.join(SCRIPTS_DIR, '..', '.env');
    if (!fs.existsSync(envPath)) {
        console.error('❌ Error: No se encontró .env');
        console.log('   Crea el archivo con: STRAPI_API_TOKEN=tu_token');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    if (!envContent.includes('STRAPI_API_TOKEN=')) {
        console.error('❌ Error: STRAPI_API_TOKEN no configurado en .env');
        process.exit(1);
    }
    console.log('  ✅ .env configurado');

    // 2. Verificar Strapi corriendo
    try {
        execSync('curl -s http://localhost:1337/_health > /dev/null', { stdio: 'ignore' });
        console.log('  ✅ Strapi ejecutándose en localhost:1337');
    } catch {
        console.error('❌ Error: Strapi no está ejecutándose');
        console.log('   Inicia Strapi con: npm run develop');
        process.exit(1);
    }

    // 3. Verificar locales
    try {
        const axios = require('axios');
        let token = '';
        envContent.split('\n').forEach(line => {
            if (line.startsWith('STRAPI_API_TOKEN=')) {
                token = line.split('=')[1].trim();
            }
        });

        const response = await axios.get('http://localhost:1337/api/i18n/locales', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const locales = response.data.map(l => l.code);
        const required = ['es', 'en', 'it', 'de'];
        const missing = required.filter(l => !locales.includes(l));

        if (missing.length > 0) {
            console.warn(`  ⚠️  Locales faltantes: ${missing.join(', ')}`);
            console.log('   Agrégalos en: Admin → Settings → Internationalization');
        } else {
            console.log('  ✅ Todos los locales configurados (es, en, it, de)');
        }
    } catch (e) {
        console.warn('  ⚠️  No se pudo verificar locales:', e.message);
    }

    console.log('');
}

function runScript(scriptName, dryRun = false) {
    const scriptPath = path.join(SCRIPTS_DIR, scriptName);

    if (!fs.existsSync(scriptPath)) {
        console.log(`  ⚠️  Script no encontrado: ${scriptName}`);
        return { success: false, skipped: true };
    }

    if (dryRun) {
        console.log(`  📝 [DRY-RUN] Ejecutaría: ${scriptName}`);
        return { success: true, dryRun: true };
    }

    console.log(`  🔄 Ejecutando: ${scriptName}`);

    try {
        execSync(`node "${scriptPath}"`, {
            cwd: path.join(SCRIPTS_DIR, '..'),
            stdio: 'inherit',
            env: { ...process.env }
        });
        return { success: true };
    } catch (error) {
        console.error(`  ❌ Error en ${scriptName}:`, error.message);
        return { success: false, error };
    }
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
    printHeader();

    const options = parseArgs();

    if (options.help) {
        printHelp();
        process.exit(0);
    }

    await checkRequirements();

    // Solo verificar
    if (options.verify) {
        console.log('📊 Ejecutando verificación...\n');
        runScript('verify-completion.js');
        process.exit(0);
    }

    // Filtrar scripts por idioma si se especifica
    let scriptsToRun = SEED_ORDER;
    if (options.lang) {
        scriptsToRun = SEED_ORDER.filter(s =>
            s.lang === options.lang || s.lang === 'multi' || s.lang === 'es'
        );
        console.log(`🔍 Filtrado por idioma: ${options.lang}\n`);
    }

    // Mostrar plan
    console.log('📋 Plan de ejecución:');
    scriptsToRun.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.desc} (${s.name})`);
    });
    console.log('');

    if (options.dryRun) {
        console.log('ℹ️  Modo DRY-RUN: No se ejecutará nada\n');
    }

    // Ejecutar scripts
    const results = {
        success: 0,
        failed: 0,
        skipped: 0
    };

    console.log('─'.repeat(60));

    for (const script of scriptsToRun) {
        console.log(`\n📦 ${script.desc}`);
        const result = runScript(script.name, options.dryRun);

        if (result.success) {
            results.success++;
        } else if (result.skipped) {
            results.skipped++;
        } else {
            results.failed++;
        }
    }

    console.log('\n─'.repeat(60));

    // Resumen
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  📊 RESUMEN');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  ✅ Exitosos:  ${results.success}`);
    console.log(`  ⏭️  Saltados: ${results.skipped}`);
    console.log(`  ❌ Fallidos:  ${results.failed}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Verificación final
    if (!options.dryRun && results.failed === 0) {
        console.log('🔍 Ejecutando verificación final...\n');
        runScript('verify-completion.js');
    }

    process.exit(results.failed > 0 ? 1 : 0);
}

main().catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
});
