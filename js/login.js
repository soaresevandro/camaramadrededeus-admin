import { getSession, saveSession } from "./config.js";

const form = document.getElementById("login-form");
const errorBox = document.getElementById("login-error");

const session = getSession();
if (session?.apiUrl && session?.apiKey) {
  window.location.href = "painel.html";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.textContent = "";

  const apiUrl = document.getElementById("api-url").value.trim().replace(/\/$/, "");
  const apiKey = document.getElementById("api-key").value.trim();

  try {
    const response = await fetch(`${apiUrl}/api/auth/verify`, {
      headers: { "x-api-key": apiKey },
    });

    if (!response.ok) {
      throw new Error("Credenciais inválidas ou API indisponível.");
    }

    saveSession(apiUrl, apiKey);
    window.location.href = "painel.html";
  } catch (error) {
    errorBox.textContent = error.message;
  }
});
