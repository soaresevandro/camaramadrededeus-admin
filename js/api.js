async function request(apiUrl, apiKey, path, options = {}) {
  const headers = { ...(options.headers || {}) };

  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.erro || "Erro na requisição.");
  }

  return data;
}

export function listNoticias(apiUrl) {
  return request(apiUrl, null, "/api/noticias");
}

export function createNoticia(apiUrl, apiKey, payload) {
  return request(apiUrl, apiKey, "/api/noticias", {
    method: "POST",
    body: payload,
  });
}

export function updateNoticia(apiUrl, apiKey, id, payload) {
  return request(apiUrl, apiKey, `/api/noticias/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteNoticia(apiUrl, apiKey, id) {
  return request(apiUrl, apiKey, `/api/noticias/${id}`, {
    method: "DELETE",
  });
}

export function uploadImagem(apiUrl, apiKey, file) {
  const formData = new FormData();
  formData.append("imagem", file);

  return request(apiUrl, apiKey, "/api/upload", {
    method: "POST",
    body: formData,
  });
}
