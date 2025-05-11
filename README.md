# BCB Chat

Este é o repositório do **BCB Chat**, uma aplicação de chat com frontend em React (Vite) e backend utilizando o `json-server`. Este guia explica como configurar e executar o projeto localmente utilizando Docker.

---

## **Pré-requisitos**

Certifique-se de ter as seguintes ferramentas instaladas no seu sistema:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## **Clonando o Repositório**

```bash
git clone git@github.com:JPedroValarini/bcb-chat.git
cd bcb-chat
```

---

## **Configuração do Projeto**

O arquivo `db.json` deve conter os dados iniciais. Exemplo:

```json
{
  "clients": [
    {
      "id": "client123",
      "name": "Empresa ABC Ltda",
      "documentId": "12345678000199",
      "documentType": "CNPJ",
      "planType": "prepaid",
      "balance": 99.5,
      "limit": 0,
      "active": true
    }
  ]
}
```

---

## **Executando o Projeto**

**Iniciar containers:**

```bash
docker-compose up --build
```

**Acessar:**

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3001](http://localhost:3001)

---

## **Estrutura do Projeto**

```
bcb-chat/
├── db.json                # Dados do json-server
├── docker-compose.yml     # Configuração Docker
├── Dockerfile             # Frontend
├── package.json           # Dependências
├── src/                   # Código-fonte
└── ...
```

---

## **Comandos Úteis**

**Parar containers:**

```bash
docker-compose down
```

**Reconstruir containers:**

```bash
docker-compose up --build
```

---

## **Contato**

**Autor:** João Pedro Valarini  
**GitHub:** [JPedroValarini](https://github.com/JPedroValarini)
