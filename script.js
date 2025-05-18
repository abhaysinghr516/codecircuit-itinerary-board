document.addEventListener('DOMContentLoaded', () => {
    const itineraryBoard = document.getElementById('itinerary-board');
    const addDayBtn = document.getElementById('add-day-btn');
    let draggedActivityElement = null;
    let sourceDayId = null;
    let sourceActivityId = null;
    let activityPlaceholder = null;
    let currentOverList = null;

    let mockDaysData = [
        {
            id: 'day1', dayNumberText: 'Day 1', title: 'Arrival & Pink City Wonders',
            image: 'https://images.unsplash.com/photo-1705861145876-2efd5e0392a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            activities: [
                { id: 'act1-1', time: '14:00', description: 'Check into hotel & freshen up', icon: 'fas fa-bed' },
                { id: 'act1-2', time: '16:00', description: 'Visit Hawa Mahal (Palace of Winds)', icon: 'fas fa-wind' },
                { id: 'act1-3', time: '18:00', description: 'Explore City Palace complex', icon: 'fas fa-landmark-dome' }
            ]
        },
        {
            id: 'day2', dayNumberText: 'Day 2', title: 'Majestic Forts & Sunset Views',
            image: 'https://plus.unsplash.com/premium_photo-1661962387472-553d96ed01a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            activities: [
                { id: 'act2-1', time: '09:00', description: 'Tour Amber Fort (Amer Fort)', icon: 'fas fa-chess-rook' },
                { id: 'act2-2', time: '13:00', description: 'Lunch with a view of Jaigarh Fort', icon: 'fas fa-utensils' },
                { id: 'act2-3', time: '16:30', description: 'Sunset at Nahargarh Fort', icon: 'fas fa-mountain-sun' },
            ]
        },
        {
            id: 'day3', dayNumberText: 'Day 3', title: 'Water Palaces & Local Flavors',
            image: 'https://plus.unsplash.com/premium_photo-1697730286559-98b1a193eef6?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            activities: [
                { id: 'act3-1', time: '10:00', description: 'Photo stop at Jal Mahal', icon: 'fas fa-camera-retro' },
                { id: 'act3-2', time: '11:30', description: 'Shopping in Johari Bazaar', icon: 'fas fa-shopping-bag' },
                { id: 'act3-3', time: '19:00', description: 'Cultural evening at Chokhi Dhani', icon: 'fas fa-masks-theater' },
            ]
        }
    ];

    const defaultNewDayImages = [
        'https://plus.unsplash.com/premium_photo-1697730296129-eb26df35b40b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1602339752474-f77aa7bcaecd?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1661904091340-771549e98bf5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ];
    let nextNewDayImageIndex = 0;

    const commonIcons = [
        { class: 'fas fa-map-pin', name: 'Pin' }, { class: 'fas fa-camera-retro', name: 'Camera' },
        { class: 'fas fa-utensils', name: 'Food' }, { class: 'fas fa-bed', name: 'Sleep' },
        { class: 'fas fa-plane', name: 'Flight' }, { class: 'fas fa-train', name: 'Train' },
        { class: 'fas fa-car', name: 'Car' }, { class: 'fas fa-bus', name: 'Bus' },
        { class: 'fas fa-walking', name: 'Walk' }, { class: 'fas fa-mountain-sun', name: 'Scenery' },
        { class: 'fas fa-landmark-dome', name: 'Landmark' }, { class: 'fas fa-shopping-bag', name: 'Shopping' },
        { class: 'fas fa-cocktail', name: 'Drinks' }, { class: 'fas fa-coffee', name: 'Coffee' },
        { class: 'fas fa-book-open', name: 'Read/Journal' }, { class: 'fas fa-compass', name: 'Explore' },
        { class: 'fas fa-suitcase-rolling', name: 'Luggage' }, { class: 'fas fa-umbrella-beach', name: 'Beach' },
        { class: 'fas fa-ticket-alt', name: 'Ticket' }, { class: 'fas fa-key', name: 'Key/Check-in' }
    ];

    let currentModalEscHandler = null;

    function showModal(type, title, message, options = {}) {
        const overlay = document.getElementById('custom-modal-overlay');
        const modalTitleEl = document.getElementById('modal-title');
        const modalMessageEl = document.getElementById('modal-message');
        const inputContainer = document.getElementById('modal-input-container');
        const inputLabelEl = document.getElementById('modal-input-label');
        const inputField = document.getElementById('modal-input-field');
        const iconPickerContainer = document.getElementById('modal-icon-picker-container');

        const originalConfirmBtn = document.getElementById('modal-confirm-btn');
        const originalCancelBtn = document.getElementById('modal-cancel-btn');
        const originalCloseBtn = document.getElementById('modal-close-btn');

        const confirmBtn = originalConfirmBtn.cloneNode(true);
        const cancelBtn = originalCancelBtn.cloneNode(true);
        const closeBtn = originalCloseBtn.cloneNode(true);

        originalConfirmBtn.parentNode.replaceChild(confirmBtn, originalConfirmBtn);
        originalCancelBtn.parentNode.replaceChild(cancelBtn, originalCancelBtn);
        originalCloseBtn.parentNode.replaceChild(closeBtn, originalCloseBtn);

        return new Promise((resolve) => {
            if (currentModalEscHandler) {
                document.removeEventListener('keydown', currentModalEscHandler);
                currentModalEscHandler = null;
            }

            modalTitleEl.textContent = title;
            modalMessageEl.innerHTML = message.replace(/\n/g, '<br>');

            inputContainer.classList.add('hidden');
            iconPickerContainer.classList.add('hidden');
            iconPickerContainer.innerHTML = '';
            inputField.value = '';
            inputField.type = 'text';
            inputField.placeholder = '';
            confirmBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';

            confirmBtn.textContent = options.confirmText || 'OK';
            cancelBtn.textContent = options.cancelText || 'Cancel';

            let selectedIconClass = options.defaultIcon || 'fas fa-map-pin';

            if (type === 'prompt') {
                inputContainer.classList.remove('hidden');
                inputLabelEl.textContent = options.inputLabel || 'Enter value:';
                inputField.value = options.defaultValue || '';
                inputField.placeholder = options.placeholder || '';
                if (options.inputType) inputField.type = options.inputType;
                setTimeout(() => inputField.focus(), 50);
            } else if (type === 'iconPicker') {
                iconPickerContainer.classList.remove('hidden');
                commonIcons.forEach(icon => {
                    const iconEl = document.createElement('button');
                    iconEl.className = 'modal-icon-btn';
                    if (icon.class === selectedIconClass) iconEl.classList.add('selected');
                    iconEl.innerHTML = `<i class="${icon.class}"></i><span>${icon.name}</span>`;
                    iconEl.dataset.iconClass = icon.class;
                    iconEl.title = icon.name;
                    iconEl.addEventListener('click', () => {
                        iconPickerContainer.querySelectorAll('.modal-icon-btn').forEach(btn => btn.classList.remove('selected'));
                        iconEl.classList.add('selected');
                        selectedIconClass = icon.class;
                    });
                    iconPickerContainer.appendChild(iconEl);
                });
                const noIconEl = document.createElement('button');
                noIconEl.className = 'modal-icon-btn';
                if ('fas fa-map-pin' === selectedIconClass && !commonIcons.find(ic => ic.class === selectedIconClass) ) noIconEl.classList.add('selected');
                noIconEl.innerHTML = `<i class="fas fa-ban"></i><span>Default</span>`;
                noIconEl.dataset.iconClass = 'fas fa-map-pin';
                noIconEl.title = 'Use Default Icon';
                noIconEl.addEventListener('click', () => {
                    iconPickerContainer.querySelectorAll('.modal-icon-btn').forEach(btn => btn.classList.remove('selected'));
                    noIconEl.classList.add('selected');
                    selectedIconClass = noIconEl.dataset.iconClass;
                });
                iconPickerContainer.appendChild(noIconEl);
            } else if (type === 'alert') {
                cancelBtn.style.display = 'none';
            }

            overlay.classList.remove('hidden');

            const onConfirm = () => {
                cleanupAndHide();
                if (type === 'prompt') resolve(inputField.value);
                else if (type === 'iconPicker') resolve(selectedIconClass);
                else resolve(true);
            };

            const onCancel = () => {
                cleanupAndHide();
                resolve(false);
            };

            confirmBtn.addEventListener('click', onConfirm);
            if (type !== 'alert') cancelBtn.addEventListener('click', onCancel);
            closeBtn.addEventListener('click', onCancel);

            currentModalEscHandler = (e) => {
                if (e.key === 'Escape') {
                    if (type === 'alert') onConfirm();
                    else onCancel();
                }
            };
            document.addEventListener('keydown', currentModalEscHandler);

            function cleanupAndHide() {
                if (currentModalEscHandler) {
                    document.removeEventListener('keydown', currentModalEscHandler);
                    currentModalEscHandler = null;
                }
                overlay.classList.add('hidden');
            }
        });
    }

    function getOrCreateActivityPlaceholder() {
        if (!activityPlaceholder) {
            activityPlaceholder = document.createElement('li');
            activityPlaceholder.classList.add('activity-placeholder');
        }
        return activityPlaceholder;
    }

    function renderItinerary() {
        itineraryBoard.innerHTML = '';
        if (mockDaysData.length > 0) {
            mockDaysData.forEach((dayData, index) => {
                const dayCard = createDayCardElement(dayData);
                dayCard.style.animationDelay = `${index * 100}ms`;
                itineraryBoard.appendChild(dayCard);
            });
        }
    }

    function createDayCardElement(dayData) {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        dayCard.dataset.dayId = dayData.id;
        const imageHTML = dayData.image ? `
            <div class="day-image-container">
                <img src="${dayData.image}" alt="${dayData.title}" loading="lazy">
            </div>` : '';

        dayCard.innerHTML = `
            <div class="day-card-header">
                <div class="day-number-label">${dayData.dayNumberText}</div>
                <div class="day-title-theme"><h2>${dayData.title}</h2></div>
                <button class="delete-day-btn" data-day-id="${dayData.id}" title="Delete this day"><i class="fas fa-trash-alt"></i></button>
            </div>
            ${imageHTML}
            <ul class="activities-list" data-day-id="${dayData.id}"></ul>
            <button class="add-activity-btn" data-day-id="${dayData.id}" title="Add new activity to this day"><i class="fas fa-plus-circle"></i> Add Activity</button>
        `;
        const activitiesListEl = dayCard.querySelector('.activities-list');
        renderActivitiesForDay(activitiesListEl, dayData.activities);

        activitiesListEl.addEventListener('dragover', handleDragOverList);
        activitiesListEl.addEventListener('dragenter', handleDragEnterList);
        activitiesListEl.addEventListener('dragleave', handleDragLeaveList);
        activitiesListEl.addEventListener('drop', handleDropOnList);
        return dayCard;
    }

    function renderActivitiesForDay(listElement, activities) {
        listElement.innerHTML = '';
        activities.forEach(activity => {
            const activityItem = createActivityItemElement(activity, listElement.dataset.dayId);
            listElement.appendChild(activityItem);
        });
    }

    function createActivityItemElement(activity, dayId) {
        const activityItem = document.createElement('li');
        activityItem.classList.add('activity-item');
        activityItem.setAttribute('draggable', 'true');
        activityItem.dataset.activityId = activity.id;
        activityItem.dataset.dayId = dayId;

        const iconHtml = activity.icon ? `<i class="icon ${activity.icon}"></i>` : `<i class="icon fas fa-map-pin"></i>`;

        activityItem.innerHTML = `
            <span class="drag-handle" title="Drag this note"><i class="fas fa-arrows-up-down-left-right"></i></span>
            ${iconHtml}
            <span class="time">${activity.time}</span>
            <span class="description">${activity.description}</span>
            <div class="activity-actions">
                <button class="edit-activity-btn" data-activity-id="${activity.id}" data-day-id="${dayId}" title="Edit this activity"><i class="fas fa-pencil-alt"></i></button>
                <button class="delete-activity-btn" data-activity-id="${activity.id}" data-day-id="${dayId}" title="Delete this activity"><i class="fas fa-times"></i></button>
            </div>
        `;
        activityItem.addEventListener('dragstart', handleDragStartActivity);
        activityItem.addEventListener('dragend', handleDragEndActivity);
        return activityItem;
    }

    function renderSingleDayActivities(dayId) {
        const dayData = mockDaysData.find(d => d.id === dayId);
        if (!dayData) return;
        const dayCardElement = itineraryBoard.querySelector(`.day-card[data-day-id="${dayId}"]`);
        if (!dayCardElement) return;
        const activitiesListEl = dayCardElement.querySelector('.activities-list');
        if (!activitiesListEl) return;

        const oldScrollTop = activitiesListEl.scrollTop;
        renderActivitiesForDay(activitiesListEl, dayData.activities);
        activitiesListEl.scrollTop = oldScrollTop;
    }

    function handleDragStartActivity(e) {
        if (e.target.closest('.delete-activity-btn') || e.target.closest('.edit-activity-btn')) {
            e.preventDefault();
            return;
        }
        draggedActivityElement = e.target.closest('.activity-item');
        if (!draggedActivityElement) return;

        sourceActivityId = draggedActivityElement.dataset.activityId;
        sourceDayId = draggedActivityElement.dataset.dayId;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', sourceActivityId);
        setTimeout(() => {
            if (draggedActivityElement) draggedActivityElement.classList.add('dragging');
        }, 0);
        getOrCreateActivityPlaceholder();
    }

    function handleDragEndActivity() {
        const elementThatWasDragged = document.querySelector('.activity-item.dragging');
        if (elementThatWasDragged) elementThatWasDragged.classList.remove('dragging');
        else if (draggedActivityElement) draggedActivityElement.classList.remove('dragging');

        if (activityPlaceholder && activityPlaceholder.parentNode) {
            activityPlaceholder.parentNode.removeChild(activityPlaceholder);
        }
        if (currentOverList) {
            currentOverList.classList.remove('drag-over-active');
        }
        draggedActivityElement = null;
        sourceDayId = null;
        sourceActivityId = null;
        currentOverList = null;
    }

    function handleDragOverList(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const list = e.target.closest('.activities-list');
        if (!list || !draggedActivityElement) return;

        const placeholder = getOrCreateActivityPlaceholder();
        const afterElement = getDragAfterElement(list, e.clientY);

        if (placeholder.parentNode !== list || placeholder.nextSibling !== afterElement) {
            if (afterElement == null) list.appendChild(placeholder);
            else list.insertBefore(placeholder, afterElement);
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.activity-item:not(.dragging):not(.activity-placeholder)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function handleDragEnterList(e) {
        e.preventDefault();
        const list = e.target.closest('.activities-list');
        if (list && list !== currentOverList) {
            if (currentOverList) currentOverList.classList.remove('drag-over-active');
            list.classList.add('drag-over-active');
            currentOverList = list;
        }
    }

    function handleDragLeaveList(e) {
        const list = e.target.closest('.activities-list');
        if (list && list === currentOverList) {
            const rect = list.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX >= rect.right || e.clientY < rect.top || e.clientY >= rect.bottom) {
                list.classList.remove('drag-over-active');
                currentOverList = null;
                if (activityPlaceholder && activityPlaceholder.parentNode === list) {
                    list.removeChild(activityPlaceholder);
                }
            }
        }
    }

    function handleDropOnList(e) {
        e.preventDefault();
        const targetListElement = currentOverList || e.target.closest('.activities-list');
        const elementToSettle = draggedActivityElement;

        if (!targetListElement || !elementToSettle) {
            if (currentOverList) currentOverList.classList.remove('drag-over-active');
            currentOverList = null;
            if (activityPlaceholder && activityPlaceholder.parentNode) activityPlaceholder.parentNode.removeChild(activityPlaceholder);
            return;
        }

        const targetDayId = targetListElement.dataset.dayId;
        const sourceDayData = mockDaysData.find(day => day.id === sourceDayId);
        let activityToMove;
        let originalSourceActivityIndex = -1;

        if (sourceDayData) {
            originalSourceActivityIndex = sourceDayData.activities.findIndex(act => act.id === sourceActivityId);
            if (originalSourceActivityIndex > -1) {
                [activityToMove] = sourceDayData.activities.splice(originalSourceActivityIndex, 1);
            }
        }

        if (!activityToMove) {
            console.error("Data Error: Activity not found in source during drop.");
            if (elementToSettle && elementToSettle.parentNode) elementToSettle.classList.remove('dragging');
            return;
        }

        const targetDayData = mockDaysData.find(day => day.id === targetDayId);
        if (targetDayData) {
            let targetDataInsertionIndex = 0;
            const itemsInList = Array.from(targetListElement.children);
            const placeholderDomIndex = itemsInList.indexOf(activityPlaceholder);

            if (placeholderDomIndex > -1) {
                targetDataInsertionIndex = itemsInList.slice(0, placeholderDomIndex)
                    .filter(child => child.classList.contains('activity-item') && !child.classList.contains('dragging') && !child.classList.contains('activity-placeholder'))
                    .length;
            } else {
                const afterElement = getDragAfterElement(targetListElement, e.clientY);
                if (afterElement) {
                    const allActualItems = Array.from(targetListElement.querySelectorAll('.activity-item:not(.dragging):not(.activity-placeholder)'));
                    const idx = allActualItems.indexOf(afterElement);
                    targetDataInsertionIndex = idx !== -1 ? idx : targetDayData.activities.length;
                } else {
                    targetDataInsertionIndex = targetDayData.activities.length;
                }
            }
            targetDayData.activities.splice(targetDataInsertionIndex, 0, activityToMove);

            if (sourceDayId !== targetDayId) {
                elementToSettle.dataset.dayId = targetDayId;
                const deleteBtn = elementToSettle.querySelector('.delete-activity-btn');
                if (deleteBtn) deleteBtn.dataset.dayId = targetDayId;
                const editBtn = elementToSettle.querySelector('.edit-activity-btn');
                if (editBtn) editBtn.dataset.dayId = targetDayId;
            }

            if (activityPlaceholder && activityPlaceholder.parentNode === targetListElement) {
                targetListElement.insertBefore(elementToSettle, activityPlaceholder);
            } else if (getDragAfterElement(targetListElement, e.clientY)) {
                targetListElement.insertBefore(elementToSettle, getDragAfterElement(targetListElement, e.clientY));
            } else {
                targetListElement.appendChild(elementToSettle);
            }

            elementToSettle.classList.remove('dragging');

            setTimeout(() => {
                if (!elementToSettle || !elementToSettle.isConnected) return;

                elementToSettle.classList.add('settling');
                elementToSettle.addEventListener('animationend', function handleSettleAnimationEnd(event) {
                    if (event.animationName === 'activitySettle' && event.target === elementToSettle) {
                         if (event.target && event.target.isConnected) {
                            event.target.classList.remove('settling');
                         }
                    }
                }, { once: true });
            }, 0);

        } else {
            console.error("Data Error: Target day not found during drop.");
            if (sourceDayData && activityToMove && originalSourceActivityIndex > -1) {
                sourceDayData.activities.splice(originalSourceActivityIndex, 0, activityToMove);
            }
            if (elementToSettle && elementToSettle.parentNode) elementToSettle.classList.remove('dragging');
        }

        if (activityPlaceholder && activityPlaceholder.parentNode) {
            activityPlaceholder.parentNode.removeChild(activityPlaceholder);
        }
        if (currentOverList) {
            currentOverList.classList.remove('drag-over-active');
        }
        currentOverList = null;
    }

    async function addDay() {
        const newDayNumber = mockDaysData.length + 1;

        const newDayTitle = await showModal('prompt',
            `Add New Day (Day ${newDayNumber})`,
            `Let's plan Day ${newDayNumber}! What will be its theme or title?`,
            { defaultValue: "New Adventures", inputLabel: 'Day Title:', confirmText: 'Create Day' }
        );

        if (newDayTitle === false || newDayTitle === null) return;
        if (newDayTitle.trim() === "") {
            await showModal('alert', 'Oops!', 'A day title is needed to proceed.\nPlease provide a title for your new day.');
            return;
        }

        const newImage = defaultNewDayImages[nextNewDayImageIndex % defaultNewDayImages.length];
        nextNewDayImageIndex++;

        const newDayId = `day${Date.now()}`;
        mockDaysData.push({
            id: newDayId,
            dayNumberText: `Day ${newDayNumber}`,
            title: newDayTitle.trim(),
            image: newImage,
            activities: []
        });
        renderItinerary();
    }

    async function deleteDay(dayIdToDelete) {
        const dayToDelete = mockDaysData.find(d => d.id === dayIdToDelete);
        if (!dayToDelete) return;

        const confirmed = await showModal('confirm',
            `Delete ${dayToDelete.dayNumberText}: ${dayToDelete.title}?`,
            `Are you absolutely sure you want to remove this entire day and all its planned activities? This action cannot be undone.`,
            { confirmText: 'Yes, Delete Day', cancelText: 'No, Keep It' }
        );

        if (!confirmed) return;

        mockDaysData = mockDaysData.filter(day => day.id !== dayIdToDelete);
        mockDaysData.forEach((day, index) => {
            day.dayNumberText = `Day ${index + 1}`;
        });
        renderItinerary();
    }

    async function addActivityToDay(dayId) {
        const day = mockDaysData.find(d => d.id === dayId);
        if (!day) return;

        const time = await showModal('prompt', `Add Activity to ${day.dayNumberText}`, `What time is this activity scheduled for?`, { inputLabel: 'Time (e.g., 10:00 AM):', defaultValue: "12:00", inputType: 'time', confirmText: 'Next' });
        if (time === false || time === null) return;
        if (time.trim() === "") { await showModal('alert', 'Missing Time', 'Please provide a time for the activity.'); return; }

        const description = await showModal('prompt', `Add Activity to ${day.dayNumberText}`, `Describe the activity for ${time}:`, { inputLabel: 'Activity Description:', defaultValue: "Explore local market", confirmText: 'Next' });
        if (description === false || description === null) return;
        if (description.trim() === "") { await showModal('alert', 'Missing Description', 'Please describe the activity.'); return; }

        const iconClass = await showModal('iconPicker',
            `Choose Icon for "${description.substring(0,25)}..."`,
            `Select an icon that best represents this activity, or choose 'Default'.`,
            { confirmText: 'Add Activity', defaultIcon: 'fas fa-map-pin' }
        );
        if (iconClass === false || iconClass === null) return;

        const newActivityId = `act${Date.now()}`;
        day.activities.push({
            id: newActivityId,
            time: time.trim(),
            description: description.trim(),
            icon: iconClass
        });
        renderSingleDayActivities(dayId);
    }

    async function editActivity(dayId, activityIdToEdit) {
        const day = mockDaysData.find(d => d.id === dayId);
        if (!day) return;
        const activity = day.activities.find(act => act.id === activityIdToEdit);
        if (!activity) return;

        const newTime = await showModal('prompt',
            `Edit Time for Activity`,
            `Current time: ${activity.time}. Enter new time:`,
            { inputLabel: 'New Time (e.g., 10:00 AM):', defaultValue: activity.time, inputType: 'time', confirmText: 'Next' }
        );
        if (newTime === false || newTime === null) return;
        if (newTime.trim() === "") { await showModal('alert', 'Missing Time', 'Please provide a time for the activity.'); return; }


        const newDescription = await showModal('prompt',
            `Edit Description for Activity`,
            `Activity at ${newTime}. Current description:\n"${activity.description}"`,
            { inputLabel: 'New Description:', defaultValue: activity.description, confirmText: 'Next' }
        );
        if (newDescription === false || newDescription === null) return;
        if (newDescription.trim() === "") { await showModal('alert', 'Missing Description', 'Please describe the activity.'); return; }

        const newIconClass = await showModal('iconPicker',
            `Edit Icon for "${newDescription.substring(0,25)}..."`,
            `Select a new icon or keep the current one.`,
            { confirmText: 'Save Changes', defaultIcon: activity.icon || 'fas fa-map-pin' }
        );
        if (newIconClass === false || newIconClass === null) return;

        activity.time = newTime.trim();
        activity.description = newDescription.trim();
        activity.icon = newIconClass;

        renderSingleDayActivities(dayId);
    }

    async function deleteActivityFromDay(dayId, activityIdToDelete) {
        const day = mockDaysData.find(d => d.id === dayId);
        if (!day) return;
        const activity = day.activities.find(act => act.id === activityIdToDelete);
        if (!activity) return;

        day.activities = day.activities.filter(act => act.id !== activityIdToDelete);
        renderSingleDayActivities(dayId);
    }

    if (addDayBtn) addDayBtn.addEventListener('click', addDay);

    itineraryBoard.addEventListener('click', function(e) {
        const deleteDayButton = e.target.closest('.delete-day-btn');
        const addActivityButton = e.target.closest('.add-activity-btn');
        const editActivityButton = e.target.closest('.edit-activity-btn');
        const deleteActivityButton = e.target.closest('.delete-activity-btn');

        if (deleteDayButton) {
            deleteDay(deleteDayButton.dataset.dayId);
        } else if (addActivityButton) {
            addActivityToDay(addActivityButton.dataset.dayId);
        } else if (editActivityButton) {
            editActivity(editActivityButton.dataset.dayId, editActivityButton.dataset.activityId);
        } else if (deleteActivityButton) {
            deleteActivityFromDay(deleteActivityButton.dataset.dayId, deleteActivityButton.dataset.activityId);
        }
    });

    renderItinerary();
});