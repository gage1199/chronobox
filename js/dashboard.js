// Cache common DOM elements
const DOM = {
    init() {
        this.userMenuBtn = document.querySelector('.user-menu-btn');
        this.userDropdown = document.querySelector('.user-dropdown');
        this.logoutBtn = document.querySelector('.logout-btn');
        this.filterBtn = document.querySelector('.filter-dropdown');
        this.filterContent = document.querySelector('.dropdown-content');
        this.masonryGrid = document.querySelector('.masonry-grid');
        this.tagCloud = document.querySelector('.tag-cloud');
        this.userNameElement = document.querySelector('.user-name');
        this.userAvatarElement = document.querySelector('.user-avatar');
        this.headerTitle = document.querySelector('.dashboard-header h1');
        this.sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
        this.viewBtns = document.querySelectorAll('.view-btn');
        this.recordBtn = document.querySelector('.record-btn');
        this.uploadBtn = document.querySelector('.upload-btn');
    }
};

// Helper function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

// Helper function to delete cookie
function deleteCookie(name) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
}

// Authentication check
function checkAuth() {
    const authToken = getCookie('authToken');
    if (!authToken) {
        window.location.href = 'index.html';
        return;
    }
    return authToken;
}

// Run auth check when dashboard loads
checkAuth();

// Dashboard initialization
document.addEventListener('DOMContentLoaded', () => {
    DOM.init();
    initDashboard();
    loadMemoryFeed();
    initTutorial();
    
    // Consolidated outside click handler
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            DOM.userDropdown?.classList.remove('show');
        }
        if (!e.target.closest('.filter-dropdown')) {
            DOM.filterContent?.classList.remove('show');
        }
    });
});

// Initialize dashboard
function initDashboard() {
    const token = checkAuth();
    const userData = JSON.parse(getCookie('userData') || '{}');
    
    if (userData) {
        if (DOM.userNameElement) DOM.userNameElement.textContent = `Welcome, ${userData.name}`;
        if (DOM.userAvatarElement && userData.avatar) DOM.userAvatarElement.src = userData.avatar;
    }

    // Initialize components
    initSidebar();
    initUserMenu();
    initViewControls();
    initFilters();
    initQuickRecord();
    initUploadButton();
    initTagCloud();
}

// Initialize sidebar
function initSidebar() {
    if (!DOM.sidebarItems.length || !DOM.headerTitle) return;
    
    DOM.sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            DOM.sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const section = item.querySelector('span')?.textContent || '';
            DOM.headerTitle.textContent = section;
            
            loadSectionContent(item.getAttribute('href')?.substring(1) || '');
        });
    });
}

// Initialize user menu
function initUserMenu() {
    if (!DOM.userMenuBtn || !DOM.userDropdown || !DOM.logoutBtn) return;
    
    DOM.userMenuBtn.addEventListener('click', () => {
        DOM.userDropdown.classList.toggle('show');
    });
    
    DOM.logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// Initialize view controls
function initViewControls() {
    if (!DOM.viewBtns.length || !DOM.masonryGrid) return;
    
    DOM.viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            DOM.masonryGrid.className = `masonry-grid ${btn.dataset.view}-view`;
        });
    });
}

// Initialize filters
function initFilters() {
    if (!DOM.filterBtn || !DOM.filterContent) return;
    
    DOM.filterBtn.addEventListener('click', () => {
        DOM.filterContent.classList.toggle('show');
    });
}

// Initialize quick record
function initQuickRecord() {
    if (!DOM.recordBtn) return;
    DOM.recordBtn.addEventListener('click', showRecordModal);
}

// Initialize upload button
function initUploadButton() {
    if (!DOM.uploadBtn) return;
    
    DOM.uploadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*,video/*,audio/*';
        input.addEventListener('change', (e) => handleFileUpload(e.target.files));
        input.click();
    });
}

// Handle file upload
async function handleFileUpload(files) {
    if (!files.length) return;
    
    const formData = new FormData();
    Array.from(files).forEach(file => {
        formData.append('files', file);
    });
    
    try {
        // Here you would typically make an API call to upload the files
        // For demo purposes, we'll just show a success message
        showNotification('Files uploaded successfully');
    } catch (error) {
        showError('Failed to upload files');
    }
}

// Initialize tag cloud
function initTagCloud() {
    if (!DOM.tagCloud) return;
    
    // Sample tags - in a real app, these would come from your backend
    const tags = ['Family', 'Friends', 'Work', 'Travel', 'Memories'];
    
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => filterMemories(tag));
        DOM.tagCloud.appendChild(tagElement);
    });
}

// Filter memories by tag
function filterMemories(tag) {
    const memories = document.querySelectorAll('.memory-card');
    memories.forEach(memory => {
        const memoryTags = memory.dataset.tags?.split(',') || [];
        memory.style.display = memoryTags.includes(tag) ? 'block' : 'none';
    });
}

// Memory Card Factory
const MemoryCardFactory = {
    createCard(memory, isThisDay = false) {
        const card = document.createElement('div');
        card.className = `memory-card ${isThisDay ? 'this-day' : ''}`;
        card.dataset.id = memory.id;
        card.dataset.tags = memory.tags?.join(',') || '';
        
        card.innerHTML = this.getCardHTML(memory);
        this.attachEventListeners(card, memory);
        
        return card;
    },
    
    getCardHTML(memory) {
        return `
            <div class="memory-content">
                <div class="memory-media">
                    ${this.getMediaContent(memory)}
                </div>
                <div class="memory-info">
                    <h3>${memory.title}</h3>
                    <p>${memory.description}</p>
                    <div class="memory-meta">
                        <span class="date">${formatDate(memory.date)}</span>
                        <div class="actions">
                            <button class="action-btn share" title="Share">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button class="action-btn edit" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn more" title="More options">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    getMediaContent(memory) {
        switch (memory.type) {
            case 'image': return `<img src="${memory.url}" alt="${memory.title}">`;
            case 'video': return `<video src="${memory.url}" controls></video>`;
            case 'audio': return `<audio src="${memory.url}" controls></audio>`;
            default: return `<div class="text-content">${memory.content}</div>`;
        }
    },
    
    attachEventListeners(card, memory) {
        const actions = {
            '.share': () => showShareModal(memory),
            '.edit': () => showEditModal(memory),
            '.more': () => showMoreOptions(memory)
        };
        
        Object.entries(actions).forEach(([selector, handler]) => {
            const btn = card.querySelector(selector);
            if (btn) btn.addEventListener('click', handler);
        });
    }
};

// Handle memory actions
function handleMemoryAction(action, memory) {
    switch (action) {
        case 'share':
            showShareModal(memory);
            break;
        case 'edit':
            showEditModal(memory);
            break;
        case 'delete':
            showDeleteConfirmation(memory);
            break;
        case 'archive':
            archiveMemory(memory);
            break;
        case 'download':
            downloadMemory(memory);
            break;
    }
}

// Load memory feed
async function loadMemoryFeed() {
    try {
        await Promise.all([
            loadThisDayMemories(),
            loadMemories()
        ]);
    } catch (error) {
        showError('Failed to load memories');
    }
}

// Load this day memories
async function loadThisDayMemories() {
    const thisDayContainer = document.querySelector('.memory-carousel');
    if (!thisDayContainer) return;
    
    try {
        // Here you would typically fetch memories from your backend
        // For demo purposes, we'll use sample data
        const memories = [
            {
                id: 1,
                title: 'First Day at School',
                description: 'My first day at elementary school',
                date: '2000-09-01',
                type: 'image',
                url: 'images/school.jpg'
            }
        ];
        
        memories.forEach(memory => {
            thisDayContainer.appendChild(MemoryCardFactory.createCard(memory, true));
        });
    } catch (error) {
        showError('Failed to load this day memories');
    }
}

// Load all memories
async function loadMemories() {
    if (!DOM.masonryGrid) return;
    
    try {
        // Here you would typically fetch memories from your backend
        // For demo purposes, we'll use sample data
        const memories = [
            {
                id: 2,
                title: 'Family Vacation',
                description: 'Our trip to the beach',
                date: '2023-07-15',
                type: 'image',
                url: 'images/beach.jpg'
            }
        ];
        
        memories.forEach(memory => {
            DOM.masonryGrid.appendChild(MemoryCardFactory.createCard(memory));
        });
        
        // Initialize Masonry layout
        if (typeof Masonry !== 'undefined') {
            new Masonry(DOM.masonryGrid, {
                itemSelector: '.memory-card',
                columnWidth: '.memory-card',
                percentPosition: true
            });
        }
    } catch (error) {
        showError('Failed to load memories');
    }
}

// Show record modal
function showRecordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal record-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Record New Memory</h2>
            <div class="record-tabs">
                <button class="tab-btn active" data-tab="video">Video</button>
                <button class="tab-btn" data-tab="audio">Audio</button>
                <button class="tab-btn" data-tab="text">Text</button>
            </div>
            <div class="tab-content">
                <div id="video-tab" class="tab-pane active">
                    <div class="video-preview"></div>
                    <button class="record-btn">Start Recording</button>
                </div>
                <div id="audio-tab" class="tab-pane">
                    <div class="audio-visualizer"></div>
                    <button class="record-btn">Start Recording</button>
                </div>
                <div id="text-tab" class="tab-pane">
                    <textarea placeholder="Write your memory..."></textarea>
                    <button class="save-btn">Save</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    initializeRecordModal(modal);
}

// Initialize record modal
function initializeRecordModal(modal) {
    const closeBtn = modal.querySelector('.close-modal');
    const tabBtns = modal.querySelectorAll('.tab-btn');
    const tabPanes = modal.querySelectorAll('.tab-pane');
    
    // Close modal
    const closeModal = () => {
        modal.remove();
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Handle tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding content
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `${tabId}-tab`) {
                    pane.classList.add('active');
                }
            });
            
            // Initialize recording functionality
            switch (tabId) {
                case 'video':
                    initializeVideoRecord();
                    break;
                case 'audio':
                    initializeAudioRecord();
                    break;
                case 'text':
                    initializeTextRecord();
                    break;
            }
        });
    });
}

// Initialize video recording
async function initializeVideoRecord() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoPreview = document.querySelector('.video-preview');
        const recordBtn = document.querySelector('.record-btn');
        
        if (!videoPreview || !recordBtn) return;
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        
        videoPreview.innerHTML = '';
        videoPreview.appendChild(video);
        
        let mediaRecorder;
        let recordedChunks = [];
        
        recordBtn.addEventListener('click', () => {
            if (!mediaRecorder) {
                mediaRecorder = new MediaRecorder(stream);
                recordedChunks = [];
                
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        recordedChunks.push(e.data);
                    }
                };
                
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    
                    // Here you would typically upload the video to your backend
                    showNotification('Video recorded successfully');
                    
                    // Clean up
                    stream.getTracks().forEach(track => track.stop());
                    URL.revokeObjectURL(url);
                };
                
                mediaRecorder.start();
                recordBtn.textContent = 'Stop Recording';
            } else {
                mediaRecorder.stop();
            }
        });
    } catch (error) {
        showError('Failed to access camera and microphone');
    }
}

// Initialize audio recording
async function initializeAudioRecord() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioVisualizer = document.querySelector('.audio-visualizer');
        const recordBtn = document.querySelector('.record-btn');
        
        if (!audioVisualizer || !recordBtn) return;
        
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        
        source.connect(analyser);
        analyser.fftSize = 256;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            
            // Create visualization
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = audioVisualizer.offsetWidth;
            canvas.height = audioVisualizer.offsetHeight;
            
            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                
                ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
            
            audioVisualizer.innerHTML = '';
            audioVisualizer.appendChild(canvas);
        }
        
        draw();
        
        let mediaRecorder;
        let recordedChunks = [];
        
        recordBtn.addEventListener('click', () => {
            if (!mediaRecorder) {
                mediaRecorder = new MediaRecorder(stream);
                recordedChunks = [];
                
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        recordedChunks.push(e.data);
                    }
                };
                
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    
                    // Here you would typically upload the audio to your backend
                    showNotification('Audio recorded successfully');
                    
                    // Clean up
                    stream.getTracks().forEach(track => track.stop());
                    URL.revokeObjectURL(url);
                };
                
                mediaRecorder.start();
                recordBtn.textContent = 'Stop Recording';
            } else {
                mediaRecorder.stop();
            }
        });
    } catch (error) {
        showError('Failed to access microphone');
    }
}

// Initialize text record
function initializeTextRecord() {
    const textarea = document.querySelector('#text-tab textarea');
    const saveBtn = document.querySelector('#text-tab .save-btn');
    
    if (!textarea || !saveBtn) return;
    
    saveBtn.addEventListener('click', () => {
        const content = textarea.value.trim();
        if (content) {
            // Here you would typically save the text to your backend
            showNotification('Text saved successfully');
            textarea.value = '';
        }
    });
}

// Show share modal
function showShareModal(memory) {
    const modal = document.createElement('div');
    modal.className = 'modal share-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Share Memory</h2>
            <div class="share-content">
                <div class="memory-preview">
                    ${MemoryCardFactory.getMediaContent(memory)}
                </div>
                <div class="share-options">
                    <div class="contact-search">
                        <input type="text" placeholder="Search contacts...">
                        <div class="contact-suggestions"></div>
                    </div>
                    <div class="selected-contacts"></div>
                    <div class="share-actions">
                        <button class="share-btn">Share</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    initializeShareModal(modal, memory);
}

// Initialize share modal
function initializeShareModal(modal, memory) {
    const closeBtn = modal.querySelector('.close-modal');
    const searchInput = modal.querySelector('.contact-search input');
    const suggestionsContainer = modal.querySelector('.contact-suggestions');
    const selectedContactsContainer = modal.querySelector('.selected-contacts');
    const shareBtn = modal.querySelector('.share-btn');
    
    // Close modal
    const closeModal = () => {
        modal.remove();
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Handle contact search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchContacts(e.target.value);
        }, 300);
    });
    
    // Handle share
    shareBtn.addEventListener('click', async () => {
        const contacts = Array.from(selectedContactsContainer.querySelectorAll('.contact-chip'))
            .map(chip => chip.dataset.contactId);
        
        await shareMemory(memory, contacts);
        closeModal();
    });
}

// Show more options
function showMoreOptions(memory) {
    const menu = document.createElement('div');
    menu.className = 'options-menu';
    menu.innerHTML = `
        <div class="menu-content">
            <button class="menu-item" data-action="share">
                <i class="fas fa-share-alt"></i>
                Share
            </button>
            <button class="menu-item" data-action="edit">
                <i class="fas fa-edit"></i>
                Edit
            </button>
            <button class="menu-item" data-action="download">
                <i class="fas fa-download"></i>
                Download
            </button>
            <button class="menu-item" data-action="archive">
                <i class="fas fa-archive"></i>
                Archive
            </button>
            <button class="menu-item" data-action="delete">
                <i class="fas fa-trash"></i>
                Delete
            </button>
        </div>
    `;
    
    document.body.appendChild(menu);
    initializeOptionsMenu(menu, memory);
}

// Initialize options menu
const initializeOptionsMenu = (menu, memory) => {
    const closeMenu = () => {
        menu.remove();
    };
    
    const handleOutsideClick = (e) => {
        if (!menu.contains(e.target)) {
            closeMenu();
        }
    };
    
    document.addEventListener('click', handleOutsideClick);
    
    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleMemoryAction(action, memory);
            closeMenu();
        });
    });
};

// Search contacts
const searchContacts = async (term) => {
    try {
        // Here you would typically search contacts in your backend
        // For demo purposes, we'll use sample data
        const contacts = [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ].filter(contact => 
            contact.name.toLowerCase().includes(term.toLowerCase()) ||
            contact.email.toLowerCase().includes(term.toLowerCase())
        );
        
        showContactSuggestions(contacts, document.querySelector('.contact-suggestions'));
    } catch (error) {
        showError('Failed to search contacts');
    }
};

// Show contact suggestions
const showContactSuggestions = (contacts, container, input) => {
    container.innerHTML = '';
    
    contacts.forEach(contact => {
        const suggestion = document.createElement('div');
        suggestion.className = 'contact-suggestion';
        suggestion.innerHTML = `
            <div class="contact-info">
                <span class="name">${contact.name}</span>
                <span class="email">${contact.email}</span>
            </div>
            <button class="add-contact">Add</button>
        `;
        
        suggestion.querySelector('.add-contact').addEventListener('click', () => {
            addContactChip(document.querySelector('.selected-contacts'), contact);
            suggestion.remove();
        });
        
        container.appendChild(suggestion);
    });
};

// Add contact chip
const addContactChip = (container, contact) => {
    const chip = document.createElement('div');
    chip.className = 'contact-chip';
    chip.dataset.contactId = contact.id;
    chip.innerHTML = `
        <span>${contact.name}</span>
        <button class="remove-contact">&times;</button>
    `;
    
    chip.querySelector('.remove-contact').addEventListener('click', () => {
        chip.remove();
    });
    
    container.appendChild(chip);
};

// Share memory
const shareMemory = async (memory, contacts) => {
    try {
        // Here you would typically share the memory with contacts in your backend
        showNotification('Memory shared successfully');
    } catch (error) {
        showError('Failed to share memory');
    }
};

// Save memory changes
const saveMemoryChanges = async (memory) => {
    try {
        // Here you would typically save changes to your backend
        showNotification('Changes saved successfully');
    } catch (error) {
        showError('Failed to save changes');
    }
};

// Update memory card
const updateMemoryCard = (id, memory) => {
    const card = document.querySelector(`.memory-card[data-id="${id}"]`);
    if (card) {
        card.replaceWith(MemoryCardFactory.createCard(memory));
    }
};

// Download memory
const downloadMemory = async (memory) => {
    try {
        // Here you would typically download the memory from your backend
        showNotification('Memory downloaded successfully');
    } catch (error) {
        showError('Failed to download memory');
    }
};

// Show collection selector
const showCollectionSelector = (memory) => {
    // Implementation for collection selector
};

// Show schedule delivery
const showScheduleDelivery = (memory) => {
    // Implementation for schedule delivery
};

// Archive memory
const archiveMemory = async (memory) => {
    try {
        // Here you would typically archive the memory in your backend
        showNotification('Memory archived successfully');
    } catch (error) {
        showError('Failed to archive memory');
    }
};

// Show delete confirmation
const showDeleteConfirmation = (memory) => {
    const modal = document.createElement('div');
    modal.className = 'modal confirm-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Delete Memory</h2>
            <p>Are you sure you want to delete this memory? This action cannot be undone.</p>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="confirm-btn">Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.confirm-btn').addEventListener('click', async () => {
        try {
            // Here you would typically delete the memory from your backend
            showNotification('Memory deleted successfully');
            document.querySelector(`.memory-card[data-id="${memory.id}"]`)?.remove();
        } catch (error) {
            showError('Failed to delete memory');
        } finally {
            modal.remove();
        }
    });
};

// Initialize tutorial
function initTutorial() {
    const hasCompletedTutorial = getCookie('tutorialCompleted');
    if (!hasCompletedTutorial) {
        showTutorial();
    }
}

// Show tutorial
function showTutorial() {
    const modal = document.createElement('div');
    modal.className = 'modal tutorial-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="tutorial-content">
                <div class="tutorial-steps">
                    <div class="step active" data-step="1">
                        <h3>Welcome to Chronobox</h3>
                        <p>Let's help you get started with preserving your memories.</p>
                    </div>
                    <div class="step" data-step="2">
                        <h3>Record Memories</h3>
                        <p>Click the "Quick Record" button to create new video, audio, or text memories.</p>
                    </div>
                    <div class="step" data-step="3">
                        <h3>Organize Your Content</h3>
                        <p>Use tags and collections to organize your memories.</p>
                    </div>
                    <div class="step" data-step="4">
                        <h3>Share with Loved Ones</h3>
                        <p>Share your memories with family and friends, or schedule them for future delivery.</p>
                    </div>
                </div>
                <div class="tutorial-navigation">
                    <button class="prev-btn" disabled>Previous</button>
                    <button class="next-btn">Next</button>
                    <button class="skip-btn">Skip Tutorial</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const steps = modal.querySelectorAll('.step');
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');
    const skipBtn = modal.querySelector('.skip-btn');
    const closeBtn = modal.querySelector('.close-modal');
    
    let currentStep = 0;
    
    function showStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        steps[step].classList.add('active');
        
        prevBtn.disabled = step === 0;
        nextBtn.textContent = step === steps.length - 1 ? 'Finish' : 'Next';
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        } else {
            completeTutorial();
        }
    });
    
    skipBtn.addEventListener('click', completeTutorial);
    closeBtn.addEventListener('click', completeTutorial);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) completeTutorial();
    });
}

// Complete tutorial
function completeTutorial() {
    document.cookie = `tutorialCompleted=true; path=/; secure; samesite=strict; max-age=31536000`;
    document.querySelector('.tutorial-modal')?.remove();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Show error message
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Logout
function logout() {
    deleteCookie('authToken');
    deleteCookie('userData');
    window.location.href = 'index.html';
}

// Load section content
async function loadSectionContent(section) {
    const content = document.querySelector('.dashboard-main');
    if (!content) return;
    
    try {
        // Here you would typically load content from your backend
        // For demo purposes, we'll just show a placeholder
        content.innerHTML = `<h2>${section.charAt(0).toUpperCase() + section.slice(1)}</h2>`;
    } catch (error) {
        showError('Failed to load content');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 