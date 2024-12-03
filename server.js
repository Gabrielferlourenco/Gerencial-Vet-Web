const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
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

const Appointment = sequelize.define(
  "Appointment", // Cria a tabela Appointments
  {
    petId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
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

// Rota para os arquivos HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota par exibir a tabela com os dados
app.get("/dados", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dados.html"));
});

// Rota para exibir o formulário de cadastro
app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cadastro.html"));
});

// Rota para exibir a página de agendamentos
app.get("/agendamento", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "agendamento.html"));
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

// Rota para adicionar um agendamento
app.post("/agendar", async (req, res) => {
  try {
    const { petId, date, time } = req.body;

    // Validação básica
    if (!petId || !date || !time) {
      return res
        .status(400)
        .json({ message: "Dados incompletos para agendamento." });
    }

    // Verificar se o horário já está ocupado
    const existingAppointment = await Appointment.findOne({
      where: { date, time },
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "Horário indisponível. Escolha outro." });
    }

    // Criar o agendamento
    const newAppointment = await Appointment.create({ petId, date, time });

    res.status(201).json({
      message: "Agendamento realizado com sucesso!",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Erro ao agendar consulta:", error);
    res.status(500).json({ message: "Erro ao agendar consulta." });
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

//Verificação do dono
app.post("/buscarPetsPorDono", async (req, res) => {
  const { ownerName } = req.body;
  console.log("Nome do Dono Recebido:", ownerName); // Verifique o valor recebido

  try {
    const pets = await Pet.findAll({
      where: { ownerName },
    });

    if (pets.length > 0) {
      res.json(pets); // Envia os pets encontrados
    } else {
      res.status(404).send("Nenhum pet encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).send("Erro ao buscar pets.");
  }
});

// Inicializando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
