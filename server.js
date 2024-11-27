const express = require("express");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = 3030;

// Configurando o Sequelize
const sequelize = new Sequelize("petshop", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

// Definindo o modelo para os clientes e animais
const Pet = sequelize.define(
  "Pet", // cria a tabela Pets
  {
    petName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    species: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    breed: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Sincronizando o banco
sequelize
  .sync()
  .then(() => {
    console.log("Banco sincronizado!");
  })
  .catch((err) => {
    console.error("Erro ao sincronizar o banco:", err);
  });

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rotas para os arquivos HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/dados", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dados.html"));
});

// Rota para exibir o formulário de cadastro
app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cadastro.html"));
});

// Rota para adicionar um pet
app.post("/cadastro", async (req, res) => {
  try {
    const { petName, species, breed, age, ownerName, contact } = req.body;
    const newPet = await Pet.create({
      petName,
      species,
      breed,
      age,
      ownerName,
      contact,
    });
    res
      .status(201)
      .json({ message: "Pet cadastrado com sucesso!", pet: newPet });
  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
    res.status(500).json({ message: "Erro ao cadastrar pet." });
  }
});

// Rota para buscar todos os pets
app.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets);
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).send("Erro ao buscar pets.");
  }
});

// Inicializando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
