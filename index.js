/*modal*/
const modal = document.querySelector('.modal-overflow')
function openAndClose() {
    modal.classList.toggle('active')
}

/*inputs*/
const InputTransactionDescription = document.querySelector(
    '#transaction-description'
)
const InputTransactionValue = document.querySelector('#transaction-value')
const InputTransactionDate = document.querySelector('#transaction-date')

// displays
const displayIncomes = document.querySelector('.income .card-display-body p')
const displayExpenses = document.querySelector('.outgoing .card-display-body p')
const displayTotal = document.querySelector('.total .card-display-body p')
const displayTotalBackground = document.querySelector('.total')

// tbody
const tBody = document.querySelector('.tbody')

// btn remove

function ControleFinanceiro(
    displayIncomes,
    displayExpenses,
    displayTotal,
    tBody
) {
    this.arr = JSON.parse(localStorage.getItem('transactions')) || []

    this.init = function () {
        this.pasteTask(this.arr)
        if (this.arr.length > 0) this.displayValue()
    }

    this.pasteTask = function (arr) {
        tBody.innerHTML = ''
        arr.forEach((item,index) => {
            const classValue = item.value > -1 ? 'incomes' : 'expenses'

            tBody.innerHTML += `<tr>
                                    <td class="description">${item.description}</td>
                                    <td class="${classValue}">R$&nbsp;${item.value}</td>
                                    <td class="date">${item.date}</td>
                                    <td><i onclick="controle.removeTransaction(${index})" class="bx bx-trash-alt"></i></td>
                                </tr>`
        })
    }

    this.displayValue = function () {

        const allValues = this.arr.map((item) => item.value)

        const total = allValues.reduce((acc, item) => acc + item)
        //choose background color according to the value
        total < 0
            ? displayTotalBackground.classList.add('loss')
            : displayTotalBackground.classList.remove('loss')

        const incomes = allValues
            .filter((item) => item > 0)
            .reduce((acc, item) => acc + item, 0)

        const expenses = allValues
            .filter((item) => item < 0)
            .reduce((acc, item) => acc + item, 0)

        //add values in display
        displayIncomes.innerHTML = `R$&nbsp${incomes.toFixed(2)}`
        displayExpenses.innerHTML = `R$&nbsp${expenses.toFixed(2)}`
        displayTotal.innerHTML = `R$&nbsp;${total.toFixed(2)}`
    }

    //clear input
    this.clearInput = function(){
        InputTransactionDescription.value = '';
        InputTransactionValue.value = '';
        InputTransactionDate.value = '';
    }

    //add transaction
    this.addTransaction = function () {
        const description = InputTransactionDescription.value
        const value = Number(InputTransactionValue.value)
        const date = InputTransactionDate.value.replace(/\D+/g, '/')

        if(!description || !value || !date) return alert("preencha todos os campos!");

        this.arr.push({
            description,
            value,
            date,
        })

        localStorage.setItem('transactions', JSON.stringify(this.arr))

        this.pasteTask(this.arr)
        this.displayValue()
        openAndClose()
        this.clearInput()

    }.bind(this)

    addEventListener('submit', this.addTransaction)

    //remove transaction

    this.removeTransaction = function(number){
        this.arr.splice(number,1);

        localStorage.setItem('transactions',JSON.stringify(this.arr));

        this.pasteTask(this.arr);
        this.displayValue();
        

    }
}

const controle = new ControleFinanceiro(
    displayIncomes,
    displayExpenses,
    displayTotal,
    tBody
)

controle.init()
