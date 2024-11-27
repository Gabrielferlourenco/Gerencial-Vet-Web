document.getElementById("petForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const petData = {
    petName: document.getElementById("petName").value,
    species: document.getElementById("species").value,
    breed: document.getElementById("breed").value,
    age: document.getElementById("age").value,
    ownerName: document.getElementById("ownerName").value,
    contact: document.getElementById("contact").value,
  };

  try {
    // Envia os dados para o backend
    const response = await fetch("/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData),
    });

    if (response.ok) {
      alert("Cadastro realizado com sucesso!");
      document.getElementById("petForm").reset();
    } else {
      alert("Erro ao cadastrar o pet.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar com o servidor.");
  }
});
