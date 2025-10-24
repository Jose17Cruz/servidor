const toggleText = document.getElementById('toggleText');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('form-title');
const box = document.getElementById('form-box');

toggleText.addEventListener('click', () => {
  box.classList.add('fadeOut');
  setTimeout(() => {
    const showingLogin = loginForm.style.display !== 'none';
    loginForm.style.display = showingLogin ? 'none' : 'block';
    registerForm.style.display = showingLogin ? 'block' : 'none';
    formTitle.textContent = showingLogin ? 'Registrar Cuenta' : 'Iniciar Sesión';
    toggleText.textContent = showingLogin ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate';
    box.classList.remove('fadeOut');
  }, 500);
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new URLSearchParams(new FormData(loginForm));
  const res = await fetch('/login', { method: 'POST', body: data });
  const msg = await res.text();
  if (msg === 'success') window.location.href = 'dashboard.html';
  else alert(msg);
});

registerForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new URLSearchParams(new FormData(registerForm));
  const res = await fetch('/register', { method: 'POST', body: data });
  const msg = await res.text();
  alert(msg);
});
