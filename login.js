// small script to switch tabs and handle demo form submits
document.addEventListener('DOMContentLoaded', function(){
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false') });
            tab.classList.add('active'); tab.setAttribute('aria-selected','true');

            panels.forEach(p => {
                if(p.id === target){ p.classList.add('active'); p.setAttribute('aria-hidden','false') }
                else { p.classList.remove('active'); p.setAttribute('aria-hidden','true') }
            })
        })
    })

    // (Removed demo alert handlers — real handlers are defined below)
});

// Simple client-side auth using localStorage (demo only — not secure)
function getUsers(){
    try{ return JSON.parse(localStorage.getItem('th_users')||'{}') }catch(e){ return {} }
}

function saveUsers(u){ localStorage.setItem('th_users', JSON.stringify(u)) }

// Register handler
const regForm = document.getElementById('register-form');
if (regForm){
    regForm.addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const pwd = document.getElementById('reg-password').value;
        const msg = regForm.querySelector('.form-msg');

        if(!email || !pwd){ msg.textContent = 'Please fill required fields'; return }

        const users = getUsers();
        if(users[email]){ msg.textContent = 'Email already registered'; return }

        users[email] = { name, password: pwd };
        saveUsers(users);
        msg.textContent = 'Registration successful — you can now login';
        msg.classList.add('success');
        setTimeout(()=>{
            // switch to login tab
            document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
            const loginTab = document.querySelector('.tab[data-tab="login"]');
            if(loginTab){ loginTab.classList.add('active'); }
            document.querySelectorAll('.tab-content').forEach(p=>p.classList.remove('active'));
            const loginPanel = document.getElementById('login');
            if(loginPanel){ loginPanel.classList.add('active') }
        },800);
    });
}

// Login handler — only succeeds when user exists with matching password
const lForm = document.getElementById('login-form');
if (lForm){
    lForm.addEventListener('submit', function(e){
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const pwd = document.getElementById('login-password').value;
        const msg = lForm.querySelector('.form-msg');

        const users = getUsers();
        if(!users[email]){ msg.textContent = 'No account found for this email. Please register first.'; return }
        if(users[email].password !== pwd){ msg.textContent = 'Incorrect password'; return }

        // success: set a simple flag and redirect to index.html
        localStorage.setItem('th_current_user', email);
        msg.textContent = 'Login successful — redirecting...';
        msg.classList.add('success');
        setTimeout(()=> window.location.href = './index.html', 900);
    })
}

// Forgot handler: just check if email exists
const fForm = document.getElementById('forgot-form');
if (fForm){
    fForm.addEventListener('submit', function(e){
        e.preventDefault();
        const email = document.getElementById('forgot-email').value.trim().toLowerCase();
        const msg = fForm.querySelector('.form-msg');
        const users = getUsers();
        if(!users[email]){ msg.textContent = 'No account found for this email'; return }
        msg.textContent = 'If this email is registered, a reset link has been sent (demo)';
        msg.classList.add('success');
    })
}
