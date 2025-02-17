document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const registerMessage = document.getElementById("register-message");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (!nome || !email || !senha) {
            registerMessage.textContent = "Preencha todos os campos!";
            registerMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome, email, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                registerMessage.style.color = "green";
                registerMessage.textContent = "Cadastro realizado com sucesso! Redirecionando...";
                
                // Redireciona para a página de login após 2 segundos
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                registerMessage.style.color = "red";
                registerMessage.textContent = data.message || "Erro ao cadastrar!";
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            registerMessage.textContent = "Erro ao conectar-se ao servidor!";
        }
    });
});
