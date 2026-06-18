document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll animation
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Simple bar animation
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
  });

  // Close nav menu when clicking any link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // 3. Multi-level product filtering & tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const subTabsContainer = document.getElementById('sub-tabs-container');
  const productsGrid = document.getElementById('products-grid');

  // Load products data
  let activeTab = 'fresh-agri';
  let activeSubTab = 'all';

  function renderSubTabs() {
    subTabsContainer.innerHTML = '';
    const config = subTabsConfig[activeTab];
    if (!config || config.length === 0) {
      subTabsContainer.style.display = 'none';
      return;
    }
    subTabsContainer.style.display = 'flex';

    // Add "All" option if multiple options exist
    const subtabs = ['all', ...config];
    subtabs.forEach(sub => {
      const btn = document.createElement('button');
      btn.className = `sub-tab-btn ${activeSubTab === sub ? 'active' : ''}`;
      // Format text beautifully (e.g. oils-flour to Oils & Flour)
      let displayText = sub.charAt(0).toUpperCase() + sub.slice(1);
      if (sub === 'oils-flour') displayText = 'Oils & Flour';
      
      btn.textContent = displayText;
      btn.addEventListener('click', () => {
        activeSubTab = sub;
        document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts();
      });
      subTabsContainer.appendChild(btn);
    });
  }

  function renderProducts() {
    productsGrid.innerHTML = '';
    
    // Filter matching products
    const filtered = productsData.filter(product => {
      const matchTab = product.category === activeTab;
      const matchSub = activeSubTab === 'all' || product.subCategory === activeSubTab;
      return matchTab && matchSub;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">No products found in this category.</p>';
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      
      // Build specs rows
      let specsRows = '';
      for (const [key, val] of Object.entries(p.specs)) {
        specsRows += `
          <tr>
            <td>${key}</td>
            <td>${val}</td>
          </tr>
        `;
      }

      card.innerHTML = `
        <div class="product-img">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title">${p.title}</h3>
          <p class="product-description">${p.description}</p>
          <table class="product-specs">
            <tbody>
              ${specsRows}
            </tbody>
          </table>
          <div class="product-ctas">
            <button class="btn btn-outline view-details-btn" data-product="${p.title}" style="width: 100%; justify-content: center; display: flex; align-items: center; gap: 8px;">View Details <span style="font-size: 0.9em;">&gt;</span></button>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });

    // Wire-up Details buttons dynamically
    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.dataset.product;
        const product = productsData.find(item => item.title === title);
        if (product) {
          openDetailsModal(product);
        }
      });
    });
  }

  // Handle Tab Switch
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      activeSubTab = 'all';
      renderSubTabs();
      renderProducts();
    });
  });

  // Initialize
  renderSubTabs();
  renderProducts();

  // 4. Modal Windows Controller
  const inquiryModal = document.getElementById('inquiry-modal');
  const detailsModal = document.getElementById('product-details-modal');
  const modalClose = document.querySelector('#inquiry-modal .modal-close');
  const detailsClose = document.getElementById('details-close-btn');
  const inquirySubject = document.getElementById('inquiry-subject');
  const modalForm = document.getElementById('modal-inquiry-form');

   const detailsImg = document.getElementById('details-img');
  const detailsTitle = document.getElementById('details-title');
  const detailsDesc = document.getElementById('details-description');
  const detailsSpecsGrid = document.getElementById('details-specs-grid');
  const detailsTags = document.getElementById('details-tags');
  const detailsQuoteBtn = document.getElementById('details-quote-btn');
  const detailsWhatsappBtn = document.getElementById('details-whatsapp-btn');

  let currentProduct = null;

  function openDetailsModal(product) {
    currentProduct = product;
    detailsImg.src = product.image;
    detailsImg.alt = product.title;
    detailsTitle.textContent = product.title;
    detailsDesc.textContent = product.description;

    // Set WhatsApp inquiry link dynamically
    const whatsappNumber = '919081973308';
    const message = `Hello PVS International, I am interested in requesting a quote for "${product.title}". Please provide more details.`;
    detailsWhatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Generate specs cards
    detailsSpecsGrid.innerHTML = '';
    for (const [key, val] of Object.entries(product.specs)) {
      const card = document.createElement('div');
      card.className = 'spec-card';
      card.innerHTML = `
        <div class="spec-label">${key}</div>
        <div class="spec-value">${val}</div>
      `;
      detailsSpecsGrid.appendChild(card);
    }

    // Generate applications tags dynamically
    detailsTags.innerHTML = '';
    const appsMap = {
      'fresh-agri': ['Fresh Retail', 'Hotels & Restaurants', 'Direct Export', 'Domestic Trade'],
      'grains-beans': ['Food Production', 'Wholesale Packing', 'Milling Industry', 'Global Trade'],
      'dehydrated-veg': ['Food Processing', 'Seasonings & Spices', 'Sauces & Marinades', 'Soups & Rubs'],
      'spices-oils': ['Culinary Use', 'Spice Blending', 'Food Industry', 'Bakery & Oils'],
      'frozen': ['IQF Processing', 'B2B Catering', 'Ice Cream & Desserts', 'Beverages'],
      'rte': ['Ready Meals', 'Retail Pouches', 'Instant Catering', 'Travel Food']
    };
    
    const apps = appsMap[product.category] || ['Food Industry', 'Commercial Catering'];
    apps.forEach(app => {
      const tag = document.createElement('span');
      tag.className = 'details-tag';
      tag.textContent = app;
      detailsTags.appendChild(tag);
    });

    detailsModal.classList.add('active');
  }

  function closeDetailsModal() {
    detailsModal.classList.remove('active');
  }

  function openInquiryModal(productName = '') {
    if (productName) {
      inquirySubject.value = `Inquiry about ${productName}`;
    } else {
      inquirySubject.value = 'General Inquiry';
    }
    inquiryModal.classList.add('active');
  }

  function closeInquiryModal() {
    inquiryModal.classList.remove('active');
    modalForm.reset();
  }

  // Bind quote request from details modal
  detailsQuoteBtn.addEventListener('click', () => {
    closeDetailsModal();
    if (currentProduct) {
      openInquiryModal(currentProduct.title);
    } else {
      openInquiryModal();
    }
  });

  modalClose.addEventListener('click', closeInquiryModal);
  detailsClose.addEventListener('click', closeDetailsModal);

  inquiryModal.addEventListener('click', (e) => {
    if (e.target === inquiryModal) closeInquiryModal();
  });
  detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) closeDetailsModal();
  });

  // Expose global button trigger (e.g. for navbar CTA)
  window.openGeneralInquiry = () => openInquiryModal();

  // 5. Form Submissions
  const toast = document.getElementById('toast');
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const action = form.getAttribute('action');
    if (action && action !== '#') {
      // Live AJAX submission to Formspree
      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          showToast('Thank you! Your message has been sent successfully.');
          form.reset();
          if (form.id === 'modal-inquiry-form') {
            closeInquiryModal();
          }
        } else {
          showToast('Oops! There was a problem submitting your form.');
        }
      })
      .catch(error => {
        showToast('Oops! There was a network issue submitting your form.');
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    } else {
      // Local demo fallback simulation
      setTimeout(() => {
        showToast('Thank you! Your message has been received. We will contact you shortly.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        if (form.id === 'modal-inquiry-form') {
          closeInquiryModal();
        }
      }, 1200);
    }
  };

  document.getElementById('contact-form').addEventListener('submit', handleFormSubmit);
  modalForm.addEventListener('submit', handleFormSubmit);
});

// Category and Subcategory Tab Configuration
const subTabsConfig = {
  'fresh-agri': ['vegetables', 'fruits'],
  'grains-beans': ['grains', 'beans'],
  'dehydrated-veg': ['garlic', 'onion'],
  'spices-oils': ['spices', 'oils-flour', 'honey'],
  'frozen': ['fruits', 'vegetables'],
  'rte': ['gujarati', 'punjabi', 'others']
};

// Full product database from PVS International
const productsData = [
  // --- FRESH AGRICULTURE: VEGETABLES ---
  {
    category: 'fresh-agri',
    subCategory: 'vegetables',
    title: 'Fresh Bell Peppers',
    description: 'Crisp, premium export-grade bell peppers sourced from local sustainable farms.',
    image: 'assets/bell_peppers.png',
    specs: {
      'Shelf Life': '10 - 12 Days',
      'Quality': 'Class A Export',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'vegetables',
    title: 'Fresh Garlic Bulbs',
    description: 'Pungent, high-pungency fresh garlic bulbs sorted and graded for export.',
    image: 'assets/fresh_garlic.png',
    specs: {
      'Shelf Life': '1 Year',
      'Origin': 'Gujarat, India',
      'Packaging': 'Mesh / Carton boxes'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'vegetables',
    title: 'Fresh Green Chilli',
    description: 'Hot green chillies with rich color and intense flavor profile.',
    image: 'assets/green_chillies.png',
    specs: {
      'Shelf Life': 'Depends on Temperature',
      'Pungency': 'Medium to High',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'vegetables',
    title: 'Fresh Lemons',
    description: 'Juicy, premium quality lemons harvested at optimal maturity.',
    image: 'assets/fresh_lemons.png',
    specs: {
      'Shelf Life': '1 Month',
      'Juice Content': '>= 40%',
      'Packaging': 'Ventilated boxes'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'vegetables',
    title: 'Fresh Ginger',
    description: 'Bold, spicy, fresh ginger rhizomes cleaned and processed for shipping.',
    image: 'assets/fresh_ginger.png',
    specs: {
      'Shelf Life': '2 - 3 Months',
      'Type': 'Fresh Cleaned',
      'Packaging': 'Jute / Mesh bags'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'vegetables',
    title: 'Fresh Potatoes',
    description: 'Premium quality table and processing potatoes sourced from trusted fields.',
    image: 'assets/fresh_potatoes.png',
    specs: {
      'Shelf Life': '10 - 12 Days',
      'Variety': 'Jyoti / Pukhraj',
      'Packaging': 'Jute bags'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'vegetables',
    title: 'Fresh Onions',
    description: 'Robust red and pink onions harvested at full maturity.',
    image: 'assets/fresh_onions.png',
    specs: {
      'Shelf Life': '4 - 6 Months',
      'Size': '55mm+',
      'Packaging': 'Mesh bags'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'vegetables',
    title: 'Fresh Moringa / Drumstick',
    description: 'Tender and nutritious drumsticks packed fresh for export.',
    image: 'assets/fresh_moringa.png',
    specs: {
      'Shelf Life': '7 - 8 Days',
      'Length': '45 - 60 cm',
      'Packaging': 'Corrugated boxes'
    }
  },

  // --- FRESH AGRICULTURE: FRUITS ---
  {
    category: 'fresh-agri',
    subCategory: 'fruits',
    title: 'Premium Apples',
    description: 'Sweet and crunchy apples selected from certified orchards.',
    image: 'assets/fresh_apples.png',
    specs: {
      'Shelf Life': '3 - 4 Weeks',
      'Origin': 'India',
      'Packaging': 'Ventilated cartons'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'fruits',
    title: 'Sweet Oranges',
    description: 'Citrusy, sweet oranges rich in Vitamin C.',
    image: 'assets/fresh_oranges.png',
    specs: {
      'Shelf Life': '1 Week',
      'Juice Yield': 'High',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'fruits',
    title: 'Queen Pineapples',
    description: 'Tropical aromatic sweet pineapples harvested fresh.',
    image: 'assets/fresh_pineapples.png',
    specs: {
      'Shelf Life': '1 Week',
      'Weight': '1.2 - 2.0 kg',
      'Packaging': 'Wood crates / Box'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'fruits',
    title: 'Table Grapes',
    description: 'Crisp green seedless table grapes, packed to preserve freshness.',
    image: 'assets/table_grapes.png',
    specs: {
      'Shelf Life': '4 - 5 Days',
      'Type': 'Seedless',
      'Packaging': 'Pouch / Cartons'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'fruits',
    title: 'Fresh Pomegranate',
    description: 'Deep red, juicy aril pomegranates sorted for premium export grading.',
    image: 'assets/fresh_pomegranate.png',
    specs: {
      'Shelf Life': '10 - 12 Days',
      'Grade': 'Super A Grade',
      'Packaging': 'Corrugated boxes'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'fruits',
    title: 'Fresh Mangoes',
    description: 'Sweet, aromatic premium mangoes (Alphonso / Kesar) selected at optimal ripeness.',
    image: 'assets/fresh_mangoes.png',
    specs: {
      'Shelf Life': '8 - 10 Days',
      'Harvesting': 'Hand-picked',
      'Packaging': 'Cushioned boxes'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'fruits',
    title: 'Fresh Bananas',
    description: 'Premium Cavendish bananas harvested green and packed under temperature control.',
    image: 'assets/fresh_bananas.png',
    specs: {
      'Shelf Life': '1 Week',
      'Calibration': '42 - 47 mm',
      'Packaging': 'Vacuum bags'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'fruits',
    title: 'Sweet Watermelon',
    description: 'Juicy, sweet watermelon harvested fresh from certified farmlands.',
    image: 'assets/sweet_watermelon.png',
    specs: {
      'Shelf Life': '10 - 12 Days',
      'Size': '3 - 5 kg',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'fresh-agri',
    subCategory: 'fruits',
    title: 'Fresh Coconuts',
    description: 'Available in Green Coconut (for drinking water) and Dry Coconut (for cooking and oil).',
    image: 'assets/fresh_coconuts.png',
    specs: {
      'Shelf Life': '3 - 5 Months',
      'Types': 'Green / Dry Coconut',
      'Packaging': 'PP Bags'
    }
  },

  // --- GRAINS & BEANS: GRAINS ---
  {
    category: 'grains-beans',
    subCategory: 'grains',
    title: 'Premium Rice',
    description: 'Long-grain Basmati and Non-Basmati export-grade rice varieties.',
    image: 'assets/rice.png',
    specs: {
      'Shelf Life': '1 Year',
      'Moisture': '<= 14%',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'grains-beans',
    subCategory: 'grains',
    title: 'Pearl Millet (Bajra)',
    description: 'Nutritious whole grain pearl millet sourced from local dryland farms.',
    image: 'assets/pearl_millet.png',
    specs: {
      'Shelf Life': '1 Year',
      'Purity': '99% min',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'grains-beans',
    subCategory: 'grains',
    title: 'Premium Wheat',
    description: 'High-gluten premium wheat grains cleaned and sorted for milling and export.',
    image: 'assets/wheat_grain.png',
    specs: {
      'Shelf Life': '1 Year',
      'Protein': '11.5% - 13%',
      'Packaging': 'As per requirements'
    }
  },

  // --- GRAINS & BEANS: BEANS ---
  {
    category: 'grains-beans',
    subCategory: 'beans',
    title: 'Peanuts',
    description: 'Premium quality peanuts available with shell or without shell (kernels).',
    image: 'assets/peanut.png',
    specs: {
      'Shelf Life': '1 Year',
      'Type': 'With / Without Shell',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'grains-beans',
    subCategory: 'beans',
    title: 'Maize Seeds',
    description: 'Yellow and white maize seeds suitable for animal feed and human consumption.',
    image: 'assets/maize_seed.png',
    specs: {
      'Shelf Life': '1 Year',
      'Moisture': '<= 14%',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'grains-beans',
    subCategory: 'beans',
    title: 'Mix Beans',
    description: 'A blend of premium quality mixed beans of all types.',
    image: 'assets/mix_beans.png',
    specs: {
      'Shelf Life': '1 Year',
      'Quality': 'Clean sorted',
      'Packaging': 'As per requirements'
    }
  },

  // --- DEHYDRATED VEGETABLES: GARLIC ---
  {
    category: 'dehydrated-veg',
    subCategory: 'garlic',
    title: 'Dehydrated Minced Garlic',
    description: 'Dehydrated minced garlic particles, perfect for adding texture and rich flavor to sauces.',
    image: 'public/garlic_minced-B_KMbAEM.png',
    specs: {
      'Size': '1 - 3 mm',
      'Shelf Life': '24 Months',
      'Moisture': '<= 5%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'garlic',
    title: 'Dehydrated Chopped Garlic',
    description: 'Coarsely chopped premium garlic cloves dried to preserve authentic flavor and pungency.',
    image: 'public/garlic_chopped-BxQ_ME93.png',
    specs: {
      'Size': '3 - 5 mm',
      'Shelf Life': '24 Months',
      'Moisture': '<= 5%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'garlic',
    title: 'Dehydrated Garlic Flakes',
    description: 'Premium quality garlic flakes sliced and dehydrated to secure raw properties and aroma.',
    image: 'public/garlic_flakes--UwdcNcq.png',
    specs: {
      'Size': '5 - 8 mm',
      'Shelf Life': '24 Months',
      'Moisture': '<= 5%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'garlic',
    title: 'Dehydrated Garlic Powder',
    description: 'Finely ground dehydrated garlic, perfect for seasonings, spice mixes, and processed foods.',
    image: 'public/garlic_powder-DVW-8wSy.png',
    specs: {
      'Texture': '60 - 80 Mesh',
      'Shelf Life': '24 Months',
      'Moisture': '<= 4%'
    }
  },

  // --- DEHYDRATED VEGETABLES: ONION ---
  {
    category: 'dehydrated-veg',
    subCategory: 'onion',
    title: 'Dehydrated Pink Onion - Minced',
    description: 'Minced pink onion flakes offering a balanced sweet and sharp onion profile.',
    image: 'public/pink_onion_minced-Dy0u_O9F.png',
    specs: {
      'Size': '1 - 3 mm',
      'Shelf Life': '24 Months',
      'Moisture': '<= 5%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'onion',
    title: 'Dehydrated Pink Onion - Chopped',
    description: 'Chopped pink onion pieces processed to retain full nutrients.',
    image: 'public/pink_onion_chopped-BRuMVXYI.png',
    specs: {
      'Size': '3 - 5 mm',
      'Shelf Life': '24 Months',
      'Moisture': '<= 5%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'onion',
    title: 'Dehydrated Pink Onion - Flakes',
    description: 'Crispy, sweet pink onion flakes, dried under strict hygiene standards.',
    image: 'public/onion_flakes-OqIAGFsV.png',
    specs: {
      'Size': '5 - 8 mm',
      'Shelf Life': '24 Months',
      'Moisture': '<= 5%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'onion',
    title: 'Dehydrated Pink Onion - Powder',
    description: 'Vibrant pink onion powder with long-lasting freshness, ideal for soups and rubs.',
    image: 'public/onion_powder-BzFahdGF.png',
    specs: {
      'Texture': '60 - 80 Mesh',
      'Shelf Life': '24 Months',
      'Moisture': '<= 4%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'onion',
    title: 'Dehydrated White Onion - Minced',
    description: 'Minced white onion bits, premium quality for seasonings and processed products.',
    image: 'public/white_onion_minced-sA2RlNAz.png',
    specs: {
      'Size': '1 - 3 mm',
      'Shelf Life': '24 Months',
      'Moisture': '<= 5%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'onion',
    title: 'Dehydrated White Onion - Chopped',
    description: 'Finely chopped clean white onion pieces, dehydrated without losing original strong aroma.',
    image: 'public/white_onion_chopped-CG8LUZpt.png',
    specs: {
      'Size': '3 - 5 mm',
      'Shelf Life': '24 Months',
      'Moisture': '<= 5%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'onion',
    title: 'Dehydrated White Onion - Flakes',
    description: 'Perfect white onion flakes dried in clean chambers to retain maximum flavor profiles.',
    image: 'public/white_onion_flakes-iKP0HR3u.png',
    specs: {
      'Size': '5 - 8 mm',
      'Shelf Life': '24 Months',
      'Moisture': '<= 5%'
    }
  },
  {
    category: 'dehydrated-veg',
    subCategory: 'onion',
    title: 'Dehydrated White Onion - Powder',
    description: 'Pure dehydrated white onion powder, imparting robust flavor without the moisture.',
    image: 'public/white_onion_powder-zA6cJrZW.png',
    specs: {
      'Texture': '60 - 80 Mesh',
      'Shelf Life': '24 Months',
      'Moisture': '<= 4%'
    }
  },

  // --- SPICES & OILS: SPICES ---
  {
    category: 'spices-oils',
    subCategory: 'spices',
    title: 'Cumin Seeds',
    description: 'Premium grade aromatic cumin seeds with high essential oil content.',
    image: 'public/cumin_powder-DTskBB16.png',
    specs: {
      'Shelf Life': '1 Year',
      'Purity': '99% min',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'spices',
    title: 'Turmeric',
    description: 'Bright golden yellow turmeric fingers and powder with high curcumin content.',
    image: 'public/turmeric_powder-B6a3FlL0.png',
    specs: {
      'Shelf Life': '1 Year',
      'Curcumin': 'High grade',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'spices',
    title: 'Chilly Pepper',
    description: 'Vibrant red chilli peppers with high pungency and color values.',
    image: 'public/red_chilli_powder-B9lQ_YRs.png',
    specs: {
      'Shelf Life': '1 Year',
      'Type': 'Stem / Stemless',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'spices',
    title: 'Cinnamon Stick',
    description: 'Aromatic and sweet cinnamon sticks cleaned and sorted for packaging.',
    image: 'assets/cinnamon_sticks.png',
    specs: {
      'Shelf Life': '1 Year',
      'Type': 'Rolled sticks',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'spices',
    title: 'Cloves',
    description: 'Premium whole dried cloves with rich aroma and high essential oils.',
    image: 'assets/cloves.png',
    specs: {
      'Shelf Life': '1 Year',
      'Color': 'Dark Brown',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'spices',
    title: 'Coriander Seeds',
    description: 'Earthy and citrusy coriander seeds processed cleanly for culinary uses.',
    image: 'public/coriander_powder-DKl9QXs2.png',
    specs: {
      'Shelf Life': '1 Year',
      'Form': 'Whole seeds',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'spices',
    title: 'Cardamom',
    description: 'Aromatic green cardamom pods sorted by diameter size.',
    image: 'assets/cardamom.png',
    specs: {
      'Shelf Life': '1 Year',
      'Color': 'Deep Green',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'spices',
    title: 'Black Pepper',
    description: 'High-piperine bold black pepper berries cleaned and dried.',
    image: 'assets/black_pepper.png',
    specs: {
      'Shelf Life': '1 Year',
      'Size': '5.0mm+',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'spices',
    title: 'Dry Fennel',
    description: 'Sweet green fennel seeds (Saunf) processed under strict quality controls.',
    image: 'assets/fennel_seeds.png',
    specs: {
      'Shelf Life': '1 Year',
      'Purity': '99% min',
      'Packaging': 'As per requirements'
    }
  },

  // --- SPICES & OILS: OILS & FLOUR ---
  {
    category: 'spices-oils',
    subCategory: 'oils-flour',
    title: 'Groundnut Oil / Peanut Oil',
    description: 'Pure, cold-pressed groundnut oil retaining natural nutrients and rich taste.',
    image: 'assets/groundnut_oil.png',
    specs: {
      'Shelf Life': '12 - 16 Months',
      'Type': 'Cold Pressed',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'oils-flour',
    title: 'Wheat Flour',
    description: 'Finely milled whole wheat flour (Atta) rich in fiber and gluten.',
    image: 'assets/wheat_flour.png',
    specs: {
      'Shelf Life': '1 Year',
      'Protein': 'High',
      'Packaging': 'As per requirements'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'oils-flour',
    title: 'Maida Flour',
    description: 'Premium quality refined wheat flour (Maida) ideal for bakery items.',
    image: 'assets/maida_flour.png',
    specs: {
      'Shelf Life': '1 Year',
      'Quality': 'Superfine',
      'Packaging': 'As per requirements'
    }
  },

  // --- SPICES & OILS: HONEY ---
  {
    category: 'spices-oils',
    subCategory: 'honey',
    title: 'Wild Forest Honey',
    description: 'Raw, organic forest honey containing natural antioxidants and sweetness.',
    image: 'public/natural_honey-Bjxadl0l.png',
    specs: {
      'Shelf Life': '24 Months',
      'Type': 'Raw Unfiltered',
      'Packaging': 'Glass jar / Bulk containers'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'honey',
    title: 'Jeera Honey',
    description: 'Raw forest honey infused with aromatic cumin seed extracts.',
    image: 'public/jeera_honey-DeujmOCw.png',
    specs: {
      'Shelf Life': '24 Months',
      'Ingredients': 'Honey, Cumin',
      'Packaging': 'Glass jar'
    }
  },
  {
    category: 'spices-oils',
    subCategory: 'honey',
    title: 'Dry Fruits Enriched Honey',
    description: 'Natural honey enriched with almonds, cashews, raisins, and walnuts.',
    image: 'public/dry_fruits_honey-CooXyHpI.png',
    specs: {
      'Shelf Life': '18 Months',
      'Ingredients': 'Honey, Mixed Nuts',
      'Packaging': 'Glass jar'
    }
  },

  // --- FROZEN: FRUITS ---
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Strawberry',
    description: 'Fresh whole ripe strawberries IQF frozen below -18°C.',
    image: 'assets/frozen_strawberries.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Process': 'IQF Frozen'
    }
  },
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Alphonso Mango Pulp',
    description: 'Pure, rich mango pulp prepared hygienically and frozen to retain flavor.',
    image: 'assets/frozen_mango_pulp.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Preservatives': 'Zero Added'
    }
  },
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Black Jamun',
    description: 'Selected black jamun fruits frozen to secure natural sweet-tart taste.',
    image: 'assets/frozen_black_jamun.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Form': 'Whole / Pitted'
    }
  },
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Kiwi Fruit',
    description: 'Sliced and frozen kiwi fruits ideal for salads and dessert garnishes.',
    image: 'assets/frozen_kiwi.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Form': 'Slices'
    }
  },
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Custard Apple Pulp',
    description: 'Fleshy custard apple pulp frozen hygienically for shakes and creams.',
    image: 'assets/frozen_custard_apple.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Seeds': 'Removed'
    }
  },
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Pomegranate Arils',
    description: 'Premium quality red pomegranate arils flash frozen under strict hygiene.',
    image: 'assets/frozen_pomegranate.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Form': 'Arils'
    }
  },
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Pineapple Tidbits',
    description: 'Juicy pineapple pieces frozen at optimal sweetness.',
    image: 'assets/frozen_pineapple.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Form': 'Tidbits'
    }
  },
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Dragon Fruit Slices',
    description: 'Vibrant pink and white dragon fruit slices flash-frozen.',
    image: 'assets/frozen_dragon_fruit.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Form': 'Slices'
    }
  },
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Pink Guava Pulp',
    description: 'Rich pink guava pulp hygienically extracted and stored cold.',
    image: 'assets/frozen_pink_guava.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Quality': 'Premium'
    }
  },
  {
    category: 'frozen',
    subCategory: 'fruits',
    title: 'Frozen Avocado',
    description: 'Sliced premium avocado flash frozen to preserve natural fats and taste.',
    image: 'assets/frozen_avocado.png',
    specs: {
      'Shelf Life': '16 - 18 Months',
      'Storage': 'Below -18°C',
      'Form': 'Halves / Slices'
    }
  },

  // --- FROZEN: VEGETABLES ---
  {
    category: 'frozen',
    subCategory: 'vegetables',
    title: 'Frozen Green Peas (Vatana)',
    description: 'Sweet, tender green peas frozen at peak freshness.',
    image: 'assets/frozen_green_peas.png',
    specs: {
      'Shelf Life': '10 - 12 Months',
      'Storage': 'Below -18°C',
      'Form': 'Whole Peas'
    }
  },
  {
    category: 'frozen',
    subCategory: 'vegetables',
    title: 'Frozen Potato Chips',
    description: 'Pre-cut premium potatoes ready to fry or bake.',
    image: 'assets/frozen_potato_chips.png',
    specs: {
      'Shelf Life': '10 - 12 Months',
      'Storage': 'Below -18°C',
      'Shape': 'Straight Cut'
    }
  },

  // --- READY TO EAT (FREEZE DRIED): GUJARATI ---
  {
    category: 'rte',
    subCategory: 'gujarati',
    title: 'Poha',
    description: 'Traditional spiced flattened rice flakes, ready in 5 minutes.',
    image: 'assets/dal_bhat.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Weight': 'As per requirements'
    }
  },
  {
    category: 'rte',
    subCategory: 'gujarati',
    title: 'Gujarati Dal-Bhat',
    description: 'Authentic sweet-sour lentil soup served with steam-cooked rice.',
    image: 'assets/dal_bhat.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Packaging': 'Cup / Pouch'
    }
  },
  {
    category: 'rte',
    subCategory: 'gujarati',
    title: 'Masala Kadhi-Khichadi',
    description: 'Spiced Kadhi served with comforting lentil rice khichdi.',
    image: 'assets/khichadi.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Packaging': 'Cup / Pouch'
    }
  },
  {
    category: 'rte',
    subCategory: 'gujarati',
    title: 'Pav Bhaji',
    description: 'Spiced mixed vegetable mash ready to serve with bread.',
    image: 'assets/dal_bhat.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Packaging': 'Cup / Pouch'
    }
  },

  // --- READY TO EAT (FREEZE DRIED): PUNJABI ---
  {
    category: 'rte',
    subCategory: 'punjabi',
    title: 'Palak Paneer',
    description: 'Creamy spinach curry with soft paneer cubes.',
    image: 'assets/khichadi.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Packaging': 'Cup / Pouch'
    }
  },
  {
    category: 'rte',
    subCategory: 'punjabi',
    title: 'Veg Makhanwala',
    description: 'Assorted vegetables cooked in a rich, buttery tomato gravy.',
    image: 'assets/khichadi.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Packaging': 'Cup / Pouch'
    }
  },
  {
    category: 'rte',
    subCategory: 'punjabi',
    title: 'Jeera Rice',
    description: 'Steamed basmati rice tempered with cumin seeds.',
    image: 'assets/dal_bhat.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Packaging': 'Cup / Pouch'
    }
  },
  {
    category: 'rte',
    subCategory: 'punjabi',
    title: 'Dal Fry',
    description: 'Tempered yellow lentils cooked with aromatic spices.',
    image: 'assets/dal_bhat.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Packaging': 'Cup / Pouch'
    }
  },

  // --- READY TO EAT (FREEZE DRIED): OTHERS ---
  {
    category: 'rte',
    subCategory: 'others',
    title: 'Veg Biryani',
    description: 'Fragrant basmati rice layered with vegetables and spices.',
    image: 'assets/dal_bhat.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Packaging': 'Cup / Pouch'
    }
  },
  {
    category: 'rte',
    subCategory: 'others',
    title: 'Gajar Halva',
    description: 'Traditional sweet dessert made of grated carrots, milk, and ghee.',
    image: 'assets/dal_bhat.png',
    specs: {
      'Preparation Time': '5 Minutes',
      'Type': 'Freeze Dried',
      'Packaging': 'Cup / Pouch'
    }
  }
];
