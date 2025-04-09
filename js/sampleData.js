// Sample memory data generator
const sampleTags = ['Family', 'Travel', 'Celebration', 'Milestone', 'Adventure', 'Friends', 'Food', 'Nature', 'Music', 'Sports'];
const sampleLocations = ['New York', 'Paris', 'Tokyo', 'London', 'Sydney', 'San Francisco', 'Rome', 'Barcelona', 'Dubai', 'Singapore'];

function generateRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateSampleMemory() {
    const types = ['photo', 'video', 'story', 'audio'];
    const type = types[Math.floor(Math.random() * types.length)];
    const date = generateRandomDate(new Date(2020, 0, 1), new Date());
    
    return {
        id: Math.random().toString(36).substr(2, 9),
        type: type,
        title: `Memory from ${date.toLocaleDateString()}`,
        description: `This is a sample ${type} memory capturing a special moment.`,
        date: date,
        location: sampleLocations[Math.floor(Math.random() * sampleLocations.length)],
        tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
            sampleTags[Math.floor(Math.random() * sampleTags.length)]
        ),
        imageUrl: type === 'photo' ? `https://picsum.photos/400/300?random=${Math.random()}` : null,
        videoUrl: type === 'video' ? 'https://example.com/sample-video.mp4' : null,
        audioUrl: type === 'audio' ? 'https://example.com/sample-audio.mp3' : null,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        isPrivate: Math.random() > 0.5
    };
}

function generateSampleMemories(count = 20) {
    return Array.from({ length: count }, generateSampleMemory)
        .sort((a, b) => b.date - a.date);
}

// Function to create a memory card DOM element
function createMemoryCard(memory) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.setAttribute('data-type', memory.type);
    
    const mediaHtml = memory.type === 'photo' 
        ? `<img src="${memory.imageUrl}" alt="${memory.title}" loading="lazy">` 
        : memory.type === 'video'
        ? `<div class="video-placeholder"><i class="fas fa-play"></i></div>`
        : memory.type === 'audio'
        ? `<div class="audio-placeholder"><i class="fas fa-music"></i></div>`
        : `<div class="story-placeholder"><i class="fas fa-book-open"></i></div>`;

    card.innerHTML = `
        <div class="media-badge">
            <i class="fas fa-${memory.type === 'photo' ? 'image' : 
                            memory.type === 'video' ? 'video' : 
                            memory.type === 'audio' ? 'microphone' : 'pen'}"></i>
        </div>
        <div class="memory-content">
            ${mediaHtml}
            <div class="overlay">
                <h3>${memory.title}</h3>
                <p>${memory.description}</p>
                <div class="memory-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${memory.location}</span>
                    <span><i class="fas fa-calendar"></i> ${memory.date.toLocaleDateString()}</span>
                </div>
                <div class="memory-tags">
                    ${memory.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
        <div class="actions">
            <button class="action-btn" title="Like">
                <i class="fas fa-heart"></i>
                <span>${memory.likes}</span>
            </button>
            <button class="action-btn" title="Comment">
                <i class="fas fa-comment"></i>
                <span>${memory.comments}</span>
            </button>
            <button class="action-btn" title="Share">
                <i class="fas fa-share"></i>
            </button>
            <button class="action-btn" title="More">
                <i class="fas fa-ellipsis-v"></i>
            </button>
        </div>
    `;

    return card;
}

// Function to populate the memory feed
function populateMemoryFeed() {
    const memories = generateSampleMemories();
    const masonryGrid = document.querySelector('.masonry-grid');
    
    if (masonryGrid) {
        memories.forEach(memory => {
            masonryGrid.appendChild(createMemoryCard(memory));
        });
    }

    // Initialize masonry layout
    const masonry = new Masonry(masonryGrid, {
        itemSelector: '.memory-card',
        columnWidth: '.memory-card',
        gutter: 20,
        percentPosition: true
    });

    // Update layout after images load
    imagesLoaded(masonryGrid).on('progress', () => {
        masonry.layout();
    });
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    populateMemoryFeed();
}); 