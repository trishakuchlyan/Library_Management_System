// layout.js - Handles shared header, footer, navigation, and sidebar across all pages

// Dynamic HTML Templates
const HEADER_HTML = `
    <!-- Accessibility / Top Bar -->
    <div class="accessibility-bar">
        <div>
            <a href="#main-content">Skip to main content</a> | 
            <a href="index.html">National Portal of India</a>
        </div>
        <div style="display: flex; align-items: center; gap: 15px;">
            <span>Language: <strong>English</strong></span>
            <div class="font-resize">
                Text Size: 
                <span onclick="document.body.style.fontSize='14px'">A-</span>
                <span onclick="document.body.style.fontSize='16px'">A</span>
                <span onclick="document.body.style.fontSize='18px'">A+</span>
            </div>
            <span style="display:inline-flex; align-items:center; gap:4px; font-weight:bold;">
                <span style="background-color:#FF9933; width:10px; height:6px; display:inline-block;"></span>
                <span style="background-color:#FFFFFF; width:10px; height:6px; display:inline-block; border:1px solid #ddd;"></span>
                <span style="background-color:#128807; width:10px; height:6px; display:inline-block;"></span>
                IND
            </span>
        </div>
    </div>

    <!-- Main Header (MMMC Cropped Website Banner) -->
    <header class="main-header" style="padding: 0; background: #002244; display: flex; justify-content: center; align-items: center; border-bottom: 2px solid var(--border-color); overflow: hidden;">
        <img src="cropped-website-front-page-banner-2.jpg" alt="Michael Madhusudan Memorial College Central Library" style="width: 100%; height: auto; max-height: 110px; object-fit: cover; display: block;">
    </header>

    <!-- Tricolor Ribbon Stripe -->
    <div class="tricolor-stripe">
        <div class="stripe-orange"></div>
        <div class="stripe-white"></div>
        <div class="stripe-green"></div>
    </div>

    <!-- Navigation Menu Bar -->
    <nav class="nav-menu">
        <button id="nav-btn-home" onclick="location.href='index.html'">Home</button>
        <button id="nav-btn-rules" onclick="location.href='rules_agreement.html'">Library Rules & Contract</button>
        <button id="nav-btn-student" onclick="location.href='student_login.html'">Student Portal</button>
        <button id="nav-btn-admin" onclick="location.href='admin_login.html'">Admin Desk</button>
        <button id="nav-btn-contact" onclick="location.href='contact_us.html'">Contact Us</button>
        
        <div id="logged-in-user-info" class="logged-in-user hidden">
            <span>Welcome, <strong id="user-display-name">User</strong> (<span id="user-display-role">Role</span>)</span>
            <button class="logout-btn" onclick="triggerLogout()">LOGOUT</button>
        </div>
    </nav>

    <!-- Marquee Banner Announcements -->
    <div class="marquee-container">
        <span class="marquee-label">LATEST NOTICES</span>
        <marquee onmouseover="this.stop();" onmouseout="this.start();" scrollamount="4">
            * Late fee of ₹2.00 per day will be strictly charged on books returned after the due date. 
            * All students must register on this portal to generate a digital Library Accession ID. 
            * MMMC Library reading room timings: 09:00 AM to 05:00 PM (Monday to Saturday).
            * Affiliation update: Under Kazi Nazrul University guidelines.
        </marquee>
    </div>
`;

const FOOTER_HTML = `
    <footer class="gov-footer">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-around; text-align: left; margin-bottom: 20px; border-bottom: 1px dashed rgba(255,255,255,0.3); padding-bottom: 20px;">
            <div style="flex: 1; min-width: 250px; margin-bottom: 15px;">
                <h4 style="color: #FFFFCC; border-bottom: 1px solid var(--gov-orange); padding-bottom: 5px; margin-bottom: 10px;">Contact Us</h4>
                <p style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #EEE;">
                    <strong>Michael Madhusudan Memorial College</strong><br>
                    Kabiguru Sarani, City Center,<br>
                    Durgapur – 713216, West Bengal<br>
                    <strong>Phone :</strong> 0343 2566700<br>
                    <strong>E-Mail :</strong> <a href="mailto:contact.mmmc@gmail.com" style="color: #FFFFCC;">contact.mmmc@gmail.com</a>
                </p>
            </div>
            
            <div style="flex: 1; min-width: 250px; margin-bottom: 15px;">
                <h4 style="color: #FFFFCC; border-bottom: 1px solid var(--gov-orange); padding-bottom: 5px; margin-bottom: 10px;">External Resources</h4>
                <ul style="list-style: none; font-size: 12px; line-height: 2;">
                    <li><a href="http://www.mmmc.ac.in/" target="_blank">&raquo; Michael Madhusudan Memorial College</a></li>
                    <li><a href="https://www.knu.ac.in/" target="_blank">&raquo; Kazi Nazrul University (KNU)</a></li>
                    <li><a href="https://wbcap.in/" target="_blank">&raquo; WBCAP Admission Portal</a></li>
                    <li><a href="https://banglaruchchashiksha.wb.gov.in/" target="_blank">&raquo; Higher Education Dept, West Bengal</a></li>
                </ul>
            </div>
        </div>

        <p>
            &copy; 2026 Central Library, Michael Madhusudan Memorial College. All Rights Reserved.<br>
            Under Kazi Nazrul University Guidelines.
        </p>
        <p style="color: #DDD; font-size: 11px; margin-top: 5px;">
            Designed and Developed by <strong style="color:#FFFFCC;">National Informatics Centre (NIC)</strong>.
        </p>
        <div>
            <div class="visitor-counter">
                VISITOR COUNT: <span id="visitor-val">0000000</span>
            </div>
        </div>
        <div class="nic-logo">
            e-Granthalaya v4.0 Library Management Portal Server
        </div>
    </footer>
`;

const SIDEBAR_HTML = `
    <!-- Sidebar for Admin Operations -->
    <div id="sidebar-admin-list" class="hidden">
        <h3>Admin Control Desk</h3>
        <ul class="sidebar-menu">
            <li><a href="admin_home.html" id="side-admin-home">Admin Home Dashboard</a></li>
            <li><a href="admin_add_book.html" id="side-admin-add">Add New Book (Catalog)</a></li>
            <li><a href="admin_issue_book.html" id="side-admin-issue">Issue Book to Student</a></li>
            <li><a href="admin_list_books.html" id="side-admin-list">View Complete Catalogue</a></li>
            <li><a href="admin_requisitions.html" id="side-admin-req">Pending Book Requisitions</a></li>
            <li><a href="admin_return_book.html" id="side-admin-return">Return / Collect Book</a></li>
        </ul>
    </div>

    <!-- Sidebar for Student Operations -->
    <div id="sidebar-student-list" class="hidden">
        <h3>Student Portal</h3>
        <ul class="sidebar-menu">
            <li><a href="student_dashboard.html" id="side-student-dash">Student Dashboard</a></li>
            <li><a href="student_list_books.html" id="side-student-list">Browse & Request Books</a></li>
            <li><a href="student_request_book.html" id="side-student-req">Manual Requisition Form</a></li>
            <li><a href="rules_agreement.html" id="side-student-rules">View Rules Agreement</a></li>
        </ul>
    </div>

    <!-- Collapsible Sidebar Menu: General Links (Formerly Institutional Links) -->
    <div class="sidebar-collapsible" id="collapsible-general-links">
        <div class="sidebar-collapsible-header" onclick="toggleSidebarSection('collapsible-general-links')">
            <span>General Links</span>
            <span class="toggle-icon">▼</span>
        </div>
        <ul class="sidebar-menu">
            <li><a href="http://www.mmmc.ac.in/" target="_blank">&raquo; MMMC College Website</a></li>
            <li><a href="https://wbcap.in/" target="_blank">&raquo; WBCAP Portal</a></li>
            <li><a href="https://www.knu.ac.in/" target="_blank">&raquo; Kazi Nazrul University</a></li>
        </ul>
    </div>

    <!-- Portal Information Box -->
    <div class="portal-info-box">
        <h4>System Information</h4>
        <p style="font-size: 11px; color:#555; line-height: 1.3;">
            This Library Portal is automated under the West Bengal State e-Granthalaya program.
        </p>
        <div style="margin-top: 10px; font-size: 11px; text-align: center; color: #AA0000; font-weight: bold;">
            Server Status: ONLINE
        </div>
    </div>
`;

// Collapsible Toggle Function
function toggleSidebarSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle("collapsed");
        // Save state of collapse in localStorage so it persists
        const isCollapsed = el.classList.contains("collapsed");
        localStorage.setItem(`sidebar_collapsed_${id}`, isCollapsed);
    }
}

// Perform injection and sync navbar links active class
function renderLayout() {
    // 1. Inject Header
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = HEADER_HTML;
    }

    // 2. Inject Footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = FOOTER_HTML;
        
        // Sync Visitor Counter
        const counterEl = document.getElementById("visitor-val");
        if (counterEl) {
            let count = localStorage.getItem("lib_visitor_count") || "12548";
            counterEl.textContent = count.toString().padStart(7, '0');
        }
    }

    // 3. Inject Sidebar
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    if (sidebarPlaceholder) {
        sidebarPlaceholder.innerHTML = SIDEBAR_HTML;
        
        // Restore collapse state
        const linksCollapseState = localStorage.getItem("sidebar_collapsed_collapsible-general-links");
        if (linksCollapseState === "true") {
            document.getElementById("collapsible-general-links")?.classList.add("collapsed");
        }
    }

    // 4. Sync User Session info (Header/Sidebar panels)
    syncUserSessionUI();

    // 5. Highlight active navigation links based on URL path
    highlightActiveLinks();
}

function syncUserSessionUI() {
    const currentUser = JSON.parse(localStorage.getItem("lib_current_user"));
    const loggedInUserInfo = document.getElementById("logged-in-user-info");
    const sidebarAdminList = document.getElementById("sidebar-admin-list");
    const sidebarStudentList = document.getElementById("sidebar-student-list");

    if (currentUser) {
        if (loggedInUserInfo) {
            loggedInUserInfo.classList.remove("hidden");
            const nameEl = document.getElementById("user-display-name");
            const roleEl = document.getElementById("user-display-role");
            if (nameEl) nameEl.textContent = currentUser.name || "Administrator";
            if (roleEl) roleEl.textContent = currentUser.role === "admin" ? "Admin" : "Student";
        }
        
        if (currentUser.role === "admin") {
            if (sidebarAdminList) sidebarAdminList.classList.remove("hidden");
            if (sidebarStudentList) sidebarStudentList.classList.add("hidden");
        } else {
            if (sidebarAdminList) sidebarAdminList.classList.add("hidden");
            if (sidebarStudentList) sidebarStudentList.classList.remove("hidden");
        }
    } else {
        if (loggedInUserInfo) loggedInUserInfo.classList.add("hidden");
        if (sidebarAdminList) sidebarAdminList.classList.add("hidden");
        if (sidebarStudentList) sidebarStudentList.classList.add("hidden");
    }
}

function triggerLogout() {
    localStorage.removeItem("lib_current_user");
    alert("You have been successfully logged out.");
    location.href = "index.html";
}

function highlightActiveLinks() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);

    // Clear active classes
    document.querySelectorAll(".nav-menu button").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".sidebar-menu a").forEach(a => a.classList.remove("active"));

    // Activate Nav Buttons
    if (filename === "index.html" || filename === "") {
        document.getElementById("nav-btn-home")?.classList.add("active");
        document.getElementById("side-gen-home")?.classList.add("active");
    } else if (filename === "rules_agreement.html") {
        document.getElementById("nav-btn-rules")?.classList.add("active");
        document.getElementById("side-gen-rules")?.classList.add("active");
        document.getElementById("side-student-rules")?.classList.add("active");
    } else if (filename.startsWith("student_")) {
        document.getElementById("nav-btn-student")?.classList.add("active");
        if (filename === "student_login.html") {
            document.getElementById("side-gen-login")?.classList.add("active");
        } else if (filename === "student_dashboard.html") {
            document.getElementById("side-student-dash")?.classList.add("active");
        } else if (filename === "student_list_books.html") {
            document.getElementById("side-student-list")?.classList.add("active");
        } else if (filename === "student_request_book.html") {
            document.getElementById("side-student-req")?.classList.add("active");
        }
    } else if (filename.startsWith("admin_")) {
        document.getElementById("nav-btn-admin")?.classList.add("active");
        if (filename === "admin_login.html") {
            document.getElementById("side-gen-admin")?.classList.add("active");
        } else if (filename === "admin_home.html") {
            document.getElementById("side-admin-home")?.classList.add("active");
        } else if (filename === "admin_add_book.html") {
            document.getElementById("side-admin-add")?.classList.add("active");
        } else if (filename === "admin_issue_book.html") {
            document.getElementById("side-admin-issue")?.classList.add("active");
        } else if (filename === "admin_list_books.html") {
            document.getElementById("side-admin-list")?.classList.add("active");
        } else if (filename === "admin_requisitions.html") {
            document.getElementById("side-admin-req")?.classList.add("active");
        } else if (filename === "admin_return_book.html") {
            document.getElementById("side-admin-return")?.classList.add("active");
        }
    } else if (filename === "student_register.html") {
        document.getElementById("nav-btn-student")?.classList.add("active");
        document.getElementById("side-gen-reg")?.classList.add("active");
    } else if (filename === "contact_us.html") {
        document.getElementById("nav-btn-contact")?.classList.add("active");
        document.getElementById("side-gen-contact")?.classList.add("active");
    }
}

// Initialise layout on DOM load
document.addEventListener("DOMContentLoaded", renderLayout);
