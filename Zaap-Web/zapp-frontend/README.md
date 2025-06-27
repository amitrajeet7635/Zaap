<<<<<<< HEAD
<div align="center">
  <h3><strong>Zaap</strong></h3>
  No cash. No cards. Just Zapp. Built on Web3. Crafted for your tomorrow.
</div>

<br/>

<p align="center">
  
  <img src="https://img.shields.io/github/last-commit/amanna13/zaap?label=Last%20Commit&logo=git" alt="Last Commit" />
  <img src="https://img.shields.io/badge/Hackathon-purple" alt="Hackathon" />
  <img src="https://img.shields.io/badge/status-In%20Development-orange" alt="Status" />
  <img src="https://img.shields.io/badge/version-0.1.0-blue" alt="Version" />
  <img src="https://img.shields.io/badge/stability-Prototype-lightgrey" alt="Stability" />
  <br/>
  <img src = "https://img.shields.io/badge/Android-green?logo=android&logoColor=white" />
  <img src="https://img.shields.io/badge/-Blockchain-121212?logo=blockchaindotcom&logoColor=white" alt="Blockchain" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" alt="Animated Line" width="90%" />
</p>

<table align="left">
  <tr>
    <td><img src="https://github.com/Anmol-Baranwal/Cool-GIFs-For-GitHub/assets/74038190/7bb1e704-6026-48f9-8435-2f4d40101348" width="50"></td>
    <td><h4>Built by the Zapp Squad</h4></td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <table>
        <tr>
          <td align="center">
            <a href="https://github.com/amanna13">
              <img src="https://github.com/amanna13.png" width="80" height="80"><br>
              <sub><b>@amanna13</b></sub>
            </a>
          </td>
          <td align="center">
            <a href="https://github.com/amitrajeet7635">
              <img src="https://github.com/amitrajeet7635.png" width="80" height="80"><br>
              <sub><b>@amitrajeet7635</b></sub>
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>



=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
>>>>>>> 2a80aa6 (parental dashboard added)
