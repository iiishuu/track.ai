# Security Standards

## Niveau attendu: production-ready pour un MVP

- **Rate limiting** sur les endpoints de scan par IP (pas d'auth = risque de spam des APIs payantes)
- **Input validation**: Valider et sanitizer le domaine en input (format, longueur, caracteres autorises)
- **API keys**: Toutes dans `.env`, jamais en dur, jamais committees
- **`.env.example`**: Documenter toutes les variables attendues sans valeurs sensibles
- **Headers de securite**: CSP, X-Frame-Options, X-Content-Type-Options via `next.config.js`
- **Pas de XSS**: Ne jamais injecter de HTML brut depuis les reponses IA sans sanitization
- **Error handling**: Messages d'erreur generiques cote client, logs detailles cote serveur
- **CORS**: Restreindre aux origines necessaires
- **Dependency audit**: `pnpm audit` dans la CI
