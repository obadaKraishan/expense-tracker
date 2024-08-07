document.addEventListener('DOMContentLoaded', () => {
    fetchExpenses();
  
    document.getElementById('expenseForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const description = document.getElementById('expenseDescription').value;
      const amount = parseFloat(document.getElementById('expenseAmount').value);
      const category = document.getElementById('expenseCategory').value;
  
      addExpense({ description, amount, category });
  
      document.getElementById('expenseDescription').value = '';
      document.getElementById('expenseAmount').value = '';
      document.getElementById('expenseCategory').value = '';
    });
  
    document.getElementById('filterCategory').addEventListener('change', function(event) {
      const category = event.target.value;
      filterExpenses(category);
    });
  });
  
  function fetchExpenses() {
    fetch('/expenses')
      .then(response => response.json())
      .then(data => {
        displayExpenses(data);
        calculateTotal(data);
        calculateCategoryStatistics(data);
      });
  }
  
  function addExpense(expense) {
    fetch('/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expense)
    })
    .then(response => response.json())
    .then(data => {
      displayExpenses(data.expenses);
      calculateTotal(data.expenses);
      calculateCategoryStatistics(data.expenses);
    });
  }
  
  function editExpense(index, updatedExpense) {
    fetch(`/expenses/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedExpense)
    })
    .then(response => response.json())
    .then(data => {
      displayExpenses(data.expenses);
      calculateTotal(data.expenses);
      calculateCategoryStatistics(data.expenses);
    });
  }
  
  function deleteExpense(index) {
    fetch(`/expenses/${index}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      displayExpenses(data.expenses);
      calculateTotal(data.expenses);
      calculateCategoryStatistics(data.expenses);
    });
  }
  
  function displayExpenses(expenses) {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>${expense.description} - $${expense.amount.toFixed(2)} (${expense.category})</span>
        <div>
          <button class="btn btn-warning btn-sm mr-2" onclick="editExpensePrompt(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">Delete</button>
        </div>
      `;
      expenseList.appendChild(li);
    });
  }
  
  function editExpensePrompt(index) {
    const description = prompt('Edit description:');
    const amount = parseFloat(prompt('Edit amount:'));
    const category = prompt('Edit category (Food, Transport, Entertainment, Other):');
    if (description && !isNaN(amount) && category) {
      editExpense(index, { description, amount, category });
    }
  }
  
  function filterExpenses(category) {
    fetch('/expenses')
      .then(response => response.json())
      .then(data => {
        let filteredExpenses = data;
        if (category) {
          filteredExpenses = data.filter(expense => expense.category === category);
        }
        displayExpenses(filteredExpenses);
        calculateTotal(filteredExpenses);
        calculateCategoryStatistics(filteredExpenses);
      });
  }
  
  function calculateTotal(expenses) {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpenses = document.getElementById('totalExpenses');
    totalExpenses.innerHTML = `<h4>Total Expenses: $${total.toFixed(2)}</h4>`;
  }
  
  function calculateCategoryStatistics(expenses) {
    const categories = ['Food', 'Transport', 'Entertainment', 'Other'];
    const statistics = categories.map(category => {
      const total = expenses.filter(expense => expense.category === category)
                            .reduce((sum, expense) => sum + expense.amount, 0);
      return { category, total };
    });
  
    const categoryStatistics = document.getElementById('categoryStatistics');
    categoryStatistics.innerHTML = statistics.map(stat => `<p>${stat.category}: $${stat.total.toFixed(2)}</p>`).join('');
  }
  