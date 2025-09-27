// Simple frontend client for the backend API
// Usage: include <script src="./api.js"></script> and call
// populateListings(selector) or populateTopListings(selector, limit)

function fetchJSON(url) {
  return fetch(url).then(r => {
    if (!r.ok) throw new Error('Network response was not ok');
    return r.json();
  });
}

function formatINR(n){
  try{ return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(Number(n)); }catch(e){ return '₹'+n }
}

function makeCard(item){
  const img = item.image || './images/house1.png';
  const title = item.title || (item.city? item.city + ' Property' : 'Property');
  const city = item.city || '';
  const beds = item.bedrooms || '';
  const area = item.area || '';
  const price = formatINR(item.price || 0);

  const wrapper = document.createElement('div');
  wrapper.className = 'product-card';
  wrapper.innerHTML = `
    <img src="${img}" alt="${title}" class="product-img">
    <div class="card-info">
      <div class="card-info-content">
        <img src="./images/location.svg" alt="">
        <p class="loaction-name">${city}</p>
      </div>
      <div class="card-info-content">
        <div class="content"><img src="./images/bed.svg" alt=""><p>${beds} Bed</p></div>
        <div class="content"><img src="./images/size.svg" alt=""><p>${area}</p></div>
        <div class="content"><img src="./images/area.svg" alt=""><p>${area}</p></div>
      </div>
      <div class="price">
        <p>${price}</p>
        <a href="./details.html?id=${item.id}" class="booking-btn">View</a>
      </div>
    </div>`;
  return wrapper;
}

function populateTopListings(containerSelector, limit=6){
  const container = document.querySelector(containerSelector);
  if (!container) return;
  fetchJSON('/api/properties/').then(data => {
    const results = (data.results || []).slice(0, limit);
    container.innerHTML = '';
    if (!results.length){ container.innerHTML = '<p>No properties found</p>'; return }
    results.forEach(item => container.appendChild(makeCard(item)));
  }).catch(err => {
    container.innerHTML = `<p class="error">Failed to load properties: ${err.message}</p>`;
  });
}

function populateListings(containerSelector){
  populateTopListings(containerSelector, 50);
}

function getQueryParam(name){
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function populateDetails(id){
  if (!id) return;
  fetchJSON(`/api/properties/${id}/`).then(data => {
    // Map API fields to elements we expect on details.html
    const imgEl = document.getElementById('detail-main-img');
    const titleEl = document.getElementById('detail-title');
    const locEl = document.getElementById('detail-location');
    const priceEl = document.getElementById('detail-price');
    const descEl = document.getElementById('detail-description');
    const bookingProperty = document.getElementById('detail-booking-property');
    const bookingTotal = document.getElementById('detail-booking-total');
    const payLink = document.getElementById('detail-pay-link');

    if (imgEl && data.image) imgEl.src = data.image;
    if (titleEl) titleEl.textContent = data.title || '';
    if (locEl) locEl.textContent = `${data.city || ''} • ${data.area || ''}`;
    if (priceEl) priceEl.textContent = formatINR(data.price || 0);
    if (descEl) descEl.textContent = data.description || '';
    if (bookingProperty) bookingProperty.textContent = data.title || '';
    if (bookingTotal) bookingTotal.textContent = formatINR(data.price || 0);
    if (payLink) payLink.href = `./payment.html?property_id=${data.id}`;
  }).catch(err => {
    console.error('Failed to load details', err);
    const c = document.getElementById('detail-error');
    if (c) c.textContent = 'Failed to load property details.';
  });
}

// Auto-run where appropriate
document.addEventListener('DOMContentLoaded', function(){
  if (document.querySelector('#product .container')){
    populateTopListings('#product .container', 6);
  }
  if (document.querySelector('#listings .container')){
    populateListings('#listings .container');
  }
  if (document.body.matches('body')){
    const id = getQueryParam('id');
    if (id && document.getElementById('detail-title')){
      populateDetails(id);
    }
  }
});
