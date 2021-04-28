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

const transactions = [
    {
        id:1,
        description: 'Luz',
        amount: -50000,
        date: '28/04/2021',
    },
    {
        id: 2,
        description: 'Website',
        amount: 100000,
        date: '28/04/2021',
    },
    {
        id: 3,
        description: 'Internet',
        amount: 50000,
        date: '28/04/2021',
    },
]

const Transaction = {
    incomes() {

    },
    expenses() {

    },
    total() {

    }
}

const DOM = {
    //Assigns that will find out and contain the id and tag from the HTML document
    transactionsContainer: document.querySelector('#data-table tbody'),

    //Create the tag 'tr' and calls the innerHTMLtransaction function
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        //Assigns the value of the function innerHTMLtransaction into the variable tr
        tr.innerHTML = DOM.innerHTMLtransaction(transaction)
        DOM.transactionsContainer.appendChild(tr)
    },
    //Create the 'td' tags with the card structure
    innerHTMLtransaction(transaction) {
        //Creates a ternary variable
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td>${transaction.date}</td>
            <td>
                <a href=""><img src="./assets/minus.svg" alt="Imagem de subtrair"></a>
            </td>
        `
        return html
    }
}

const Utils = {
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

//Calls each data from the array transactions
transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction)
})