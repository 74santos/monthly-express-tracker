document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const amountInput = document.getElementById('amount');
    const expenseChart = document.getElementById('expense-chart');


    let selectedMonth;
    let selectYear;
    let myChart;

//Generate year options dynamically
for (let year = 2020; year <= 2040; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
    
}


//Initialize expenses object with categories
const expenses = {
    January: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    February: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    March: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    April: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    May: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    June: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    July: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    August: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    September: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    October: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    November: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
    December: {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0},
}



// load expenses
function getExpensesFromLocalStorage(month,year) {
    const key = `${month}-${year}`;
    return JSON.parse(localStorage.getItem(key)) || {};
}


// saved expenses
function saveExpensesFromLocalStorage(month,year) {
    const key = `${month}-${year}`;
    localStorage.setItem(key, JSON.stringify(expenses[month]));
}

// Get Selected Month & year
function getSelectedMonthYear() {
     selectedMonth = monthSelect.value;
     selectYear = yearSelect.value;

    if (!selectedMonth || !selectYear) {
        alert('Month or year is not selected');
        return;
    }

    if (!expenses[selectedMonth]) {
        expenses[selectedMonth] = {Housing: 0, Food: 0 , Transportation: 0, Bills: 0, Miscellaneous: 0};
    }
}

// update Chart   https://www.chartjs.org/docs/latest/getting-started/

function updateChart() {
    getSelectedMonthYear();

    const expenseData = getExpensesFromLocalStorage(selectedMonth, selectYear);
    Object.assign(expenses[selectedMonth], expenseData);


    const ctx = expenseChart.getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(expenses[selectedMonth]),
          datasets: [{
            data: Object.values(expenses[selectedMonth]),
            backgroundColor: [
                '#FF6384', // Housing
                '#4CAF50', // Food
                '#FFCE56', // Transportation
                '#35A2EB', // Bills
                '#FF9F40', // Miscellaneus
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
              legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: $${tooltipItem.raw}`;
                        }
                    }
                }
          }
        }
      });
}

// handle Form submission
function handleSubmit(event) {
    event.preventDefault();  //prevents page from reloading
    getSelectedMonthYear();
   
    const category = event.target.category.value;
    const amount = parseFloat(event.target.amount.value);
    const currentAmount = expenses[selectedMonth][category] || 0;

    if (amount > 0) {
        expenses[selectedMonth][category] = currentAmount + amount; // adds amount
    } else if (amount < 0 && currentAmount >= Math.abs(amount)) {   //subtracts amount
        expenses[selectedMonth][category] = currentAmount + amount;
    } else {
        alert('Invalid amount: Cannot reduce the category below zero.');
    }

  
    saveExpensesFromLocalStorage(selectedMonth, selectYear);
    updateChart();
    amountInput.value = '';

}

expenseForm.addEventListener('submit', handleSubmit);
monthSelect.addEventListener('change', updateChart);
yearSelect.addEventListener('change', updateChart);

 
// Set default month and year based on current month and year
function setDefaultMonthYear() {
    const now = new Date();
    const initialMonth = now.toLocaleString('Default', {month: 'long'});
    const initialYear = now.getFullYear();
    monthSelect.value = initialMonth;
    yearSelect.value = initialYear;
}

setDefaultMonthYear();
updateChart();
});