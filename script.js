document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const hamburger = document.getElementById("hamburger");

  /* 1. Menu hamburger */
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
    hamburger.textContent = open ? "✕" : "☰";
  };
  hamburger.addEventListener("click", () =>
    setMenu(!nav.classList.contains("open")),
  );

  /* 4. Smooth scroll (trừ chiều cao thanh menu khi ở tablet/mobile) */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-h",
          ),
        ) || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setMenu(false);
    });
  });

  /* 3. Dark / Light mode */
  const themeBtn = document.getElementById("themeToggle");
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
  };
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (_) {}
  applyTheme(
    saved ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  );
  themeBtn.addEventListener("click", () => {
    applyTheme(
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark",
    );
  });

  /* 2. Validate form */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) =>
      !v
        ? "Vui lòng nhập họ tên."
        : v.length < 2
          ? "Họ tên cần ít nhất 2 ký tự."
          : "",
    email: (v) =>
      !v
        ? "Vui lòng nhập email."
        : !emailRegex.test(v)
          ? "Email chưa đúng định dạng (ví dụ: ten@gmail.com)."
          : "",
    message: (v) =>
      !v
        ? "Vui lòng nhập lời nhắn."
        : v.length < 10
          ? "Lời nhắn cần ít nhất 10 ký tự."
          : "",
  };

  const check = (field) => {
    const input = form.elements[field];
    const msg = rules[field](input.value.trim());
    document.getElementById(field + "Error").textContent = msg;
    input.classList.toggle("invalid", Boolean(msg));
    return !msg;
  };

  Object.keys(rules).forEach((f) =>
    form.elements[f].addEventListener("blur", () => check(f)),
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    const valid = Object.keys(rules).map(check).every(Boolean); // chạy hết để hiện mọi lỗi
    if (valid) {
      status.textContent = "Đã gửi lời nhắn. Cảm ơn bạn!";
      form.reset();
    }
  });

  /* 5. Năm hiện tại ở footer */
  document.getElementById("year").textContent = new Date().getFullYear();
});
