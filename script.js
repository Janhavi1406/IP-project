// Load or init customers from localStorage
let customers = JSON.parse(localStorage.getItem('customers') || '[]');

const customerBody = document.getElementById('customerBody');
const searchInput = document.getElementById('searchInput');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const dialog = document.getElementById('customerDialog');
const form = document.getElementById('customerForm');
const cancelBtn = document.getElementById('cancelBtn');
const dialogTitle = document.getElementById('dialogTitle');
const customerIdInput = document.getElementById('customerId');

// Save customers to localStorage
function saveToStorage() {
  localStorage.setItem('customers', JSON.stringify(customers));
}

// Render customers
function renderCustomers(list) {
  customerBody.innerHTML = '';
  if (list.length === 0) {
    customerBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#666;">No customers found</td></tr>';
    return;
  }
  list.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.phone || ''}</td>
      <td>${c.company || ''}</td>
      <td>${c.notes || ''}</td>
      <td>
        <button data-id="${c.id}" class="editBtn">Edit</button>
        <button data-id="${c.id}" class="deleteBtn">Delete</button>
      </td>
    `;
    customerBody.appendChild(tr);
  });

  // Attach edit handlers
  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.onclick = () => editCustomer(btn.getAttribute('data-id'));
  });

  // Attach delete handlers
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.onclick = () => deleteCustomer(btn.getAttribute('data-id'));
  });
}

// Search filter
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q) ||
    (c.company || '').toLowerCase().includes(q) ||
    (c.phone || '').toLowerCase().includes(q)
  );
  renderCustomers(filtered);
});

// Open Add modal
addCustomerBtn.onclick = () => {
  dialogTitle.textContent = 'Add New Customer';
  form.reset();
  customerIdInput.value = '';
  dialog.classList.remove('hidden');
};

// Cancel button closes modal
cancelBtn.onclick = () => {
  dialog.classList.add('hidden');
};

// Save form handler
form.onsubmit = e => {
  e.preventDefault();

  const newCustomer = {
    id: customerIdInput.value || Date.now().toString(),
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    company: form.company.value.trim(),
    notes: form.notes.value.trim()
  };

  if (customerIdInput.value) {
    // Update existing
    const idx = customers.findIndex(c => c.id === newCustomer.id);
    if (idx >= 0) {
      customers[idx] = newCustomer;
    }
  } else {
    // Add new customer at the top
    customers.unshift(newCustomer);
  }

  saveToStorage();
  renderCustomers(customers);
  dialog.classList.add('hidden');
};

// Edit customer
function editCustomer(id) {
  const c = customers.find(cust => cust.id === id);
  if (!c) return;

  dialogTitle.textContent = 'Edit Customer';
  customerIdInput.value = c.id;
  form.name.value = c.name;
  form.email.value = c.email;
  form.phone.value = c.phone;
  form.company.value = c.company;
  form.notes.value = c.notes;

  dialog.classList.remove('hidden');
}

// Delete customer
function deleteCustomer(id) {
  if (confirm('Are you sure you want to delete this customer?')) {
    customers = customers.filter(c => c.id !== id);
    saveToStorage();
    renderCustomers(customers);
  }
}

// Initial render
renderCustomers(customers);
