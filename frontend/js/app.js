document.addEventListener("DOMContentLoaded", () => {
    const recipeList = document.getElementById("recipe-list");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const externalRecipesContainer = document.getElementById("external-recipes");
    const userInfo = document.getElementById("user-info");
    const userNameSpan = document.getElementById("user-name");
    const loginLink = document.getElementById("login-nav");
    const logoutBtn = document.getElementById("logout-btn");

    // Verifica se há um token no localStorage
    const token = localStorage.getItem("token");
    if (token) {
        fetch("http://localhost:3000/users/me", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            if (data.nome) {
                userNameSpan.textContent = data.nome;
                userInfo.style.display = "block";
                loginLink.style.display = "none";
            }
        })
        .catch(error => {
            console.error("Erro ao buscar usuário:", error);
            localStorage.removeItem("token");
        });
    }

    // Logout do usuário
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });

    document.addEventListener("DOMContentLoaded", () => {
        const loginNav = document.getElementById("login-nav");
        const userInfo = document.getElementById("user-info");
        const userNameSpan = document.getElementById("user-name");
        const logoutBtn = document.getElementById("logout-btn");
    
        // Verifica se o usuário está logado
        const token = localStorage.getItem("token");
        const userName = localStorage.getItem("userName");
    
        if (token && userName) {
            loginNav.style.display = "none";  // Esconde o botão de login
            userInfo.classList.remove("hidden"); // Mostra o nome e o botão de logout
            userNameSpan.textContent = userName; // Exibe o nome do usuário
        } else {
            loginNav.style.display = "block"; // Garante que o botão de login apareça se o usuário não estiver logado
            userInfo.classList.add("hidden"); // Esconde o user-info quando não há usuário logado
        }

    
        // Logout
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            window.location.href = "login.html"; // Redireciona para a página de login
        });

        const recipeList = document.getElementById("recipe-list");

    async function toggleFavorite(recipeId) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para favoritar receitas!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/recipes/favoritar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ recipe_id: recipeId }),
            });

            const data = await response.json();
            alert(data.message); // Exibir mensagem de sucesso ou erro
        } catch (error) {
            console.error("Erro ao favoritar receita:", error);
        }
    }

    function displayRecipes(recipes) {
        recipeList.innerHTML = "";
        if (recipes.length === 0) {
            recipeList.innerHTML = "<p>Nenhuma receita encontrada.</p>";
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            recipeCard.innerHTML = `
                <h3>${recipe.nome}</h3>
                <p><strong>Categoria:</strong> ${recipe.categoria}</p>
                <p><strong>Origem:</strong> ${recipe.area}</p>
                <p><strong>Instruções:</strong> ${recipe.instrucoes}</p>
                <img src="${recipe.imagem}" alt="${recipe.nome}" style="width: 200px; border-radius: 5px;">
                <h4>Ingredientes:</h4>
                <ul>${recipe.ingredientes.map(ing => `<li>${ing}</li>`).join('')}</ul>
                <button class="favorite-btn" data-recipe-id="${recipe.id}">⭐ Favoritar</button>
            `;
            recipeList.appendChild(recipeCard);
        });

        // Adiciona evento para os botões de favoritar
        document.querySelectorAll(".favorite-btn").forEach(button => {
            button.addEventListener("click", () => {
                const recipeId = button.getAttribute("data-id");
                toggleFavorite(recipeId);
            });
        });
    }
    });
    
    window.redirectToCategory = function(categoryId) {
        console.log("Redirecionando para categoria:", categoryId);
        window.location.href = `receitas.html?categoria=${categoryId}`;
    };
    
    // Função para buscar receitas na API interna
    async function fetchRecipes(searchQuery = "") {
        try {
            let url = "http://localhost:3000/recipes";
            if (searchQuery) {
                url = `http://localhost:3000/recipes/search?nome=${searchQuery}`;
            }
            
            const response = await fetch(url, {
                headers: { "Content-Type": "application/json" }
            });
            
            if (!response.ok) {
                throw new Error("Erro ao buscar receitas");
            }
            
            const recipes = await response.json();
            displayRecipes(recipes);
        } catch (error) {
            console.error("Erro ao obter receitas:", error);
        }
    }
    //buscar receitas da BD
    async function fetchRecipesByCategory(categoryId) {
        try {
            const response = await fetch(`http://localhost:3000/recipes/categoria/${categoryId}`);
            const data = await response.json();
    
            if (data.message) {
                document.getElementById("recipe-list").innerHTML = `<p>${data.message}</p>`;
                return;
            }
    
            displayRecipes(data);
        } catch (error) {
            console.error("Erro ao buscar receitas:", error);
        }
    }
    
    // Exibir receitas na página
    function displayRecipes(recipes) {
        const recipeContainer = document.getElementById("recipe-list");
        recipeContainer.innerHTML = "";
    
        recipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            recipeCard.innerHTML = `
                <h3>${recipe.nome}</h3>
                <p><strong>Dificuldade:</strong> ${recipe.dificuldade}</p>
                <p><strong>Tempo:</strong> ${recipe.tempo} min</p>
                <p><strong>Custo:</strong> €${recipe.custo.toFixed(2)}</p>
            `;
            recipeContainer.appendChild(recipeCard);
        });
    }
    
    // Capturar ID da categoria na URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("categoria");
    
    // Se houver categoria na URL, buscar receitas
    if (categoryId) {
        fetchRecipesByCategory(categoryId);
    }

    // Função para exibir receitas na página
    function displayRecipes(recipes) {
        recipeList.innerHTML = "";
        if (recipes.length === 0) {
            recipeList.innerHTML = "<p>Nenhuma receita encontrada.</p>";
            return;
        }
        
        recipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            recipeCard.innerHTML = `
                <h3>${recipe.nome}</h3>
                <p><strong>Categoria:</strong> ${recipe.categoria_id}</p>
                <p><strong>Dificuldade:</strong> ${recipe.dificuldade}</p>
                <p><strong>Tempo:</strong> ${recipe.tempo} min</p>
                <p><strong>Custo:</strong> €${recipe.custo.toFixed(2)}</p>
            `;
            recipeList.appendChild(recipeCard);
        });
    }

    // Evento de pesquisa
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const query = searchInput.value.trim();
            fetchRecipes(query);
        });
    }

    // Buscar todas as receitas ao carregar a página
    fetchRecipes();

    // Buscar receitas externas da API externa
    if (searchBtn) {
        searchBtn.addEventListener("click", async () => {
            const nomeReceita = searchInput.value.trim();
            if (!nomeReceita) {
                alert("Por favor, digite o nome de uma receita.");
                return;
            }
            
            try {
                const response = await fetch(`http://localhost:3000/recipes/external?nome=${nomeReceita}`);
                const data = await response.json();
                
                externalRecipesContainer.innerHTML = "";
                if (data.length === 0) {
                    externalRecipesContainer.innerHTML = "<p>Nenhuma receita encontrada.</p>";
                    return;
                }
                
                data.forEach(recipe => {
                    const recipeCard = document.createElement("div");
                    recipeCard.classList.add("recipe-card");
                    recipeCard.innerHTML = `
                        <h3>${recipe.nome}</h3>
                        <p><strong>Categoria:</strong> ${recipe.categoria}</p>
                        <p><strong>Origem:</strong> ${recipe.area}</p>
                        <p><strong>Instruções:</strong> ${recipe.instrucoes}</p>
                        <img src="${recipe.imagem}" alt="${recipe.nome}" style="width: 200px; border-radius: 5px;">
                        <h4>Ingredientes:</h4>
                        <ul>${recipe.ingredientes.map(ing => `<li>${ing}</li>`).join('')}</ul>
                    `;
                    externalRecipesContainer.appendChild(recipeCard);
                });
            } catch (error) {
                console.error("Erro ao buscar receitas externas:", error);
                externalRecipesContainer.innerHTML = "<p>Erro ao buscar receitas. Tente novamente.</p>";
            }
        });
    }
});
