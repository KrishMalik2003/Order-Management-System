const BASE_URL = 'http://localhost:3000';

const employees = {
  emp1: 'password1',
  emp2: 'password2'
};

let currentUser = null;

function login() {
  const id = document.getElementById('login-id').value;
  const password = document.getElementById('login-password').value;
  if (employees[id] && employees[id] === password) {
    currentUser = id;
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('order-section').style.display = 'block';
    fetchAllOrders();
  } else {
    alert('Invalid login credentials');
  }
}

async function placeOrder() {
  const customerName = document.getElementById('customer-name').value;
  const address = document.getElementById('customer-address').value;
  const itemsSelect = Array.from(document.getElementById('items').selectedOptions);
  const items = itemsSelect.map(option => {
    let quantity = prompt(`Enter quantity for ${option.value}:`, 1);
    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity <= 0) quantity = 1;
    return { name: option.value, quantity };
  });

  const order = {
    employeeId: currentUser,
    customerName,
    items,
    address,
    status: 'Placed'
  };

  try {
    const response = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    const result = await response.json();
    alert('Order placed successfully! ID: ' + result.id);
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-address').value = '';
    document.getElementById('items').selectedIndex = -1;
    fetchAllOrders();
  } catch (error) {
    alert('Failed to place order.');
  }
}

async function fetchAllOrders() {
  try {
    const res = await fetch(`${BASE_URL}/api/orders`);
    const orders = await res.json();
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';
    orders.forEach(order => {
      const div = document.createElement('div');
      div.className = 'order-card';
      div.innerHTML = `
        <p><strong>ID:</strong> ${order._id}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <button onclick="viewOrder('${order._id}')">View</button>
        <button onclick="updateStatus('${order._id}')">Update Status</button>
        <button onclick="cancelOrder('${order._id}')">Delete</button>
        <pre id="info-${order._id}"></pre>
      `;
      ordersList.appendChild(div);
    });
  } catch (error) {
    alert('Failed to fetch orders.');
  }
}

async function viewOrder(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/orders/${id}`);
    const order = await response.json();
    document.getElementById(`info-${id}`).innerText = JSON.stringify(order, null, 2);
  } catch (error) {
    alert('Order not found.');
  }
}

async function updateStatus(id) {
  const newStatus = prompt("Enter new status (e.g., Delivered, Cancelled):");
  if (!newStatus) return;

  try {
    await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    alert('Status updated');
    fetchAllOrders();
  } catch (error) {
    alert('Failed to update status.');
  }
}

async function cancelOrder(id) {
  if (!confirm('Are you sure you want to cancel this order?')) return;

  try {
    await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'DELETE'
    });
    alert('Order cancelled');
    fetchAllOrders();
  } catch (error) {
    alert('Failed to cancel order.');
  }
}
async function searchOrdersByItem() {
  const itemName = document.getElementById('search-item-name').value.trim();
  const resultsDiv = document.getElementById('search-results');
  resultsDiv.innerHTML = ''; 

  if (!itemName) {
    alert('Please enter an item name.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/orders/search/${encodeURIComponent(itemName)}`);
    const orders = await response.json();

    if (!orders.length) {
      resultsDiv.innerHTML = '<p>No orders found for this item.</p>';
      return;
    }

    orders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';

      const itemsList = order.items.map(item => 
        `<li>${item.name} (Qty: ${item.quantity})</li>`).join('');

      card.innerHTML = `
        <h3>Order ID: ${order._id}</h3>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Items:</strong></p>
        <ul>${itemsList}</ul>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (error) {
    console.error('Search failed:', error);
    alert('Error searching for orders.');
  }
}