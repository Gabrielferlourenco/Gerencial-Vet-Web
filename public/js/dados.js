document.getElementById("login").addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "1234") {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("tabelaPets").style.display = "block";

    try {
      const response = await fetch("/pets");
      const pets = await response.json();

      const tbody = document.getElementById("petsTableBody");
      pets.forEach((pet) => {
        const row = document.createElement("tr");
        row.innerHTML = `
              <td>${pet.id}</td>
              <td>${pet.petName}</td>
              <td>${pet.species}</td>
              <td>${pet.breed}</td>
              <td>${pet.age}</td>
              <td>${pet.ownerName}</td>
              <td>${pet.contact}</td>
            `;
        tbody.appendChild(row);
      });
    } catch (error) {
      alert("Erro ao carregar dados dos pets.");
    }
  } else {
    alert("Usuário ou senha incorretos.");
  }
});
