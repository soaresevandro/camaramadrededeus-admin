import {
  createNoticia,
  deleteNoticia,
  listNoticias,
  updateNoticia,
  uploadImagem,
} from "./api.js";
import { clearSession, requireSession } from "./config.js";

const session = requireSession();
if (!session) throw new Error("Sessão inválida.");

const { apiUrl, apiKey } = session;

const tableBody = document.getElementById("noticias-body");
const form = document.getElementById("noticia-form");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const feedback = document.getElementById("feedback");
const imagemInput = document.getElementById("imagem-arquivo");
const imagemPreview = document.getElementById("imagem-preview");
const imagemHidden = document.getElementById("imagem");

let noticias = [];
let editandoId = null;
let imagemArquivo = null;

function escapeHtml(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showFeedback(message, type = "success") {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
  feedback.hidden = false;

  setTimeout(() => {
    feedback.hidden = true;
  }, 4000);
}

function openModal(noticia = null) {
  editandoId = noticia?.id ?? null;
  imagemArquivo = null;
  modalTitle.textContent = noticia ? "Editar mensagem" : "Nova mensagem";

  form.titulo.value = noticia?.titulo ?? "";
  form.conteudo.value = noticia?.conteudo ?? "";
  form.publicar.checked = !!noticia?.publicar;
  imagemHidden.value = noticia?.imagem ?? "";
  imagemInput.value = "";

  if (noticia?.imagem) {
    imagemPreview.src = `${apiUrl}/uploads/${noticia.imagem}`;
    imagemPreview.hidden = false;
  } else {
    imagemPreview.hidden = true;
  }

  modal.hidden = false;
  modal.classList.add("is-open");
}


function closeModal() {
  modal.classList.remove("is-open");
  editandoId = null;
  form.reset();
  imagemPreview.hidden = true;
}

function renderTable() {
  if (!noticias.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty">Nenhuma mensagem cadastrada.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = noticias
    .filter((noticia) => noticia.tipo === "M") // filtra apenas tipo Mensagem
    .map(
      (noticia) => `
      <tr>
        <td><img src="${escapeHtml(apiUrl)}/uploads/${escapeHtml(noticia.imagem)}" alt="" class="thumb"></td>
        <td>${escapeHtml(noticia.titulo)}</td>
        <td>${escapeHtml(noticia.conteudo)}</td>
        <td class="descricao-cell">
          ${noticia.publicar ? "SIM" : "NÃO"}
        </td>
        <td class="actions">
          <button type="button" class="btn btn-secondary" data-edit="${escapeHtml(noticia.id)}">Editar</button>
          <button type="button" class="btn btn-danger" data-delete="${escapeHtml(noticia.id)}">Excluir</button>
        </td>
      </tr>
    `
    )
    .join("");
}

async function loadNoticias() {
  const data = await listNoticias(apiUrl);
  noticias = data.noticias;
  renderTable();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new Date().toLocaleDateString("pt-BR");
  const payload = {
    tipo: "M",
    data,
    publicar: form.publicar.checked,
    titulo: form.titulo.value.trim(),
    resumo: "resumo",
    conteudo: form.conteudo.value.trim(),
    detalhamento: "detalhamento",
    imagem: imagemHidden.value.trim(),
  };
  console.log('payload: ', payload);

  try {
    if (imagemArquivo) {
      const upload = await uploadImagem(apiUrl, apiKey, imagemArquivo);
      payload.imagem = upload.imagem;
    }

    if (!payload.imagem) {
      throw new Error("Selecione uma imagem para a notícia.");
    }

    if (editandoId) {
      await updateNoticia(apiUrl, apiKey, editandoId, payload);
      showFeedback("Notícia atualizada com sucesso.");
    } else {
      await createNoticia(apiUrl, apiKey, payload);
      showFeedback("Notícia criada com sucesso.");
    }

    closeModal();
    await loadNoticias();
  } catch (error) {
    showFeedback(error.message, "error");
  }
});

imagemInput.addEventListener("change", () => {
  const [file] = imagemInput.files;
  imagemArquivo = file ?? null;

  if (!file) {
    imagemPreview.hidden = true;
    return;
  }

  imagemPreview.src = URL.createObjectURL(file);
  imagemPreview.hidden = false;
});

tableBody.addEventListener("click", async (event) => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;

  if (editId) {
    const noticia = noticias.find((item) => item.id === Number(editId));
    openModal(noticia);
    return;
  }

  if (deleteId) {
    const noticia = noticias.find((item) => item.id === Number(deleteId));
    const confirmar = window.confirm(`Excluir a mensagem "${noticia.titulo}"?`);

    if (!confirmar) return;

    try {
      await deleteNoticia(apiUrl, apiKey, deleteId);
      showFeedback("Notícia excluída.");
      await loadNoticias();
    } catch (error) {
      showFeedback(error.message, "error");
    }
  }
});

document.getElementById("btn-nova").addEventListener("click", () => openModal());
document.getElementById("btn-fechar-modal").addEventListener("click", closeModal);
document.getElementById("btn-cancelar").addEventListener("click", closeModal);

document.getElementById("btn-sair").addEventListener("click", () => {
  clearSession();
  window.location.href = "index.html";
});

loadNoticias().catch((error) => {
  showFeedback(error.message, "error");
});
