document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const tenantID = params.get("id");

    const tenantDetailsDiv = document.getElementById("tenantDetails");
    const uploadForm = document.getElementById("uploadForm");
    const idCopyInput = document.getElementById("idCopy");
    const agreementCopyInput = document.getElementById("agreementCopy");
    const documentList = document.getElementById("documentList");
    const paymentForm = document.getElementById("paymentForm");
    const paymentList = document.getElementById("paymentList");

    let tenants = JSON.parse(localStorage.getItem("tenants")) || [];
    let tenant = tenants.find(t => t.tenantID === tenantID);

    if (tenant) {
        tenantDetailsDiv.innerHTML = `
            <h2>${tenant.tenantName}</h2>
            <p><strong>ID:</strong> ${tenant.tenantID}</p>
            <p><strong>Phone:</strong> ${tenant.tenantPhone}</p>
            <p><strong>Email:</strong> ${tenant.tenantEmail}</p>
        `;

        displayDocuments(tenant);
        displayPayments(tenant);
    } else {
        tenantDetailsDiv.innerHTML = `<p>Tenant not found. <a href="index.html">Go back</a></p>`;
    }

    uploadForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (tenant) {
            if (idCopyInput.files.length > 0) {
                tenant.idCopy = URL.createObjectURL(idCopyInput.files[0]);
            }
            if (agreementCopyInput.files.length > 0) {
                tenant.agreementCopy = URL.createObjectURL(agreementCopyInput.files[0]);
            }

            saveTenants();
            displayDocuments(tenant);
        }
    });

    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        if (tenant) {
            const amount = document.getElementById("paymentAmount").value;
            const date = document.getElementById("paymentDate").value;
            const method = document.getElementById("paymentMethod").value;

            if (amount && date && method) {
                const payment = { amount, date, method };
                tenant.payments = tenant.payments || [];
                tenant.payments.push(payment);
                saveTenants();
                displayPayments(tenant);
                paymentForm.reset();
            }
        }
    });

    function saveTenants() {
        localStorage.setItem("tenants", JSON.stringify(tenants));
    }

    function displayDocuments(tenant) {
        documentList.innerHTML = "";

        if (tenant.idCopy) {
            documentList.innerHTML += `<p><strong>ID Copy:</strong> <a href="${tenant.idCopy}" target="_blank">View</a></p>`;
        }

        if (tenant.agreementCopy) {
            documentList.innerHTML += `<p><strong>Tenancy Agreement:</strong> <a href="${tenant.agreementCopy}" target="_blank">View</a></p>`;
        }
    }

    function displayPayments(tenant) {
        paymentList.innerHTML = "";
        if (tenant.payments && tenant.payments.length > 0) {
            tenant.payments.forEach((payment, index) => {
                const paymentItem = document.createElement("li");
                paymentItem.innerHTML = `Amount: ${payment.amount}, Date: ${payment.date}, Method: ${payment.method} 
                    <button class="delete-payment" data-index="${index}">Remove</button>`;
                paymentList.appendChild(paymentItem);
            });
        }
    }

    paymentList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-payment")) {
            const index = event.target.dataset.index;
            tenant.payments.splice(index, 1);
            saveTenants();
            displayPayments(tenant);
        }
    });
});
