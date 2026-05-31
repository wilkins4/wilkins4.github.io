(() => {
  const copyWithFallback = (email) => {
    const field = document.createElement("textarea");
    field.value = email;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    field.style.top = "-9999px";
    field.style.fontSize = "16px";
    document.body.appendChild(field);
    field.focus();
    field.select();
    field.setSelectionRange(0, email.length);
    const copied = document.execCommand("copy");
    field.remove();

    if (!copied) {
      throw new Error("Copy command failed");
    }
  };

  const copyEmail = async (email) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        return;
      } catch {
        copyWithFallback(email);
        return;
      }
    }

    copyWithFallback(email);
  };

  document.querySelectorAll("[data-copy-email]").forEach((copyButton) => {
    const feedbackId = copyButton.getAttribute("aria-describedby");
    const feedback = feedbackId ? document.getElementById(feedbackId) : null;
    const originalLabel = copyButton.textContent;
    let feedbackTimeout;

    const setFeedback = (message) => {
      if (feedback) {
        feedback.textContent = message;
      }

      window.clearTimeout(feedbackTimeout);
      feedbackTimeout = window.setTimeout(() => {
        if (feedback) {
          feedback.textContent = "";
        }

        copyButton.textContent = originalLabel;
      }, 2800);
    };

    copyButton.addEventListener("click", async () => {
      const email = copyButton.dataset.copyEmail;

      try {
        await copyEmail(email);
        copyButton.textContent = "Copied";
        setFeedback("Email copied");
      } catch {
        setFeedback(email);
      }
    });
  });
})();
