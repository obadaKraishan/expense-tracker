const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let expenses = [];

app.get('/expenses', (req, res) => {
  res.json(expenses);
});

app.post('/expenses', (req, res) => {
  const expense = req.body;
  expenses.push(expense);
  res.json({ message: 'Expense added', expenses });
});

app.put('/expenses/:index', (req, res) => {
  const index = req.params.index;
  const updatedExpense = req.body;
  if (index >= 0 && index < expenses.length) {
    expenses[index] = updatedExpense;
    res.json({ message: 'Expense updated', expenses });
  } else {
    res.status(400).json({ message: 'Invalid index' });
  }
});

app.delete('/expenses/:index', (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < expenses.length) {
    expenses.splice(index, 1);
    res.json({ message: 'Expense removed', expenses });
  } else {
    res.status(400).json({ message: 'Invalid index' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
