const apiUrl = 'http://localhost:3000/api/';

async function checkAuth() {
    try {
        const response = await fetch('/api/check-auth', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to check auth status');

        const data = await response.json();
        console.log("Auth Check Response:", data);

        if (data.authenticated) {
            if (window.location.pathname.endsWith('login.html')) {
                window.location.href = "/";
            } else {
                document.getElementById('user-info').textContent = `${data.user.name} (${data.user.email})`;
                document.getElementById('user-info').style.display = 'inline';
                document.getElementById('logout-btn').style.display = 'inline';
                setupLogoutConfirmation();
            }
        } else {
            if (!window.location.pathname.endsWith('login.html')) {
                console.log("User not logged in. Redirecting to login...");
                window.location.href = "/login.html";
            }
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

function setupLogoutConfirmation() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) {
        console.warn("Logout button not found!");
        return;
    }
    logoutBtn.removeAttribute('href');
    logoutBtn.addEventListener('click', async function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!confirm("Are you sure you want to sign out?")) {
            return;
        }
        try {
            const response = await fetch('/logout', { method: 'GET', credentials: 'include' });
            if (response.ok) {
                window.location.href = "/login.html";
            } else {
                console.error('Logout failed. Server responded with:', response.status);
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        }
    });
}

function openLoginWindow() {
    const loginWindow = window.open('/auth/google', '_blank', 'width=500,height=600');
    const checkInterval = setInterval(async () => {
        try {
            const response = await fetch('/api/check-auth', { credentials: 'include' });
            const data = await response.json();
            if (data.authenticated) {
                clearInterval(checkInterval);
                loginWindow.close();
                window.location.href = "/";
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }, 2000);
}

function showTab(tab) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
}

async function loadData(endpoint, tableId) {
    try {
        const authResponse = await fetch("/api/check-auth");
        const authData = await authResponse.json();
        if (!authData.authenticated) {
            alert("You need to log in first!");
            window.location.href = "/login.html";
            return;
        }
        const response = await fetch(apiUrl + endpoint);
        if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
        const data = await response.json();
        const tbody = document.getElementById(tableId).getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";
        data.forEach(row => {
            const tr = document.createElement("tr");
            if (row.id) {
                tr.setAttribute("data-id", row.id);
            }
            Object.values(row).forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        alert("Failed to load data. Check console for details.");
    }
}

async function saveData(endpoint, data) {
    try {
        const response = await fetch(apiUrl + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Error saving data: ${response.statusText}`);
        alert("Data saved successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to save data. Check console for details.");
    }
}

function loadMain() { loadData('main', 'mainTable'); }
function saveMain() {
    const data = {
        UserName: document.getElementById('mainUserName').value,
        Date: document.getElementById('mainDate').value,
        Divisor: document.getElementById('mainDivisor').value,
        Dividend: document.getElementById('mainDividend').value,
        RepoRate: document.getElementById('mainRepoRate').value,
        FundingRate: document.getElementById('mainFundingRate').value,
        FYR: document.getElementById('mainFYR').value,
        DateFormat: document.getElementById('mainDateFormat').value
    };
    saveData('main', data);
}

function loadDivisor() { loadData('divisor', 'divisorTable'); }
function saveDivisor() {
    const data = {
        Index: document.getElementById('divisorIndex').value,
        FromDt: document.getElementById('divisorFromDt').value,
        ToDt: document.getElementById('divisorToDt').value,
        Divisor: document.getElementById('divisorDivisor').value,
        UpdateSource: document.getElementById('divisorUpdateSource').value,
        UpdateTime: document.getElementById('divisorUpdateTime').value
    };
    saveData('divisor', data);
}

function loadDividend() { loadData('dividend', 'dividendTable'); }
function saveDividend() {
    const data = {
        Dt: document.getElementById('dividendDt').value,
        Index: document.getElementById('dividendIndex').value,
        DivDt: document.getElementById('dividendDivDt').value,
        Dividend: document.getElementById('dividendDividend').value,
        UpdateSource: document.getElementById('dividendUpdateSource').value,
        UpdateTime: document.getElementById('dividendUpdateTime').value
    };
    saveData('dividend', data);
}

function loadRepoRate() { loadData('repo_rate', 'repoRateTable'); }
function saveRepoRate() {
    const data = {
        Dt: document.getElementById('repoRateDt').value,
        Index: document.getElementById('repoRateIndex').value,
        Term: document.getElementById('repoRateTerm').value,
        Bid: document.getElementById('repoRateBid').value,
        Offer: document.getElementById('repoRateOffer').value,
        UpdateSource: document.getElementById('repoRateUpdateSource').value,
        UpdateTime: document.getElementById('repoRateUpdateTime').value
    };
    saveData('repo_rate', data);
}

function loadFundingRate() { loadData('funding_rate', 'fundingRateTable'); }
function saveFundingRate() {
    const data = {
        Dt: document.getElementById('fundingRateDt').value,
        Index: document.getElementById('fundingRateIndex').value,
        Term: document.getElementById('fundingRateTerm').value,
        Bid: document.getElementById('fundingRateBid').value,
        Offer: document.getElementById('fundingRateOffer').value,
        UpdateSource: document.getElementById('fundingRateUpdateSource').value,
        UpdateTime: document.getElementById('fundingRateUpdateTime').value
    };
    saveData('funding_rate', data);
}

function loadFuturePrice() { loadData('future_price', 'futurePriceTable'); }
function saveFuturePrice() {
    const data = {
        ParametersUse: document.getElementById('futurePriceParametersUse').value,
        CalculationDetails: document.getElementById('futurePriceCalculationDetails').value
    };
    saveData('future_price', data);
}

let currentRow = null;
let currentTableEndpoint = "";

function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; 
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    mm = mm < 10 ? '0' + mm : mm;
    dd = dd < 10 ? '0' + dd : dd;
    return `${yyyy}-${mm}-${dd}`;
}

document.addEventListener("contextmenu", function(e) {
    let targetRow = e.target;
    while (targetRow && targetRow.tagName !== "TR") {
        targetRow = targetRow.parentElement;
    }
    if (targetRow) {
        const table = targetRow.closest("table.data-table");
        if (table) {
            e.preventDefault();
            currentRow = targetRow;
            const tableId = table.getAttribute("id");
            switch (tableId) {
                case "mainTable":
                    currentTableEndpoint = "main";
                    break;
                case "divisorTable":
                    currentTableEndpoint = "divisor";
                    break;
                case "dividendTable":
                    currentTableEndpoint = "dividend";
                    break;
                case "repoRateTable":
                    currentTableEndpoint = "repo_rate";
                    break;
                case "fundingRateTable":
                    currentTableEndpoint = "funding_rate";
                    break;
                case "futurePriceTable":
                    currentTableEndpoint = "future_price";
                    break;
                default:
                    currentTableEndpoint = "";
            }
            const contextMenu = document.getElementById("custom-context-menu");
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.display = "block";
        }
    }
});

document.addEventListener("click", () => {
    const contextMenu = document.getElementById("custom-context-menu");
    if (contextMenu) {
        contextMenu.style.display = "none";
    }
});

document.getElementById("add-row-option").addEventListener("click", () => {
    if (currentRow && currentTableEndpoint) {
        if (confirm("Do you want to add a new row?")) {
            const tbody = currentRow.parentElement;
            const table = tbody.parentElement;
            const columnCount = table.querySelector("thead tr").children.length;
            const newRow = document.createElement("tr");
            for (let i = 0; i < columnCount; i++) {
                const td = document.createElement("td");
                td.contentEditable = "true";
                td.style.backgroundColor = "#ffffe0";
                newRow.appendChild(td);
            }
            newRow.setAttribute("data-new", "true");
            tbody.insertBefore(newRow, currentRow.nextSibling);
        }
    }
});

document.getElementById("delete-row-option").addEventListener("click", () => {
    if (currentRow && currentTableEndpoint) {
        if (confirm("The current row will be deleted. Do you want to proceed?")) {
            currentRow.setAttribute("data-pending-delete", "true");
            currentRow.style.backgroundColor = "#fdd";
        }
    }
});

document.getElementById("modify-row-option").addEventListener("click", () => {
    if (currentRow && currentTableEndpoint) {
        if (confirm("Do you want to modify this row?")) {
            currentRow.setAttribute("data-pending-modify", "true");
            currentRow.querySelectorAll("td").forEach(td => {
                td.contentEditable = "true";
                td.style.backgroundColor = "#ffffe0";
            });
        }
    }
});

async function saveTableChanges(endpoint, tableId) {
    const tbody = document.getElementById(tableId).getElementsByTagName("tbody")[0];
    const rows = tbody.querySelectorAll("tr");
    for (const row of rows) {
        if (row.hasAttribute("data-pending-delete")) {
            const id = row.getAttribute("data-id");
            if (id) {
                try {
                    const response = await fetch(`/api/${endpoint}/${id}`, {
                        method: "DELETE",
                        credentials: "include"
                    });
                    if (response.ok) {
                        row.remove();
                    } else {
                        alert("Error deleting row with ID " + id);
                    }
                } catch (error) {
                    console.error("Delete error:", error);
                }
            } else {
                row.remove();
            }
        }
        else if (row.hasAttribute("data-new")) {
            let payload = {};
            const cells = row.querySelectorAll("td");
            console.log("Payload being sent:", payload);
            if (endpoint === "main") {
                payload = {
                    UserName: cells[1].innerText.trim(),
                    Date: formatDate(cells[2].innerText.trim()),
                    Divisor: cells[3].innerText.trim(),
                    Dividend: cells[4].innerText.trim(),
                    RepoRate: cells[5].innerText.trim(),
                    FundingRate: cells[6].innerText.trim(),
                    FYR: cells[7].innerText.trim(),
                    DateFormat: formatDate(cells[8].innerText.trim())
                };
            } else if (endpoint === "divisor") {
                payload = {
                    Index: cells[1].innerText.trim(),
                    FromDt: formatDate(cells[2].innerText.trim()),
                    ToDt: formatDate(cells[3].innerText.trim()),
                    Divisor: cells[4].innerText.trim(),
                    UpdateSource: cells[5].innerText.trim(),
                    UpdateTime: cells[6].innerText.trim()
                };
            } else if (endpoint === "dividend") {
                payload = {
                    Dt: formatDate(cells[1].innerText.trim()),
                    Index: cells[2].innerText.trim(),
                    DivDt: formatDate(cells[3].innerText.trim()),
                    Dividend: cells[4].innerText.trim(),
                    UpdateSource: cells[5].innerText.trim(),
                    UpdateTime: cells[6].innerText.trim()
                };
            } else if (endpoint === "repo_rate") {
                payload = {
                    Dt: formatDate(cells[1].innerText.trim()),
                    Index: cells[2].innerText.trim(),
                    Term: cells[3].innerText.trim(),
                    Bid: cells[4].innerText.trim(),
                    Offer: cells[5].innerText.trim(),
                    UpdateSource: cells[6].innerText.trim(),
                    UpdateTime: cells[7].innerText.trim()
                };
            } else if (endpoint === "funding_rate") {
                payload = {
                    Dt: formatDate(cells[1].innerText.trim()),
                    Index: cells[2].innerText.trim(),
                    Term: cells[3].innerText.trim(),
                    Bid: cells[4].innerText.trim(),
                    Offer: cells[5].innerText.trim(),
                    UpdateSource: cells[6].innerText.trim(),
                    UpdateTime: cells[7].innerText.trim()
                };
            } else if (endpoint === "future_price") {
                payload = {
                    ParametersUse: cells[0].innerText.trim(),
                    CalculationDetails: cells[1].innerText.trim()
                };
            }
            const missingField = Object.entries(payload).find(([key, value]) => value === "");
            if (missingField) {
                alert(`Field "${missingField[0]}" is required in a new row. Please fill it in.`);
                continue;
            }
            try {
                const response = await fetch(`/api/${endpoint}`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    const resData = await response.json();
                    row.setAttribute("data-id", resData.id);
                    row.removeAttribute("data-new");
                    row.style.backgroundColor = "";
                    row.querySelectorAll("td").forEach(td => td.removeAttribute("contenteditable"));
                } else {
                    alert("Error saving new row.");
                }
            } catch (error) {
                console.error("Error saving new row:", error);
            }
        }
        else if (row.hasAttribute("data-pending-modify")) {
            let payload = {};
            const cells = row.querySelectorAll("td");
            if (endpoint === "main") {
                payload = {
                    UserName: cells[1].innerText.trim(),
                    Date: formatDate(cells[2].innerText.trim()),
                    Divisor: cells[3].innerText.trim(),
                    Dividend: cells[4].innerText.trim(),
                    RepoRate: cells[5].innerText.trim(),
                    FundingRate: cells[6].innerText.trim(),
                    FYR: cells[7].innerText.trim(),
                    DateFormat: formatDate(cells[8].innerText.trim())
                };
            } else if (endpoint === "divisor") {
                payload = {
                    Index: cells[1].innerText.trim(),
                    FromDt: formatDate(cells[2].innerText.trim()),
                    ToDt: formatDate(cells[3].innerText.trim()),
                    Divisor: cells[4].innerText.trim(),
                    UpdateSource: cells[5].innerText.trim(),
                    UpdateTime: cells[6].innerText.trim()
                };
            } else if (endpoint === "dividend") {
                payload = {
                    Dt: formatDate(cells[1].innerText.trim()),
                    Index: cells[2].innerText.trim(),
                    DivDt: formatDate(cells[3].innerText.trim()),
                    Dividend: cells[4].innerText.trim(),
                    UpdateSource: cells[5].innerText.trim(),
                    UpdateTime: cells[6].innerText.trim()
                };
            } else if (endpoint === "repo_rate") {
                payload = {
                    Dt: formatDate(cells[1].innerText.trim()),
                    Index: cells[2].innerText.trim(),
                    Term: cells[3].innerText.trim(),
                    Bid: cells[4].innerText.trim(),
                    Offer: cells[5].innerText.trim(),
                    UpdateSource: cells[6].innerText.trim(),
                    UpdateTime: cells[7].innerText.trim()
                };
            } else if (endpoint === "funding_rate") {
                payload = {
                    Dt: formatDate(cells[1].innerText.trim()),
                    Index: cells[2].innerText.trim(),
                    Term: cells[3].innerText.trim(),
                    Bid: cells[4].innerText.trim(),
                    Offer: cells[5].innerText.trim(),
                    UpdateSource: cells[6].innerText.trim(),
                    UpdateTime: cells[7].innerText.trim()
                };
            } else if (endpoint === "future_price") {
                payload = {
                    ParametersUse: cells[0].innerText.trim(),
                    CalculationDetails: cells[1].innerText.trim()
                };
            }
            const missingField = Object.entries(payload).find(([key, value]) => value === "");
            if (missingField) {
                alert(`Field "${missingField[0]}" is required in a modified row. Please fill it in.`);
                continue;
            }
            const id = row.getAttribute("data-id");
            if (!id) {
                alert("Missing row ID for modified row.");
                continue;
            }
            try {
                const response = await fetch(`/api/${endpoint}/${id}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    row.removeAttribute("data-pending-modify");
                    row.style.backgroundColor = "";
                    row.querySelectorAll("td").forEach(td => td.removeAttribute("contenteditable"));
                } else {
                    alert("Error updating row with ID " + id);
                }
            } catch (error) {
                console.error("Error updating row:", error);
            }
        }
    }
    alert("Table changes saved.");
}

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});
