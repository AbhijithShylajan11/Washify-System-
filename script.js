// --- DATABASE (Local Storage & Demo Users) ---
const demoUsers = [
    { user: "abhinav", hostel: "kattakada hostel", room: "105" },
    { user: "arjun", hostel: "city hostel", room: "212" },
    { user: "nikhil", hostel: "green pg", room: "309" },
    { user: "rahul", hostel: "sunrise hostel", room: "118" },
    { user: "anjali", hostel: "lakeview pg", room: "204" },
    { user: "akhil", hostel: "metro hostel", room: "407" },
    { user: "sneha", hostel: "prime pg", room: "302" },
    { user: "vishnu", hostel: "royal hostel", room: "215" }
];

let currentUser = JSON.parse(localStorage.getItem('washify_user')) || null;
let bookings = JSON.parse(localStorage.getItem('washify_bookings')) || [
    { id: 1, user: 'system', machine: 'Machine 1', time: '10:00', code: '8821' },
    { id: 2, user: 'system', machine: 'Machine 2', time: '14:00', code: '4490' }
];

// --- NAVIGATION LOGIC ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);

    if(pageId === 'dashboard') loadDashboard();
}

// --- AUTHENTICATION ---
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('login-user').value.toLowerCase();
    const h = document.getElementById('login-hostel').value.toLowerCase();
    const r = document.getElementById('login-room').value;

    const found = demoUsers.find(user => 
        user.user === u && user.hostel === h && user.room === r
    );

    if(found) {
        currentUser = found;
        localStorage.setItem('washify_user', JSON.stringify(found));
        showPage('dashboard');
    } else {
        document.getElementById('login-error').innerText = "Invalid credentials. Please try again.";
    }
});

function logout() {
    localStorage.removeItem('washify_user');
    currentUser = null;
    showPage('home');
    location.reload();
}

// --- DASHBOARD & BOOKING LOGIC ---
function loadDashboard() {
    if(!currentUser) return showPage('login');

    document.getElementById('dash-user-name').innerText = currentUser.user;
    document.getElementById('dash-hostel').innerText = currentUser.hostel;
    document.getElementById('dash-room').innerText = currentUser.room;

    updateWaterLevel();
    renderHistory();
}

function updateWaterLevel() {
    const levels = [
        { p: '20%', c: '#ff4d4d', t: 'Low - Refill Required', alert: true },
        { p: '55%', c: '#ffcc00', t: 'Medium', alert: false },
        { p: '90%', c: '#00ff88', t: 'High', alert: false }
    ];
    // Picking random level for demo
    const status = levels[Math.floor(Math.random() * levels.length)];
    const bar = document.getElementById('water-bar');
    bar.style.width = status.p;
    bar.style.backgroundColor = status.c;
    document.getElementById('water-text').innerText = `Water Level: ${status.t}`;
    
    const bookBtn = document.getElementById('book-btn');
    if(status.alert) {
        document.getElementById('system-alert').innerText = "⚠️ Booking Disabled: Low Water";
        bookBtn.disabled = true;
        bookBtn.style.opacity = '0.5';
    } else {
        document.getElementById('system-alert').innerText = "";
        bookBtn.disabled = false;
        bookBtn.style.opacity = '1';
    }
}

document.getElementById('book-btn').addEventListener('click', () => {
    const machine = document.getElementById('machine-select').value;
    const time = document.getElementById('slot-time').value;

    if(!time) return alert("Please select a time slot");

    // Check for duplicates
    const exists = bookings.find(b => b.machine === machine && b.time === time);
    if(exists) return alert("This slot is already booked for " + machine);

    const code = Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
        user: currentUser.user,
        machine,
        time,
        code
    };

    bookings.unshift(newBooking);
    localStorage.setItem('washify_bookings', JSON.stringify(bookings));

    // Show Receipt
    document.getElementById('receipt-area').classList.remove('hidden');
    document.getElementById('access-code-display').innerText = code;
    document.getElementById('receipt-time').innerText = `${time} (${machine})`;
    
    renderHistory();
});

function renderHistory() {
    const container = document.getElementById('booking-history');
    container.innerHTML = bookings.map(b => `
        <div class="glass-card" style="margin-bottom:10px; padding:15px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${b.machine}</strong><br>
                <small>${b.time}</small>
            </div>
            <div style="color:var(--neon-blue); font-weight:bold;">CODE: ${b.code}</div>
            <div>${b.user === currentUser.user ? '✅ Yours' : '👤 ' + b.user}</div>
        </div>
    `).join('');
}

// Initial Routing
window.onload = () => {
    if(currentUser) showPage('dashboard');
    else showPage('home');
};
