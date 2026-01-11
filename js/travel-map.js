// Travel Map 交互逻辑

document.addEventListener('DOMContentLoaded', function() {
    // 初始化地图 - 默认居中亚洲区域
    const map = L.map('travel-map').setView([25, 110], 4);

    // 添加地图图层 (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // 自定义标记图标
    const customIcon = L.divIcon({
        className: 'custom-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10]
    });

    // 统计数据
    const countries = new Set();

    // 添加标记点
    travelLocations.forEach(function(location) {
        countries.add(location.country);

        // 创建标记
        const marker = L.marker([location.lat, location.lon], {
            icon: customIcon
        }).addTo(map);

        // 创建弹出内容
        const popupContent = `
            <div class="popup-content">
                <h3>${location.name}</h3>
                <p>${location.country} | ${location.visitDate}</p>
                <p>${location.description}</p>
                <button class="popup-btn" onclick="openModal(${travelLocations.indexOf(location)})">
                    查看详情
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);

        // 点击标记时打开弹窗
        marker.on('click', function() {
            this.openPopup();
        });
    });

    // 更新统计数据
    document.getElementById('location-count').textContent = travelLocations.length;
    document.getElementById('country-count').textContent = countries.size;

    // 调整地图视图以显示所有标记
    if (travelLocations.length > 0) {
        const bounds = L.latLngBounds(travelLocations.map(loc => [loc.lat, loc.lon]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }
});

// 模态框相关变量
let currentLocation = null;
let currentImageIndex = 0;

// 打开模态框
function openModal(locationIndex) {
    currentLocation = travelLocations[locationIndex];
    currentImageIndex = 0;

    // 关闭地图的弹出窗口
    // 设置模态框内容
    document.getElementById('modal-title').textContent = currentLocation.name;
    document.getElementById('modal-country').textContent = currentLocation.country;
    document.getElementById('modal-date').textContent = currentLocation.visitDate;
    document.getElementById('modal-description').textContent = currentLocation.description;
    document.getElementById('modal-link').href = currentLocation.postUrl;

    // 设置图片
    updateGalleryImage();

    // 显示/隐藏导航按钮
    const hasImages = currentLocation.images && currentLocation.images.length > 0;
    const hasMultipleImages = currentLocation.images && currentLocation.images.length > 1;

    document.getElementById('prev-btn').style.display = hasMultipleImages ? 'block' : 'none';
    document.getElementById('next-btn').style.display = hasMultipleImages ? 'block' : 'none';
    document.getElementById('gallery-counter').style.display = hasMultipleImages ? 'block' : 'none';

    // 显示模态框
    document.getElementById('location-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 更新画廊图片
function updateGalleryImage() {
    const imageEl = document.getElementById('modal-image');
    const captionEl = document.getElementById('modal-caption');
    const counterEl = document.getElementById('gallery-counter');
    const galleryContainer = document.querySelector('.modal-gallery');

    if (currentLocation.images && currentLocation.images.length > 0) {
        const currentImage = currentLocation.images[currentImageIndex];
        imageEl.src = currentImage.url;
        imageEl.alt = currentImage.caption || currentLocation.name;
        captionEl.textContent = currentImage.caption || '';
        counterEl.textContent = `${currentImageIndex + 1} / ${currentLocation.images.length}`;
        imageEl.style.display = 'block';

        // 移除无图片占位符
        const placeholder = galleryContainer.querySelector('.no-image-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
    } else {
        imageEl.style.display = 'none';
        captionEl.textContent = '';
        counterEl.textContent = '';

        // 添加无图片占位符
        if (!galleryContainer.querySelector('.no-image-placeholder')) {
            const placeholder = document.createElement('div');
            placeholder.className = 'no-image-placeholder';
            placeholder.textContent = '暂无图片';
            galleryContainer.querySelector('.gallery-container').appendChild(placeholder);
        }
    }
}

// 上一张图片
function prevImage() {
    if (currentLocation.images && currentLocation.images.length > 1) {
        currentImageIndex = (currentImageIndex - 1 + currentLocation.images.length) % currentLocation.images.length;
        updateGalleryImage();
    }
}

// 下一张图片
function nextImage() {
    if (currentLocation.images && currentLocation.images.length > 1) {
        currentImageIndex = (currentImageIndex + 1) % currentLocation.images.length;
        updateGalleryImage();
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('location-modal').style.display = 'none';
    document.body.style.overflow = '';
    currentLocation = null;
    currentImageIndex = 0;
}

// 事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 关闭按钮
    document.querySelector('.modal-close').addEventListener('click', closeModal);

    // 上一张/下一张按钮
    document.getElementById('prev-btn').addEventListener('click', prevImage);
    document.getElementById('next-btn').addEventListener('click', nextImage);

    // 点击模态框背景关闭
    document.getElementById('location-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('location-modal').style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });
});
