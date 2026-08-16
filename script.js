/**
 * Arrow Brain Puzzle - Official Website Scripts
 * Zero external dependencies, pure vanilla JavaScript
 * Author: REO Technologies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Auto-update Copyright Year
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });

  // 2. Mobile Navigation Toggle with Accessibility
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      navMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      toggleMenu(!isExpanded);
    });

    // Close on navigation click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
        mobileToggle.focus();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // 3. Header Background on Scroll
  const header = document.querySelector('.header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 4. Interactive Hero Mini Arrow Puzzle
  const miniGrid = document.getElementById('miniArrowGrid');
  const resetBtn = document.getElementById('resetMiniGame');
  const statusText = document.getElementById('puzzleStatus');

  if (miniGrid) {
    const initialBoard = [
      { dir: 'up', icon: 'M12 19V5M5 12l7-7 7 7' },
      { dir: 'right', icon: 'M5 12h14M12 5l7 7-7 7' },
      { dir: 'up', icon: 'M12 19V5M5 12l7-7 7 7' },
      { dir: 'left', icon: 'M19 12H5M12 19l-7-7 7-7' },
      { dir: 'right', icon: 'M5 12h14M12 5l7 7-7 7' },
      { dir: 'down', icon: 'M12 5v14M19 12l-7 7-7-7' },
      { dir: 'left', icon: 'M19 12H5M12 19l-7-7 7-7' },
      { dir: 'down', icon: 'M12 5v14M19 12l-7 7-7-7' },
      { dir: 'right', icon: 'M5 12h14M12 5l7 7-7 7' }
    ];

    let clearedCount = 0;

    const renderBoard = () => {
      clearedCount = 0;
      miniGrid.innerHTML = '';
      if (statusText) statusText.textContent = 'Tap any arrow to launch it!';

      initialBoard.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'mini-arrow-btn';
        btn.setAttribute('data-dir', item.dir);
        btn.setAttribute('aria-label', `Clear arrow pointing ${item.dir}`);
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="${item.icon}" />
          </svg>
        `;

        btn.addEventListener('click', () => {
          if (!btn.classList.contains('cleared')) {
            btn.classList.add('cleared');
            clearedCount++;
            if (statusText) {
              if (clearedCount === initialBoard.length) {
                statusText.textContent = '🎉 Board cleared! Sharp strategic logic!';
                statusText.style.color = 'var(--color-cyan)';
              } else {
                statusText.textContent = `${clearedCount} of ${initialBoard.length} arrows cleared`;
                statusText.style.color = 'var(--text-secondary)';
              }
            }
          }
        });

        miniGrid.appendChild(btn);
      });
    };

    renderBoard();

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        renderBoard();
      });
    }
  }

  // 5. Copy Support Info Template (Contact Page)
  const copyTemplateBtn = document.getElementById('copyTemplateBtn');
  const templateBox = document.getElementById('supportTemplateText');
  const copyFeedback = document.getElementById('copyFeedback');

  if (copyTemplateBtn && templateBox) {
    copyTemplateBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(templateBox.innerText);
        if (copyFeedback) {
          copyFeedback.textContent = '✓ Copied to clipboard!';
          setTimeout(() => {
            copyFeedback.textContent = '';
          }, 3000);
        }
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = templateBox.innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        if (copyFeedback) {
          copyFeedback.textContent = '✓ Copied!';
          setTimeout(() => {
            copyFeedback.textContent = '';
          }, 3000);
        }
      }
    });
  }

  // 6. Smooth Scroll with Sticky Header Offset for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
