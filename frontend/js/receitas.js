document.addEventListener("DOMContentLoaded", async () => {
    // Obtém o parâmetro 'categoria' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaId = urlParams.get("categoria");

    if (!categoriaId) {
        alert("Nenhuma categoria selecionada!");
        return;
    }

    // Atualiza o título da página com o nome da categoria
    const tituloCategoria = {
        1: "Sobremesas",
        2: "Massas",
        3: "Carnes",
        4: "Saladas",
        5: "Frango",
        6: "Peixe",
        7: "Bebidas"
    };

    document.getElementById("categoria-titulo").textContent = `Receitas de ${tituloCategoria[categoriaId] || "Categoria"}`;

    try {
        // Faz a requisição para buscar as receitas da categoria
        const response = await fetch(`http://localhost:3000/recipes/categoria/${categoriaId}`);
        const receitas = await response.json();

        const recipeList = document.getElementById("recipe-list");
        recipeList.innerHTML = "";

        if (receitas.length === 0) {
            recipeList.innerHTML = "<p>Nenhuma receita encontrada nesta categoria.</p>";
            return;
        }

        // Exibe as receitas em cards estilizados
        receitas.forEach(receita => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            // ✅ Converte o custo para número e formata corretamente
            const custo = parseFloat(receita.custo);
            const custoFormatado = isNaN(custo) ? "N/A" : `€${custo.toFixed(2)}`;

            // Usa uma imagem padrão caso a receita não tenha uma imagem cadastrada
            const imagem = receita.imagem ? receita.imagem : "images/placeholder.jpg"; // Ajuste o caminho se necessário

            // Criação do HTML dentro do card
            recipeCard.innerHTML = `
                <img src="${imagem}" alt="Imagem de ${receita.nome}" class="recipe-image">
                <h3>${receita.nome}</h3>
                <p><strong>Dificuldade:</strong> ${receita.dificuldade}</p>
                <p><strong>Tempo:</strong> ${receita.tempo} min</p>
                <p><strong>Custo:</strong> ${custoFormatado}</p>
                <p>${receita.descricao}</p>
            `;

            recipeList.appendChild(recipeCard);
        });

    } catch (error) {
        console.error("Erro ao buscar receitas:", error);
        document.getElementById("recipe-list").innerHTML = "<p>Erro ao carregar as receitas.</p>";
    }
});
