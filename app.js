// app.js - Multi-Page Controller Logic for Michael Madhusudan Memorial College Library

// --- Constants & Database Initialization ---
const DEFAULT_BOOKS = [
    { isbn: "978-0262033848", title: "Introduction to Algorithms", author: "Thomas H. Cormen", department: "Computer Science", publisher: "MIT Press", copies: 5 },
    { isbn: "978-0073523309", title: "Database System Concepts", author: "Abraham Silberschatz", department: "Computer Science", publisher: "McGraw-Hill", copies: 3 },
    { isbn: "978-0135111529", title: "Core Java Volume I--Fundamentals", author: "Cay S. Horstmann", department: "Computer Science", publisher: "Prentice Hall", copies: 4 },
    { isbn: "978-1352010275", title: "Engineering Mathematics", author: "K.A. Stroud", department: "Mathematics", publisher: "Palgrave", copies: 2 },
    { isbn: "978-0131103627", title: "The C Programming Language", author: "Brian W. Kernighan", department: "Computer Science", publisher: "Prentice Hall", copies: 6 }
];

const DEFAULT_STUDENTS = [
    { id: "STU101", name: "Rahul Sharma", email: "rahul@college.edu", department: "Computer Science", password: "password123" },
    { id: "STU102", name: "Priya Patel", email: "priya@college.edu", department: "Information Technology", password: "password123" }
];

const DEFAULT_ISSUES = [
    { id: "ISS1001", studentId: "STU101", isbn: "978-0073523309", title: "Database System Concepts", issueDate: "2026-07-01", dueDate: "2026-07-15", returnDate: "", fine: 0, status: "Active" }
];

const DEFAULT_REQUISITIONS = [
    { id: "REQ2001", studentId: "STU102", isbn: "978-0262033848", title: "Introduction to Algorithms", requestDate: "2026-07-12", status: "Pending" }
];

function initDatabase() {
    if (!localStorage.getItem("lib_books")) {
        localStorage.setItem("lib_books", JSON.stringify(DEFAULT_BOOKS));
    }
    if (!localStorage.getItem("lib_students")) {
        localStorage.setItem("lib_students", JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem("lib_issues")) {
        localStorage.setItem("lib_issues", JSON.stringify(DEFAULT_ISSUES));
    }
    if (!localStorage.getItem("lib_requisitions")) {
        localStorage.setItem("lib_requisitions", JSON.stringify(DEFAULT_REQUISITIONS));
    }
    if (!localStorage.getItem("lib_visitor_count")) {
        localStorage.setItem("lib_visitor_count", "12548");
    } else {
        // Increment visitor count only once per page load
        let count = parseInt(localStorage.getItem("lib_visitor_count")) + 1;
        localStorage.setItem("lib_visitor_count", count.toString());
    }
}

// Get database state
const db = {
    getBooks: () => JSON.parse(localStorage.getItem("lib_books")),
    saveBooks: (data) => localStorage.setItem("lib_books", JSON.stringify(data)),
    getStudents: () => JSON.parse(localStorage.getItem("lib_students")),
    saveStudents: (data) => localStorage.setItem("lib_students", JSON.stringify(data)),
    getIssues: () => JSON.parse(localStorage.getItem("lib_issues")),
    saveIssues: (data) => localStorage.setItem("lib_issues", JSON.stringify(data)),
    getRequisitions: () => JSON.parse(localStorage.getItem("lib_requisitions")),
    saveRequisitions: (data) => localStorage.setItem("lib_requisitions", JSON.stringify(data)),
    getVisitorCount: () => localStorage.getItem("lib_visitor_count")
};

// Current Session State (Loaded from LocalStorage)
let currentUser = JSON.parse(localStorage.getItem("lib_current_user"));

// Check Authentication Guards
function checkAuthGuards(filename) {
    if (filename.startsWith("admin_") && filename !== "admin_login.html") {
        if (!currentUser || currentUser.role !== "admin") {
            alert("Access Denied. Administrator login required.");
            location.href = "admin_login.html";
        }
    }
    if (filename.startsWith("student_") && filename !== "student_login.html" && filename !== "student_register.html") {
        if (!currentUser || currentUser.role !== "student") {
            alert("Access Denied. Student portal login required.");
            location.href = "student_login.html";
        }
    }
}

// --- Login / Session Logic ---
function handleAdminLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("admin-username").value;
    const passwordInput = document.getElementById("admin-password").value;
    const errorEl = document.getElementById("admin-login-error");

    if (usernameInput === "admin" && passwordInput === "admin123") {
        currentUser = { role: "admin", name: "System Administrator" };
        localStorage.setItem("lib_current_user", JSON.stringify(currentUser));
        errorEl.classList.add("hidden");
        location.href = "admin_home.html";
    } else {
        errorEl.classList.remove("hidden");
        errorEl.textContent = "Invalid Administrator Credentials. Please try again.";
    }
}

function handleStudentLogin(event) {
    event.preventDefault();
    const idInput = document.getElementById("student-login-id").value;
    const passwordInput = document.getElementById("student-login-password").value;
    const errorEl = document.getElementById("student-login-error");

    const students = db.getStudents();
    const student = students.find(s => s.id === idInput && s.password === passwordInput);

    if (student) {
        currentUser = { role: "student", id: student.id, name: student.name, email: student.email, department: student.department };
        localStorage.setItem("lib_current_user", JSON.stringify(currentUser));
        errorEl.classList.add("hidden");
        location.href = "student_dashboard.html";
    } else {
        errorEl.classList.remove("hidden");
        errorEl.textContent = "Invalid Registration ID or Password. Try ID: STU101 and Password: password123";
    }
}

// --- Student Registration ---
function handleStudentRegistration(event) {
    event.preventDefault();
    const name = document.getElementById("reg-name").value;
    const id = document.getElementById("reg-id").value;
    const email = document.getElementById("reg-email").value;
    const dept = document.getElementById("reg-dept").value;
    const password = document.getElementById("reg-password").value;
    const agree = document.getElementById("reg-agree").checked;

    const errorEl = document.getElementById("reg-error");
    const successEl = document.getElementById("reg-success");

    if (!agree) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = "You must agree to the rules and contract agreement to register.";
        return;
    }

    const students = db.getStudents();
    if (students.find(s => s.id === id)) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = `A student with Registration ID ${id} is already registered.`;
        return;
    }

    students.push({ id, name, email, department: dept, password });
    db.saveStudents(students);

    errorEl.classList.add("hidden");
    successEl.classList.remove("hidden");
    successEl.innerHTML = `Registration Successful! <br>Your Registration ID is <strong>${id}</strong>. <br>Please proceed to Student Login page to login.`;

    // Reset fields
    document.getElementById("reg-name").value = "";
    document.getElementById("reg-id").value = "";
    document.getElementById("reg-email").value = "";
    document.getElementById("reg-dept").value = "";
    document.getElementById("reg-password").value = "";
    document.getElementById("reg-agree").checked = false;
}

// --- Admin features ---

// 1. Add Book (Fig 7.4)
function handleAddBook(event) {
    event.preventDefault();
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const isbn = document.getElementById("book-isbn").value;
    const dept = document.getElementById("book-dept").value;
    const publisher = document.getElementById("book-publisher").value;
    const copies = parseInt(document.getElementById("book-copies").value);

    const errorEl = document.getElementById("addbook-error");
    const successEl = document.getElementById("addbook-success");

    const books = db.getBooks();
    if (books.find(b => b.isbn === isbn)) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = `A book with ISBN ${isbn} already exists in the catalog.`;
        successEl.classList.add("hidden");
        return;
    }

    books.push({ isbn, title, author, department: dept, publisher, copies });
    db.saveBooks(books);

    errorEl.classList.add("hidden");
    successEl.classList.remove("hidden");
    successEl.textContent = `Book "${title}" added successfully!`;

    // Clear form
    document.getElementById("book-title").value = "";
    document.getElementById("book-author").value = "";
    document.getElementById("book-isbn").value = "";
    document.getElementById("book-publisher").value = "";
    document.getElementById("book-copies").value = "1";
}

// 2. Book Issue Page only for admin (Fig 7.5)
function handleIssueBook(event) {
    event.preventDefault();
    const studentId = document.getElementById("issue-student-id").value;
    const isbn = document.getElementById("issue-book-isbn").value;
    const issueDate = document.getElementById("issue-date").value;
    const dueDate = document.getElementById("issue-due-date").value;

    const errorEl = document.getElementById("issue-error");
    const successEl = document.getElementById("issue-success");

    // Validation
    const students = db.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = `Error: Student ID "${studentId}" is not registered in the system.`;
        successEl.classList.add("hidden");
        return;
    }

    const books = db.getBooks();
    const bookIndex = books.findIndex(b => b.isbn === isbn);
    if (bookIndex === -1) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = `Error: Book with ISBN "${isbn}" does not exist in the library catalog.`;
        successEl.classList.add("hidden");
        return;
    }

    if (books[bookIndex].copies <= 0) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = `Error: Zero copies available for "${books[bookIndex].title}". Cannot issue.`;
        successEl.classList.add("hidden");
        return;
    }

    // Process Issue
    const issues = db.getIssues();
    const issueId = "ISS" + (1000 + issues.length + 1);
    
    // Decrement copy
    books[bookIndex].copies -= 1;
    db.saveBooks(books);

    issues.push({
        id: issueId,
        studentId,
        isbn,
        title: books[bookIndex].title,
        issueDate,
        dueDate,
        returnDate: "",
        fine: 0,
        status: "Active"
    });
    db.saveIssues(issues);

    errorEl.classList.add("hidden");
    successEl.classList.remove("hidden");
    successEl.textContent = `Book "${books[bookIndex].title}" has been successfully issued to Student ${student.name} (${studentId}). Transaction ID: ${issueId}`;

    // Reset Form
    document.getElementById("issue-student-id").value = "";
    document.getElementById("issue-book-isbn").value = "";
    initIssueDates();
}

function initIssueDates() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14); // 14 days standard issue duration
    const dueStr = dueDate.toISOString().split('T')[0];

    const issueDateEl = document.getElementById("issue-date");
    const dueDateEl = document.getElementById("issue-due-date");

    if (issueDateEl) issueDateEl.value = todayStr;
    if (dueDateEl) dueDateEl.value = dueStr;
}

// 3. Render Book Lists for Admin (Fig 7.6)
function renderAdminBooksTable() {
    const tableBody = document.getElementById("admin-books-table-body");
    if (!tableBody) return;

    const books = db.getBooks();
    tableBody.innerHTML = "";

    if (books.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No books cataloged in the library.</td></tr>`;
        return;
    }

    books.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${b.isbn}</strong></td>
            <td>${b.title}</td>
            <td>${b.author}</td>
            <td>${b.department}</td>
            <td>${b.publisher}</td>
            <td style="text-align: center;"><strong>${b.copies}</strong></td>
        `;
        tableBody.appendChild(tr);
    });
}

// 4. Render Requisition List for Admin (Fig 7.7)
function renderAdminRequisitionsTable() {
    const tableBody = document.getElementById("admin-requisitions-table-body");
    if (!tableBody) return;

    const requisitions = db.getRequisitions();
    tableBody.innerHTML = "";

    if (requisitions.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No student book requisitions submitted.</td></tr>`;
        return;
    }

    requisitions.forEach(req => {
        const tr = document.createElement("tr");
        let badgeClass = "badge-pending";
        if (req.status === "Approved") badgeClass = "badge-approved";
        if (req.status === "Rejected") badgeClass = "badge-rejected";

        let actions = "";
        if (req.status === "Pending") {
            actions = `
                <button class="btn btn-success" style="padding: 2px 6px; font-size: 11px;" onclick="approveRequisition('${req.id}')">Approve</button>
                <button class="btn btn-secondary" style="padding: 2px 6px; font-size: 11px; background: #D9534F; color: white; border-color: #D43F3A;" onclick="rejectRequisition('${req.id}')">Reject</button>
            `;
        } else {
            actions = `<span style="color: #666; font-style: italic;">No actions</span>`;
        }

        tr.innerHTML = `
            <td><strong>${req.id}</strong></td>
            <td>${req.studentId}</td>
            <td>${req.title} <br><small style="color:#555;">ISBN: ${req.isbn}</small></td>
            <td>${req.requestDate}</td>
            <td><span class="table-badge ${badgeClass}">${req.status}</span></td>
            <td>${actions}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function approveRequisition(reqId) {
    const requisitions = db.getRequisitions();
    const reqIndex = requisitions.findIndex(r => r.id === reqId);
    if (reqIndex === -1) return;

    const req = requisitions[reqIndex];
    
    // Automatically issue the book if copies are available
    const books = db.getBooks();
    const bookIndex = books.findIndex(b => b.isbn === req.isbn);
    
    if (bookIndex === -1) {
        alert("This book no longer exists in the catalog.");
        return;
    }

    if (books[bookIndex].copies <= 0) {
        alert("Zero copies currently available. Cannot approve.");
        return;
    }

    books[bookIndex].copies -= 1;
    db.saveBooks(books);

    requisitions[reqIndex].status = "Approved";
    db.saveRequisitions(requisitions);

    const issues = db.getIssues();
    const issueId = "ISS" + (1000 + issues.length + 1);
    const todayStr = new Date().toISOString().split('T')[0];
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const dueStr = dueDate.toISOString().split('T')[0];

    issues.push({
        id: issueId,
        studentId: req.studentId,
        isbn: req.isbn,
        title: req.title,
        issueDate: todayStr,
        dueDate: dueStr,
        returnDate: "",
        fine: 0,
        status: "Active"
    });
    db.saveIssues(issues);

    alert(`Requisition approved. Issued book transaction ${issueId} created successfully.`);
    renderAdminRequisitionsTable();
}

function rejectRequisition(reqId) {
    const requisitions = db.getRequisitions();
    const reqIndex = requisitions.findIndex(r => r.id === reqId);
    if (reqIndex === -1) return;

    requisitions[reqIndex].status = "Rejected";
    db.saveRequisitions(requisitions);

    alert("Requisition has been rejected.");
    renderAdminRequisitionsTable();
}

// 5. Return book logic (Fig 7.8)
function populateReturnDropdown() {
    const selectEl = document.getElementById("return-transaction-id");
    if (!selectEl) return;

    const issues = db.getIssues();
    const activeIssues = issues.filter(i => i.status === "Active");

    selectEl.innerHTML = `<option value="">-- Select Active Issued Book transaction --</option>`;
    activeIssues.forEach(i => {
        selectEl.innerHTML += `<option value="${i.id}">${i.id} - Student: ${i.studentId} - ${i.title}</option>`;
    });

    document.getElementById("return-fine-display").innerHTML = "";
}

function handleReturnTransactionChange() {
    const issueId = document.getElementById("return-transaction-id").value;
    const fineDisplay = document.getElementById("return-fine-display");
    if (!issueId) {
        fineDisplay.innerHTML = "";
        return;
    }

    const issues = db.getIssues();
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    // Calculate fine (if any)
    const dueDate = new Date(issue.dueDate);
    const today = new Date();
    dueDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    let fine = 0;
    if (today > dueDate) {
        const timeDiff = today.getTime() - dueDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        fine = daysDiff * 2; 
    }

    if (fine > 0) {
        fineDisplay.innerHTML = `
            <div style="background-color: #FFF3CD; color: #856404; padding: 10px; border: 1px solid #FFEBA8; margin-top: 10px;">
                <strong>Warning:</strong> Book return is overdue by ${Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24))} day(s). <br>
                <strong>Late Fee Fine Amount:</strong> ₹${fine} (Enforced: ₹2.00 per day).
            </div>
        `;
    } else {
        fineDisplay.innerHTML = `
            <div style="background-color: #D4EDDA; color: #155724; padding: 10px; border: 1px solid #C3E6CB; margin-top: 10px;">
                No fine details. Book return is within the permitted timeline (Due: ${issue.dueDate}).
            </div>
        `;
    }
}

function handleReturnBookSubmit(event) {
    event.preventDefault();
    const issueId = document.getElementById("return-transaction-id").value;
    const errorEl = document.getElementById("return-error");
    const successEl = document.getElementById("return-success");

    if (!issueId) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = "Please select a valid transaction to return.";
        return;
    }

    const issues = db.getIssues();
    const issueIndex = issues.findIndex(i => i.id === issueId);
    if (issueIndex === -1) return;

    const issue = issues[issueIndex];
    const todayStr = new Date().toISOString().split('T')[0];

    const dueDate = new Date(issue.dueDate);
    const today = new Date();
    dueDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    let fine = 0;
    if (today > dueDate) {
        const daysDiff = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
        fine = daysDiff * 2;
    }

    issues[issueIndex].returnDate = todayStr;
    issues[issueIndex].fine = fine;
    issues[issueIndex].status = "Returned";
    db.saveIssues(issues);

    const books = db.getBooks();
    const bookIndex = books.findIndex(b => b.isbn === issue.isbn);
    if (bookIndex !== -1) {
        books[bookIndex].copies += 1;
        db.saveBooks(books);
    }

    errorEl.classList.add("hidden");
    successEl.classList.remove("hidden");
    successEl.innerHTML = `Book returned successfully!<br>
        Transaction: <strong>${issueId}</strong><br>
        Title: ${issue.title}<br>
        Fine Collected: <strong>₹${fine}</strong>`;

    populateReturnDropdown();
}

// 6. Admin Dashboard counters
function renderAdminDashboard() {
    const issues = db.getIssues();
    const books = db.getBooks();
    const students = db.getStudents();

    document.getElementById("admin-stat-total-books").textContent = books.length;
    document.getElementById("admin-stat-total-students").textContent = students.length;
    document.getElementById("admin-stat-active-issues").textContent = issues.filter(i => i.status === "Active").length;
    
    const totalFines = issues.reduce((acc, current) => acc + (current.fine || 0), 0);
    document.getElementById("admin-stat-total-fines").textContent = `₹${totalFines}`;

    const tbody = document.getElementById("admin-active-issues-tbody");
    if (tbody) {
        tbody.innerHTML = "";
        const activeIssues = issues.filter(i => i.status === "Active");
        if (activeIssues.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No books currently issued.</td></tr>`;
        } else {
            activeIssues.forEach(i => {
                tbody.innerHTML += `
                    <tr>
                        <td><strong>${i.id}</strong></td>
                        <td>${i.studentId}</td>
                        <td>${i.title}</td>
                        <td>${i.issueDate}</td>
                        <td><span style="color:#C00; font-weight:bold;">${i.dueDate}</span></td>
                    </tr>
                `;
            });
        }
    }
}

// --- Student features ---

// 1. Student Dashboard (Fig 7.12)
function renderStudentDashboard() {
    if (!currentUser || currentUser.role !== "student") return;

    document.getElementById("student-dash-name").textContent = currentUser.name;
    document.getElementById("student-dash-id").textContent = currentUser.id;
    document.getElementById("student-dash-email").textContent = currentUser.email;
    document.getElementById("student-dash-dept").textContent = currentUser.department;

    const issues = db.getIssues();
    const studentIssues = issues.filter(i => i.studentId === currentUser.id);

    // Active
    const activeTbody = document.getElementById("student-active-issues-tbody");
    if (activeTbody) {
        activeTbody.innerHTML = "";
        const active = studentIssues.filter(i => i.status === "Active");
        if (active.length === 0) {
            activeTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #666;">You currently hold no borrowed books.</td></tr>`;
        } else {
            active.forEach(i => {
                activeTbody.innerHTML += `
                    <tr>
                        <td><strong>${i.id}</strong></td>
                        <td>${i.title}</td>
                        <td>${i.issueDate}</td>
                        <td style="color:#AA0000; font-weight:bold;">${i.dueDate}</td>
                    </tr>
                `;
            });
        }
    }

    // History
    const historyTbody = document.getElementById("student-history-tbody");
    if (historyTbody) {
        historyTbody.innerHTML = "";
        const history = studentIssues.filter(i => i.status === "Returned");
        if (history.length === 0) {
            historyTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #666;">No historical records found.</td></tr>`;
        } else {
            history.forEach(i => {
                historyTbody.innerHTML += `
                    <tr>
                        <td><strong>${i.id}</strong></td>
                        <td>${i.title}</td>
                        <td>${i.issueDate}</td>
                        <td>${i.returnDate}</td>
                        <td>₹${i.fine}</td>
                    </tr>
                `;
            });
        }
    }

    // Requisitions
    const requisitions = db.getRequisitions();
    const studentReqs = requisitions.filter(r => r.studentId === currentUser.id);
    const reqTbody = document.getElementById("student-reqs-tbody");
    if (reqTbody) {
        reqTbody.innerHTML = "";
        if (studentReqs.length === 0) {
            reqTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #666;">No requests submitted.</td></tr>`;
        } else {
            studentReqs.forEach(r => {
                let badgeClass = "badge-pending";
                if (r.status === "Approved") badgeClass = "badge-approved";
                if (r.status === "Rejected") badgeClass = "badge-rejected";

                reqTbody.innerHTML += `
                    <tr>
                        <td><strong>${r.id}</strong></td>
                        <td>${r.title} <br><small style="color:#666;">ISBN: ${r.isbn}</small></td>
                        <td>${r.requestDate}</td>
                        <td><span class="table-badge ${badgeClass}">${r.status}</span></td>
                    </tr>
                `;
            });
        }
    }
}

// 2. Student Search / List books (Fig 7.13)
function renderStudentBooksTable() {
    const tableBody = document.getElementById("student-books-table-body");
    if (!tableBody) return;

    const books = db.getBooks();
    const searchQuery = document.getElementById("student-book-search").value.toLowerCase();
    const filterDept = document.getElementById("student-book-filter-dept").value;

    tableBody.innerHTML = "";

    const filteredBooks = books.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(searchQuery) || 
                              b.author.toLowerCase().includes(searchQuery) ||
                              b.isbn.includes(searchQuery);
        const matchesDept = filterDept === "" || b.department === filterDept;
        return matchesSearch && matchesDept;
    });

    if (filteredBooks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No matching books found in the library database.</td></tr>`;
        return;
    }

    filteredBooks.forEach(b => {
        const tr = document.createElement("tr");
        const statusSpan = b.copies > 0 
            ? `<span class="table-badge badge-approved">Available (${b.copies})</span>`
            : `<span class="table-badge badge-rejected">Out of Stock</span>`;

        const requestAction = b.copies > 0
            ? `<button class="btn btn-primary" style="padding: 2px 8px; font-size: 11px;" onclick="initiateRequestFromList('${b.isbn}')">Request</button>`
            : `<button class="btn btn-secondary" style="padding: 2px 8px; font-size: 11px;" disabled>Unavailable</button>`;

        tr.innerHTML = `
            <td><strong>${b.isbn}</strong></td>
            <td>${b.title}</td>
            <td>${b.author}</td>
            <td>${b.department}</td>
            <td style="text-align: center;">${statusSpan}</td>
            <td style="text-align: center;">${requestAction}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function handleStudentSearch(event) {
    event.preventDefault();
    renderStudentBooksTable();
}

function initiateRequestFromList(isbn) {
    // Redirect to request form with ISBN parameter
    location.href = `student_request_book.html?isbn=${isbn}`;
}

// 3. Student Book Request (Fig 7.14) & Successful Response Screen (Fig 7.15)
function populateBookRequestDropdown() {
    const selectEl = document.getElementById("request-book-isbn");
    if (!selectEl) return;

    const books = db.getBooks();
    selectEl.innerHTML = `<option value="">-- Choose Book from Catalogue --</option>`;
    books.forEach(b => {
        const stockStr = b.copies > 0 ? `Available (${b.copies} copies)` : "Out of Stock";
        selectEl.innerHTML += `<option value="${b.isbn}">${b.title} [ISBN: ${b.isbn}] - ${stockStr}</option>`;
    });

    // Check query params to pre-select a book
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedIsbn = urlParams.get('isbn');
    if (preselectedIsbn) {
        selectEl.value = preselectedIsbn;
    }
}

function handleStudentBookRequest(event) {
    event.preventDefault();
    const isbn = document.getElementById("request-book-isbn").value;
    const reqNotes = document.getElementById("request-notes").value;
    const errorEl = document.getElementById("request-error");

    if (!isbn) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = "Please select a book from the list.";
        return;
    }

    if (!currentUser || currentUser.role !== "student") {
        errorEl.classList.remove("hidden");
        errorEl.textContent = "Error: You must be logged in as a student to make a request.";
        return;
    }

    const books = db.getBooks();
    const book = books.find(b => b.isbn === isbn);
    if (!book) return;

    const requisitions = db.getRequisitions();
    const alreadyRequested = requisitions.some(r => r.studentId === currentUser.id && r.isbn === isbn && r.status === "Pending");
    if (alreadyRequested) {
        errorEl.classList.remove("hidden");
        errorEl.textContent = `You already have a pending requisition request for "${book.title}".`;
        return;
    }

    const reqId = "REQ" + (2000 + requisitions.length + 1);
    const todayStr = new Date().toISOString().split('T')[0];

    requisitions.push({
        id: reqId,
        studentId: currentUser.id,
        isbn: isbn,
        title: book.title,
        requestDate: todayStr,
        status: "Pending"
    });
    db.saveRequisitions(requisitions);

    errorEl.classList.add("hidden");
    document.getElementById("request-notes").value = "";

    // Redirect to the success page with parameters
    location.href = `success_message.html?reqId=${reqId}&title=${encodeURIComponent(book.title)}`;
}

// Render Success Page details (Fig 7.15)
function renderSuccessPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const reqId = urlParams.get('reqId');
    const title = urlParams.get('title');

    const successCard = document.getElementById("success-msg-card");
    if (successCard && reqId && title) {
        successCard.innerHTML = `
            <div class="success-icon">✓</div>
            <h3>Request Submitted Successfully</h3>
            <p>Your requisition request for the book <strong>"${decodeURIComponent(title)}"</strong> has been successfully submitted to the Admin. Please wait for approval.</p>
            <div style="background: #FFF; padding: 10px; border: 1px dashed var(--gov-green); font-family: Arial, sans-serif; font-size: 13px; display: inline-block; margin-bottom: 20px;">
                Requisition Reference ID: <strong>${reqId}</strong>
            </div>
            <div>
                <button class="btn btn-success" onclick="location.href='student_dashboard.html'">Go to Student Dashboard</button>
                <button class="btn btn-secondary" onclick="location.href='student_list_books.html'">Back to Book List</button>
            </div>
        `;
    }
}

// Render Home stats
function renderHomeStats() {
    const books = db.getBooks();
    const students = db.getStudents();
    const issues = db.getIssues();
    const activeIssues = issues.filter(i => i.status === "Active");

    const totalBooksEl = document.getElementById("home-stat-total-books");
    const totalStudentsEl = document.getElementById("home-stat-total-students");
    const activeLoansEl = document.getElementById("home-stat-active-issues");

    if (totalBooksEl) totalBooksEl.textContent = books.length;
    if (totalStudentsEl) totalStudentsEl.textContent = students.length;
    if (activeLoansEl) activeLoansEl.textContent = activeIssues.length;
}

// --- Initialize Page Routing on Load ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Init Database state
    initDatabase();

    // 2. Determine which page we are currently viewing
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || "index.html";

    // 3. Security Guard Check
    checkAuthGuards(filename);

    // 4. Run appropriate page-specific logic
    switch (filename) {
        case "index.html":
            renderHomeStats();
            break;
        case "admin_home.html":
            renderAdminDashboard();
            break;
        case "admin_add_book.html":
            // Ready to listen to forms
            break;
        case "admin_issue_book.html":
            initIssueDates();
            break;
        case "admin_list_books.html":
            renderAdminBooksTable();
            break;
        case "admin_requisitions.html":
            renderAdminRequisitionsTable();
            break;
        case "admin_return_book.html":
            populateReturnDropdown();
            break;
        case "student_dashboard.html":
            renderStudentDashboard();
            break;
        case "student_list_books.html":
            renderStudentBooksTable();
            break;
        case "student_request_book.html":
            populateBookRequestDropdown();
            break;
        case "success_message.html":
            renderSuccessPage();
            break;
    }
});
