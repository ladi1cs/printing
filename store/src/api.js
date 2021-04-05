export async function getOrder() {
    const response = await fetch('/api/order');
    return await response.json();
}

export async function updateOrder(data) {
    const response = await fetch(`/api/order`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({order: data})
      })
    return await response.json();
}

export async function getRates(base='CAD') {
    const response = await fetch(`https://api.ratesapi.io/api/latest?base=${base}`);
    return await response.json();
}