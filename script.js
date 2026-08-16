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

  // 4. Interactive How to Play Tabs
  const tabBtns = document.querySelectorAll('.htp-tab-btn');
  const tabPanes = document.querySelectorAll('.htp-tab-content');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach(pane => pane.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const activePane = document.getElementById(targetTab);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  }

  // 6. Interactive Playable Pathfinding Simulator in How to Play
  const simGrid = document.getElementById('pathSimGrid');
  const simProgressText = document.getElementById('simProgressText');
  const simProgressFill = document.getElementById('simProgressFill');
  const simFeedback = document.getElementById('simFeedback');
  const simUndoBtn = document.getElementById('simUndoBtn');
  const simResetBtn = document.getElementById('simResetBtn');
  const simAutoSolveBtn = document.getElementById('simAutoSolveBtn');

  if (simGrid) {
    // 3x3 Grid Definition
    const gridLayout = [
      { id: 0, type: 'start', icon: '🟢', label: 'Start' },
      { id: 1, type: 'arrow', icon: '➡️', label: 'Right' },
      { id: 2, type: 'arrow', icon: '⬇️', label: 'Down' },
      { id: 3, type: 'arrow', icon: '➡️', label: 'Right' },
      { id: 4, type: 'exit',  icon: '🏁', label: 'Exit' },
      { id: 5, type: 'arrow', icon: '⬇️', label: 'Down' },
      { id: 6, type: 'arrow', icon: '⬆️', label: 'Up' },
      { id: 7, type: 'arrow', icon: '⬅️', label: 'Left' },
      { id: 8, type: 'arrow', icon: '⬅️', label: 'Left' }
    ];

    // Adjacency Graph (Orthogonal: Up, Down, Left, Right)
    const adjGraph = {
      0: [1, 3],
      1: [0, 2, 4],
      2: [1, 5],
      3: [0, 4, 6],
      4: [1, 3, 5, 7],
      5: [2, 4, 8],
      6: [3, 7],
      7: [6, 4, 8],
      8: [5, 7]
    };

    // Guaranteed Hamiltonian continuous path solution
    const solutionPath = [0, 1, 2, 5, 8, 7, 6, 3, 4];

    let currentPath = [0];
    let autoSolveTimer = null;

    const updateSimUI = (feedbackMsg, isError = false) => {
      const totalTiles = gridLayout.length;
      const count = currentPath.length;
      const pct = Math.round((count / totalTiles) * 100);

      if (simProgressText) simProgressText.textContent = `${count} / ${totalTiles} Cells (${pct}%)`;
      if (simProgressFill) simProgressFill.style.width = `${pct}%`;

      if (simFeedback && feedbackMsg) {
        simFeedback.textContent = feedbackMsg;
        simFeedback.style.color = isError ? 'var(--color-rose)' : 'var(--color-cyan)';
      }

      // Render tiles
      const tileEls = simGrid.querySelectorAll('.sim-tile');
      tileEls.forEach((el, idx) => {
        const pathIndex = currentPath.indexOf(idx);
        const stepNumEl = el.querySelector('.tile-step-num');

        if (pathIndex !== -1) {
          el.classList.add('visited');
          if (stepNumEl) stepNumEl.textContent = `#${pathIndex + 1}`;
        } else {
          el.classList.remove('visited');
          if (stepNumEl) stepNumEl.textContent = '';
        }

        // Highlight head
        if (currentPath[currentPath.length - 1] === idx) {
          el.classList.add('current-head');
        } else {
          el.classList.remove('current-head');
        }
      });
    };

    const handleTileClick = (targetId) => {
      if (autoSolveTimer) {
        clearInterval(autoSolveTimer);
        autoSolveTimer = null;
      }

      const currentHead = currentPath[currentPath.length - 1];

      // If already current head
      if (targetId === currentHead) return;

      // If clicked previous step -> Undo to it
      if (currentPath.length > 1 && targetId === currentPath[currentPath.length - 2]) {
        currentPath.pop();
        updateSimUI('Step undone. Choose next adjacent tile.');
        return;
      }

      // Check if already visited elsewhere
      if (currentPath.includes(targetId)) {
        updateSimUI('⚠️ Tile already visited! No crossing allowed.', true);
        return;
      }

      // Check adjacency
      const validNeighbors = adjGraph[currentHead] || [];
      if (!validNeighbors.includes(targetId)) {
        updateSimUI('⚠️ Must move to adjacent horizontal or vertical cell!', true);
        return;
      }

      // Check if target is exit but not all tiles visited
      if (gridLayout[targetId].type === 'exit' && currentPath.length < gridLayout.length - 1) {
        updateSimUI('⚠️ Cannot enter Exit yet! Fill 100% of the board first.', true);
        return;
      }

      // Valid move
      currentPath.push(targetId);

      if (currentPath.length === gridLayout.length) {
        updateSimUI('🎉 100% Complete! Connected Start to Exit! ⭐⭐⭐ 3 Stars!');
      } else {
        updateSimUI(`Step ${currentPath.length} drawn. Keep connecting!`);
      }
    };

    const initSim = () => {
      currentPath = [0];
      simGrid.innerHTML = '';

      gridLayout.forEach((item, idx) => {
        const tile = document.createElement('div');
        tile.className = `sim-tile ${item.type === 'start' ? 'start-tile' : item.type === 'exit' ? 'exit-tile' : ''}`;
        tile.setAttribute('data-id', item.id);
        tile.setAttribute('role', 'button');
        tile.setAttribute('tabindex', '0');
        tile.setAttribute('aria-label', `${item.label} cell`);
        tile.innerHTML = `
          <span class="tile-icon">${item.icon}</span>
          <span class="tile-step-num"></span>
        `;

        tile.addEventListener('click', () => handleTileClick(idx));
        tile.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTileClick(idx);
          }
        });

        simGrid.appendChild(tile);
      });

      updateSimUI('Tap adjacent tiles from 🟢 Start to fill all cells and reach 🏁 Exit!');
    };

    initSim();

    if (simUndoBtn) {
      simUndoBtn.addEventListener('click', () => {
        if (currentPath.length > 1) {
          currentPath.pop();
          updateSimUI('Step undone.');
        }
      });
    }

    if (simResetBtn) {
      simResetBtn.addEventListener('click', () => {
        if (autoSolveTimer) {
          clearInterval(autoSolveTimer);
          autoSolveTimer = null;
        }
        currentPath = [0];
        updateSimUI('Board reset to 🟢 Start. Try drawing the path!');
      });
    }

    if (simAutoSolveBtn) {
      simAutoSolveBtn.addEventListener('click', () => {
        if (autoSolveTimer) {
          clearInterval(autoSolveTimer);
        }
        currentPath = [0];
        updateSimUI('Demonstrating continuous flow path...');
        let stepIdx = 1;

        autoSolveTimer = setInterval(() => {
          if (stepIdx < solutionPath.length) {
            currentPath.push(solutionPath[stepIdx]);
            stepIdx++;
            if (currentPath.length === solutionPath.length) {
              updateSimUI('🎉 Perfect 100% path from 🟢 Start to 🏁 Exit!');
              clearInterval(autoSolveTimer);
              autoSolveTimer = null;
            } else {
              updateSimUI(`Auto-drawing step ${currentPath.length} of ${solutionPath.length}...`);
            }
          }
        }, 400);
      });
    }
  }

  // 6. Interactive Board Elements Inspector (Tab 3)
  const elemTiles = document.querySelectorAll('.elem-board-tile, .elem-tile');
  const elemCards = document.querySelectorAll('.element-showcase-card, .element-detail-card');
  const inspectorHeader = document.getElementById('inspectorHeader');
  const inspectorDesc = document.getElementById('inspectorDesc');

  const elementInfoMap = {
    start: {
      icon: '🟢',
      title: 'Start Cell (Path Origin)',
      tag: 'Origin Anchor',
      desc: 'The designated emerald origin beacon. Your unbroken path always begins here. Once you move away from the start cell, you cannot step on it again.'
    },
    arrow: {
      icon: '➡️',
      title: 'Arrow Directional Flow Indicators',
      tag: 'Directional Cue',
      desc: 'Strategic indicators embedded across the grid. They orient your path and help you spot forced moves, loops, and corners early.'
    },
    obstacle: {
      icon: '⬛',
      title: 'Grid Obstacles & Inactive Voids',
      tag: 'Impassable Barrier',
      desc: 'Dark blocked or void cells that cannot be entered. They shape intricate labyrinth corridors, bottlenecks, and force strategic path turns.'
    },
    exit: {
      icon: '🏁',
      title: 'Exit Cell (Final Finish Target)',
      tag: 'Destination Goal',
      desc: 'The final destination marked with a golden flag. You must visit 100% of all valid arrow cells on the board before stepping into the Exit.'
    },
    trail: {
      icon: '✨',
      title: 'Radiant Neon Flow Trail',
      tag: 'Visual FX / Shop',
      desc: 'The dynamic glowing trail that traces your swipe trajectory across the board in real time. Can be customized with unlockable colors in the Coin Shop.'
    },
    hint: {
      icon: '💡',
      title: 'Dynamic Hint Spotlight',
      tag: 'Smart Assistance',
      desc: 'Highlights the single guaranteed optimal next move when requested via coins or rewarded video, preventing game-ending dead-ends.'
    }
  };

  const selectBoardElement = (type) => {
    if (!elementInfoMap[type]) return;

    // Highlight tiles
    elemTiles.forEach(tile => {
      if (tile.getAttribute('data-type') === type) {
        tile.classList.add('elem-highlighted');
      } else {
        tile.classList.remove('elem-highlighted');
      }
    });

    // Highlight cards
    elemCards.forEach(card => {
      if (card.getAttribute('data-type') === type) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update inspector panel
    if (inspectorHeader && inspectorDesc) {
      const data = elementInfoMap[type];
      inspectorHeader.innerHTML = `<span>${data.icon}</span> <span>${data.title}</span>`;
      inspectorDesc.textContent = data.desc;
    }
  };

  if (elemTiles.length > 0 || elemCards.length > 0) {
    elemTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        const type = tile.getAttribute('data-type');
        selectBoardElement(type);
      });
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const type = tile.getAttribute('data-type');
          selectBoardElement(type);
        }
      });
    });

    elemCards.forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-type');
        selectBoardElement(type);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const type = card.getAttribute('data-type');
          selectBoardElement(type);
        }
      });
    });
  }

  // 7. Copy Support Info Template (Contact Page)
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

  // 7. Smooth Scroll with Sticky Header Offset for Anchor Links
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

  // 8. ScrollSpy for Active Navigation Link Highlighting on Homepage
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-menu a.nav-link');

  if (sections.length > 0 && navLinkItems.length > 0 && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/'))) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinkItems.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}` || href === `./index.html#${currentId}`) {
              navLinkItems.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // 9. Reusable Screenshots & Gallery Interactive Slide Carousel
  const initSliders = () => {
    const sliderWrappers = document.querySelectorAll('.screenshots-slider-wrapper');
    sliderWrappers.forEach((wrapper) => {
      const sliderViewport = wrapper.querySelector('.screenshots-viewport');
      const sliderTrack = wrapper.querySelector('.screenshots-slider-track');
      const prevBtn = wrapper.querySelector('.slider-prev-btn') || wrapper.parentElement.querySelector('.slider-prev-btn');
      const nextBtn = wrapper.querySelector('.slider-next-btn') || wrapper.parentElement.querySelector('.slider-next-btn');
      const parentSection = wrapper.closest('section') || wrapper.parentElement;
      const dotsContainer = parentSection ? parentSection.querySelector('.slider-dots') : null;
      const counterBadge = parentSection ? parentSection.querySelector('.slider-counter-badge') : null;

      if (!sliderViewport || !sliderTrack) return;

      const slides = Array.from(sliderTrack.querySelectorAll('.screenshot-slide'));
      const totalSlides = slides.length;
      if (totalSlides === 0) return;
      let currentIndex = 0;

      // Create dot indicators
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
          dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
          dot.addEventListener('click', () => {
            goToSlide(idx);
          });
          dotsContainer.appendChild(dot);
        });
      }

      const updateSliderUI = (index) => {
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        
        // Update active slide class
        slides.forEach((slide, idx) => {
          if (idx === currentIndex) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });

        // Update dots
        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.slider-dot');
          dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }

        // Update counter badge
        if (counterBadge) {
          counterBadge.textContent = `${currentIndex + 1} / ${totalSlides}`;
        }
      };

      const goToSlide = (index) => {
        if (index < 0 || index >= totalSlides) return;
        const targetSlide = slides[index];
        if (targetSlide) {
          const scrollLeft = targetSlide.offsetLeft - (sliderViewport.clientWidth - targetSlide.clientWidth) / 2;
          sliderViewport.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth'
          });
          updateSliderUI(index);
        }
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const nextIdx = (currentIndex - 1 + totalSlides) % totalSlides;
          goToSlide(nextIdx);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const nextIdx = (currentIndex + 1) % totalSlides;
          goToSlide(nextIdx);
        });
      }

      // Update active index on scroll / swipe
      let scrollTimeout;
      sliderViewport.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const viewportCenter = sliderViewport.scrollLeft + sliderViewport.clientWidth / 2;
          let closestIndex = 0;
          let minDistance = Infinity;

          slides.forEach((slide, idx) => {
            const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
            const distance = Math.abs(viewportCenter - slideCenter);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = idx;
            }
          });

          updateSliderUI(closestIndex);
        }, 60);
      }, { passive: true });

      updateSliderUI(0);
    });
  };

  initSliders();

  // 10. About Us Page: Interactive Subnav ScrollSpy & Smooth Jump
  const aboutSubnavLinks = document.querySelectorAll('.about-subnav-link');
  const aboutSections = document.querySelectorAll('main#main-content section[id]');

  if (aboutSubnavLinks.length > 0 && aboutSections.length > 0) {
    const subnavObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          aboutSubnavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              aboutSubnavLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    aboutSections.forEach(sec => subnavObserver.observe(sec));
  }

  // 11. About Us Page: Interactive Tabs Switcher
  const aboutTabBtns = document.querySelectorAll('.about-tab-btn');
  const aboutTabContents = document.querySelectorAll('.about-tab-content');

  if (aboutTabBtns.length > 0) {
    aboutTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-about-tab');
        
        aboutTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        aboutTabContents.forEach(content => content.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  // 12. About Us Page: Interactive Arrow Mechanics Playground
  const arrowTiles = document.querySelectorAll('.arrow-interactive-tile');
  const arrowExplanation = document.getElementById('arrowLogicExplanation');

  const arrowExplanations = {
    right: '<strong>➡️ Right Tile:</strong> Forces path exit to the East. When entering from the left, this tile locks in linear momentum and prevents premature upward or downward branching.',
    down: '<strong>⬇️ Down Tile:</strong> Directs momentum South towards lower board rows. Essential for cascading across multi-tier grid labyrinths without dead-ends.',
    left: '<strong>⬅️ Left Tile:</strong> Diverts trajectory West. Used as a return loop mechanic to weave back into unvisited perimeter columns.',
    up: '<strong>⬆️ Up Tile:</strong> Propels path North toward higher grid quadrants. Crucial for reaching the final top-row Exit tile after clearing all intermediate cells.'
  };

  if (arrowTiles.length > 0 && arrowExplanation) {
    arrowTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        arrowTiles.forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        const dir = tile.getAttribute('data-direction');
        if (arrowExplanations[dir]) {
          arrowExplanation.innerHTML = arrowExplanations[dir];
        }
      });
    });
  }

  // 13. About Us Page: Studio FAQ Accordion
  const faqItems = document.querySelectorAll('.about-faq-item');

  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const btn = item.querySelector('.about-faq-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          
          // Optionally close siblings for single-open accordion feel
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherBtn = otherItem.querySelector('.about-faq-btn');
              if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            }
          });

          item.classList.toggle('active', !isOpen);
          btn.setAttribute('aria-expanded', !isOpen);
        });
      }
    });
  }

  // 14. About Us Page: Copy Studio Email Button
  const copyStudioEmailBtn = document.getElementById('copyStudioEmailBtn');
  const studioCopyToast = document.getElementById('studioCopyToast');

  if (copyStudioEmailBtn && studioCopyToast) {
    copyStudioEmailBtn.addEventListener('click', async () => {
      const email = 'reodevelopers@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        studioCopyToast.textContent = '✓ Studio email copied to clipboard!';
        studioCopyToast.style.opacity = '1';
        copyStudioEmailBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          studioCopyToast.style.opacity = '0';
          copyStudioEmailBtn.textContent = '📋 Copy Email';
        }, 3000);
      } catch (err) {
        window.location.href = `mailto:${email}?subject=Arrow%20Brain%20Puzzle%20Studio%20Inquiry`;
      }
    });
  }
});

