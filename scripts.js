const Modal = {
    //Button +Nova transação | Open the form
    openClose() {
        document
            .querySelector('.modal-overlay')
            .classList.toggle('active')
    },
    //Button Cancel | Close the form
    // close(){
    //     document
    //         .querySelector('.modal-overlay')
    //         .classList.remove('active')
    // }
} 

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finance:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finance:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income
    },
    expenses() {
        let expense = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense
    },
    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    //Assigns that will find out and contain the id and tag from the HTML document
    transactionsContainer: document.querySelector('#data-table tbody'),

    //Create the tag 'tr' and calls the innerHTMLtransaction function
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        //Assigns the value of the function innerHTMLtransaction into the variable tr
        tr.innerHTML = DOM.innerHTMLtransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },
    //Create the 'td' tags with the card structure
    innerHTMLtransaction(transaction, index) {
        //Creates a ternary variable
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td>${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },
    //Update the balance App
    updateBalance() {
        document
            .querySelector("#incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .querySelector("#expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .querySelector("#totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransaction() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount (value) {
        //replace(\,\./g, "") it's not necessary, the app works without it
        value = Number(value.replace(/\,\./g, "")) * 100
        return value
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        //Regular expression /\D/g (g = global), replaces what is different from the number
        //Example -500, replace '-' for anything
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const Form = {
    //Variables to get the data from HTML
    description: document.getElementById("description"),
    amount: document.getElementById("amount"),
    date: document.getElementById("date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    //Verify if the fields were filled
    checkFields() {
        const {description, amount, date} = Form.getValues()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Preencha todos os campos")
        }
    },
    //Format the values from the Form fields
    formatValues() {
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },
    //Save date using the method add() that belongs to Transaction
    saveTransaction(transaction) {
        Transaction.add(transaction)
    },
    //Delete the data form the Form
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event) {
        event.preventDefault()

        try {
            Form.checkFields()
            const transaction = Form.formatValues()
            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.openClose()
            App.reload()
        } catch (error) {
            alert(error.message)
        }
        console.log(transaction)
    }
}

const App = {
    init() {
        //Calls each data from the array transactions
        //Could be use Transaction.all.forEach(DOM.addTransaction) atalho
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransaction()
        App.init()
    },
}

App.init()