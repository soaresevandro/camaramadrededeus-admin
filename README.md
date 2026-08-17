# Admin — Câmara Madre de Deus

Painel separado para cadastrar, editar e excluir notícias do site.

## Pré-requisitos

1. Backend do site rodando em `http://localhost:3000`
2. Variável `API_KEY` configurada no backend

```powershell
cd ..\camaramadrededeus\backend
$env:API_KEY="sua-chave-secreta"
npm install
npm start
```

## Executar o admin

```powershell
cd camaramadrededeus-admin
npm start
```

Acesse `http://localhost:5173`.

## Login

- **URL da API:** `http://localhost:3000`
- **Chave da API:** mesma valor definido em `API_KEY`

## Funcionalidades

- Listar notícias
- Criar notícia com upload de imagem
- Editar notícia existente
- Excluir notícia

As imagens enviadas ficam na pasta raiz do projeto principal e são servidas automaticamente pelo backend.


git add .
git commit -m "Primeiro commit"
git push

git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/soaresevandro/soaresevandro-api.git
git push -u origin main

…or push an existing repository from the command line
git remote add origin https://github.com/soaresevandro/soaresevandro/soaresevandro-api
git branch -M main
git push -u origin main
