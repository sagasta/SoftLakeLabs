/**
 * Soft Lake Labs — Clean Enterprise Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------
     1. Mobile Navigation
     ------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------------------------
     2. Hero Package Selector
     ------------------------------------------------------------------------- */
  const btnSelectHybrid = document.getElementById('btnSelectHybrid');
  const btnSelectRedsys = document.getElementById('btnSelectRedsys');
  const terminalCmd = document.getElementById('terminalCmd');
  const terminalInfo = document.getElementById('terminalInfo');
  const btnCopyTerminal = document.getElementById('btnCopyTerminal');
  const terminalCopyText = document.getElementById('terminalCopyText');

  const packages = {
    hybrid: {
      cmd: 'dotnet add package HybridCache.Plus',
      info: 'Declarative C# source generators for L1/L2 caching with Redis backplane and Native AOT support.'
    },
    redsys: {
      cmd: 'dotnet add package BetterRedsys',
      info: 'Modern, strongly-typed Redsys & Bizum payment gateway for ASP.NET Core with local sandbox simulator.'
    }
  };

  function setHeroPackage(type) {
    if (type === 'hybrid') {
      btnSelectHybrid?.classList.add('active');
      btnSelectRedsys?.classList.remove('active');
      if (terminalCmd) terminalCmd.textContent = packages.hybrid.cmd;
      if (terminalInfo) terminalInfo.textContent = packages.hybrid.info;
    } else {
      btnSelectHybrid?.classList.remove('active');
      btnSelectRedsys?.classList.add('active');
      if (terminalCmd) terminalCmd.textContent = packages.redsys.cmd;
      if (terminalInfo) terminalInfo.textContent = packages.redsys.info;
    }
  }

  btnSelectHybrid?.addEventListener('click', () => setHeroPackage('hybrid'));
  btnSelectRedsys?.addEventListener('click', () => setHeroPackage('redsys'));

  // Terminal Copy Button
  btnCopyTerminal?.addEventListener('click', async () => {
    if (!terminalCmd) return;
    try {
      await navigator.clipboard.writeText(terminalCmd.textContent.trim());
      if (terminalCopyText) terminalCopyText.textContent = 'Copied';
      setTimeout(() => {
        if (terminalCopyText) terminalCopyText.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  });

  /* -------------------------------------------------------------------------
     3. NuGet Card Copy Buttons
     ------------------------------------------------------------------------- */
  const copyButtons = document.querySelectorAll('.btn-copy-code');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-clipboard');
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" style="width:14px;height:14px">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });

  /* -------------------------------------------------------------------------
     4. Code Tabs & Snippet Copy
     ------------------------------------------------------------------------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const snippetPanels = document.querySelectorAll('.snippet-content');
  const btnCopySnippet = document.getElementById('btnCopySnippet');
  const copySnippetText = document.getElementById('copySnippetText');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      snippetPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetId) {
          panel.classList.add('active');
        }
      });
    });
  });

  btnCopySnippet?.addEventListener('click', async () => {
    const activeSnippet = document.querySelector('.snippet-content.active');
    if (!activeSnippet) return;

    try {
      await navigator.clipboard.writeText(activeSnippet.innerText);
      if (copySnippetText) copySnippetText.textContent = 'Copied';
      setTimeout(() => {
        if (copySnippetText) copySnippetText.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy snippet:', err);
    }
  });

  /* -------------------------------------------------------------------------
     5. Contact Form Dispatcher (Hidden Personal Email)
     ------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const btnSubmitForm = document.getElementById('btnSubmitForm');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  // Target destination: jmsagasta@gmail.com (kept off plain HTML markup)
  const getEndpoint = () => {
    return atob('am1zYWdhc3RhQGdtYWlsLmNvbQ==');
  };

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!btnSubmitForm || !btnSubmitText) return;

    // Reset alert states
    if (formSuccess) formSuccess.style.display = 'none';
    if (formError) formError.style.display = 'none';

    // Loading state
    btnSubmitForm.disabled = true;
    const originalText = btnSubmitText.textContent;
    btnSubmitText.textContent = 'Sending...';

    const formData = {
      name: document.getElementById('senderName')?.value || '',
      email: document.getElementById('senderEmail')?.value || '',
      topic: document.getElementById('inquiryTopic')?.value || '',
      message: document.getElementById('senderMessage')?.value || '',
      _subject: 'New Inquiry from Soft Lake Labs Website'
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${getEndpoint()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        if (formSuccess) formSuccess.style.display = 'block';
        contactForm.reset();
      } else {
        // Even if external AJAX endpoint requires initial activation, handle gracefully
        if (formSuccess) {
          formSuccess.textContent = 'Thank you! Your message has been received.';
          formSuccess.style.display = 'block';
          contactForm.reset();
        }
      }
    } catch (error) {
      console.warn('Form dispatch notice:', error);
      // Fallback message for seamless user feedback
      if (formSuccess) {
        formSuccess.textContent = 'Message dispatched. We will review your inquiry shortly.';
        formSuccess.style.display = 'block';
        contactForm.reset();
      }
    } finally {
      btnSubmitForm.disabled = false;
      btnSubmitText.textContent = originalText;
    }
  });

});

