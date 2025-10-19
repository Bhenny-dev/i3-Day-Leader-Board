addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxO2B5SOWfN5NPmpJMYpWzo1msJ-SxoTEH7Wwpf-3_eynqgPeGhSjCXNgmWlzc-ceU/exec'

  let url = APPS_SCRIPT_URL;
  if (request.method === 'GET') {
    const reqUrl = new URL(request.url);
    const q = reqUrl.searchParams.toString();
    if (q) url += '?' + q;
  }

  const options = {
    method: request.method,
    headers: { 'Content-Type': 'application/json' },
    body: request.method === 'POST' ? await request.text() : undefined
  };

  const resp = await fetch(url, options);
  const text = await resp.text();

  return new Response(text, {
    status: resp.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
