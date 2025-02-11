document.addEventListener("DOMContentLoaded", function () {
    const tenantForm = document.getElementById("tenantForm");
    const tenantList = document.getElementById("tenantList");

    loadTenants();

    tenantForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const tenantName = document.getElementById("tenantName").value;
        const tenantID = document.getElementById("tenantID").value;
        const tenantPhone = document.getElementById("tenantPhone").value;
        const tenantEmail = document.getElementById("tenantEmail").value;

        if (tenantName && tenantID && tenantPhone && tenantEmail) {
            const tenant = {
                tenantName,
                tenantID,
                tenantPhone,
                tenantEmail,
                idCopy: "",
                agreementCopy: ""
            };

            saveTenant(tenant);
            loadTenants();
            tenantForm.reset();
        } else {
            alert("Please fill in all fields.");
        }
    });

    function saveTenant(tenant) {
        let tenants = JSON.parse(localStorage.getItem("tenants")) || [];
        tenants.push(tenant);
        localStorage.setItem("tenants", JSON.stringify(tenants));
    }

    function loadTenants() {
        let tenants = JSON.parse(localStorage.getItem("tenants")) || [];
        tenantList.innerHTML = "";
        tenants.forEach(addTenantToList);
    }

    function addTenantToList(tenant) {
        const listItem = document.createElement("li");
        listItem.classList.add("tenant-item");
        listItem.innerHTML = `
            <strong>${tenant.tenantName}</strong> (ID: ${tenant.tenantID})<br>
            Phone: ${tenant.tenantPhone} | Email: ${tenant.tenantEmail}<br>
            <a href="profile.html?id=${tenant.tenantID}">View Profile</a>
            <button class="delete-btn" data-id="${tenant.tenantID}">Remove</button>
        `;
        tenantList.appendChild(listItem);
    }

    tenantList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const tenantID = event.target.dataset.id;
            removeTenant(tenantID);
        }
    });

    function removeTenant(tenantID) {
        let tenants = JSON.parse(localStorage.getItem("tenants")) || [];
        tenants = tenants.filter(t => t.tenantID !== tenantID);
        localStorage.setItem("tenants", JSON.stringify(tenants));

        loadTenants();

        // Remove profile if it exists
        const currentTenantID = new URLSearchParams(window.location.search).get("id");
        if (currentTenantID === tenantID) {
            window.location.href = "index.html";
        }
    }
});
