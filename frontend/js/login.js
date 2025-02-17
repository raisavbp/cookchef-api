document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginMessage = document.getElementById("login-message");
    const googleLoginBtn = document.getElementById("google-login-btn"); // Botão de login com Google

    if (!loginForm) {
        console.error("Erro: Formulário de login não encontrado!");
        return;
    }

    // 🔹 Login Manual
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita o recarregamento da página

        const emailInput = document.getElementById("email");
        const senhaInput = document.getElementById("senha");

        if (!emailInput || !senhaInput) {
            console.error("Erro: Campos do formulário não encontrados!");
            return;
        }

        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!email || !senha) {
            loginMessage.textContent = "Preencha todos os campos!";
            loginMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                loginMessage.style.color = "green";
                loginMessage.textContent = "Login bem-sucedido!";
                localStorage.setItem("token", data.token); // Salva o token no localStorage
                localStorage.setItem("userName", data.nome); // Salva o nome do usuário

                // Redireciona para a página principal após 2 segundos
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            } else {
                loginMessage.style.color = "red";
                loginMessage.textContent = data.message || "Erro ao fazer login!";
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            loginMessage.textContent = "Erro ao conectar-se ao servidor!";
            loginMessage.style.color = "red";
        }
    });

    // 🔹 Login com Google
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", () => {
            // Redireciona para o backend que inicia a autenticação com Google
            window.location.href = "http://localhost:3000/auth/google";
        });
    }
});