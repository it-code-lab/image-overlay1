// script.js
const imageUpload = document.getElementById('imageUpload');
const pasteImage = document.getElementById('pasteImage');
const previewCanvas = document.getElementById('previewCanvas');
const finalCanvas = document.getElementById('finalCanvas');
const layoutType = document.getElementById('layoutType');
const heading = document.getElementById('heading');
const bullets = document.getElementById('bullets');
const infoText = document.getElementById('infoText');
const fontSize = document.getElementById('fontSize');
const fontColor = document.getElementById('fontColor');
const bgColor = document.getElementById('bgColor');
const fontStyle = document.getElementById('fontStyle');
const textAlign = document.getElementById('textAlign');
const shadow = document.getElementById('shadow');
const border = document.getElementById('border');
const downloadButton = document.getElementById('downloadButton');
const imageContainer = document.getElementById('imageContainer'); // Get the container

let image;
let designs = []; // Store generated designs
let selectedDesign = null; // Initialize to null

// Image Upload
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        image = new Image();
        image.onload = () => {
            drawImage(previewCanvas, image);
            generateDesigns();
        };
        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// Paste Image
document.addEventListener('paste', async (event) => {
    let items = (event.clipboardData || event.originalEvent.clipboardData).items;
    if (items) { // Check if items exist (for browsers that support it)
        for (let index in items) {
            let item = items[index];
            if (item.kind === 'file' && item.type.startsWith('image/')) {
                event.preventDefault(); // Prevent default paste behavior
                let blob = item.getAsFile();
                handlePastedImage(blob);
                return; // Exit after handling the image
            }
        }
    } else {
        // Fallback for very old browsers (unlikely to have images in clipboard anyway)
        alert("Your browser does not support pasting images. Please use the 'Upload Image' option.");
    }
});


function handlePastedImage(blob) {
    const reader = new FileReader();
    reader.onload = (event) => {
        image = new Image();
        image.onload = () => {
            drawImage(previewCanvas, image);
            generateDesigns();
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(blob);
}


// Design Generation and Preview
function generateDesigns() {
    if (!image) return;

    designs = []; // Clear previous designs
    const layout = layoutType.value;
    const text = (layout === 'headingBullets') ? heading.value : (layout === 'bullets') ? bullets.value : (layout === 'info')? infoText.value : heading.value;

    const variations = [
        { x: 0.1, y: 0.1, align: 'left', bgColor: 'rgba(0,0,0,0.5)', color: 'white' },
        { x: 0.5, y: 0.1, align: 'center', bgColor: 'rgba(255,255,255,0.7)', color: 'black' },
        { x: 0.9, y: 0.1, align: 'right', bgColor: 'rgba(0,0,0,0.7)', color: 'yellow' },
        { x: 0.1, y: 0.5, align: 'left', bgColor: 'rgba(255, 0, 0, 0.5)', color: 'white' }, // Example red background
        { x: 0.5, y: 0.5, align: 'center', bgColor: 'rgba(0, 255, 0, 0.5)', color: 'black' }, // Example green background
        { x: 0.9, y: 0.5, align: 'right', bgColor: 'rgba(0, 0, 255, 0.5)', color: 'white' }  // Example blue background
    ];

    variations.forEach(variation => {
        const design = {
            ...variation,
            text,
            layout,
            fontSize: parseInt(fontSize.value),
            fontColor: fontColor.value,
            fontStyle: fontStyle.value,
            shadow: shadow.checked,
            border: border.checked
        };
        designs.push(design);
    });

    renderPreviews();
}


function renderPreviews() {
    imageContainer.innerHTML = ''; // Clear previous previews

    designs.forEach((design, index) => {
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = 300;  // Reduced width
        previewCanvas.height = 224; // Reduced height (maintain aspect ratio)
        previewCanvas.style.margin = '5px';
        previewCanvas.style.cursor = 'pointer';
        previewCanvas.style.border = '1px solid #ccc'; // Add border for visibility


        drawImage(previewCanvas, image);
        drawText(previewCanvas, design);

        previewCanvas.addEventListener('click', () => {
            selectedDesign = { ...design }; // Create a copy!
            drawImage(finalCanvas, image);
            drawText(finalCanvas, selectedDesign);
            updateCustomizationOptions(); // Update customization inputs
        });

        imageContainer.appendChild(previewCanvas);
    });

    // Adjust preview container width dynamically (optional)
    const numPreviews = designs.length;
    //imageContainer.style.width = `${numPreviews * 160}px`; // 160px per preview (including margin)
    imageContainer.style.overflowX = 'auto'; // Add horizontal scroll if needed
}

function updateCustomizationOptions() {
    if (!selectedDesign) return;

    fontSize.value = selectedDesign.fontSize;
    fontColor.value = selectedDesign.fontColor;
    bgColor.value = selectedDesign.bgColor || '#000000'; // Set default if not defined
    fontStyle.value = selectedDesign.fontStyle;
    textAlign.value = selectedDesign.align;
    shadow.checked = selectedDesign.shadow;
    border.checked = selectedDesign.border;

    // Add more customization options and set their values here
    // For example, if you add position controls:
    // xPosition.value = selectedDesign.x * 100; // Assuming x is 0-1
    // yPosition.value = selectedDesign.y * 100;
}

// Event listeners for customization changes (add these)
fontSize.addEventListener('input', () => {
    if (selectedDesign) {
        selectedDesign.fontSize = parseInt(fontSize.value);
        drawText(finalCanvas, selectedDesign);
    }
});

fontColor.addEventListener('input', () => {
    if (selectedDesign) {
        selectedDesign.fontColor = fontColor.value;
        drawText(finalCanvas, selectedDesign);
    }
});

bgColor.addEventListener('input', () => {
    if (selectedDesign) {
        selectedDesign.bgColor = bgColor.value;
        drawText(finalCanvas, selectedDesign);
    }
});

fontStyle.addEventListener('change', () => {
    if (selectedDesign) {
        selectedDesign.fontStyle = fontStyle.value;
        drawText(finalCanvas, selectedDesign);
    }
});

textAlign.addEventListener('change', () => {
    if (selectedDesign) {
        selectedDesign.align = textAlign.value;
        drawText(finalCanvas, selectedDesign);
    }
});

shadow.addEventListener('change', () => {
    if (selectedDesign) {
        selectedDesign.shadow = shadow.checked;
        drawText(finalCanvas, selectedDesign);
    }
});

border.addEventListener('change', () => {
    if (selectedDesign) {
        selectedDesign.border = border.checked;
        drawText(finalCanvas, selectedDesign);
    }
});


// Example for position controls (add these to your HTML):
xPosition.addEventListener('input', () => {
    if (selectedDesign) {
        selectedDesign.x = parseFloat(xPosition.value) / 100;
        drawText(finalCanvas, selectedDesign);
    }
});

yPosition.addEventListener('input', () => {
    if (selectedDesign) {
        selectedDesign.y = parseFloat(yPosition.value) / 100;
        drawText(finalCanvas, selectedDesign);
    }
});

function drawImage(canvas, img) {
    const ctx = canvas.getContext('2d');
    const aspectRatio = img.height / img.width;
    canvas.height = canvas.width * aspectRatio; // Maintain aspect ratio

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function drawText(canvas, design) {
    const ctx = canvas.getContext('2d');
    ctx.font = `${design.fontStyle} ${design.fontSize}px sans-serif`;
    ctx.fillStyle = design.fontColor;
    ctx.textAlign = design.align;

    const lines = design.text.split('\n'); // Split into lines for bullets

    let y = design.y * canvas.height;
    const lineHeight = design.fontSize * 1.2; // Adjust line height as needed

    lines.forEach(line => {
        const x = design.align === 'left' ? design.x * canvas.width :
                  design.align === 'center' ? canvas.width / 2 :
                  design.x * canvas.width;


        if (design.bgColor) {
            ctx.fillStyle = design.bgColor;
            const metrics = ctx.measureText(line);
            const rectX = design.align === 'left' ? x : design.align === 'center' ? x - metrics.width / 2 : x - metrics.width;
            ctx.fillRect(rectX - 5, y - lineHeight + 5, metrics.width + 10, lineHeight);
            ctx.fillStyle = design.fontColor;

        }

        ctx.fillText(line, x, y);

        if (design.shadow) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.fillText(line, x, y); // Redraw with shadow
            ctx.shadowColor = 'transparent'; // Reset shadow
        }
        if (design.border) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            const metrics = ctx.measureText(line);
            const rectX = design.align === 'left' ? x : design.align === 'center' ? x - metrics.width / 2 : x - metrics.width;
            ctx.strokeRect(rectX - 5, y - lineHeight + 5, metrics.width + 10, lineHeight);
        }

        y += lineHeight;
    });
}



// Event listeners for input changes
layoutType.addEventListener('change', generateDesigns);
heading.addEventListener('input', generateDesigns);
bullets.addEventListener('input', generateDesigns);
infoText.addEventListener('input', generateDesigns);
fontSize.addEventListener('input', generateDesigns);
fontColor.addEventListener('input', generateDesigns);
fontStyle.addEventListener('change', generateDesigns);
textAlign.addEventListener('change', generateDesigns);
shadow.addEventListener('change', generateDesigns);
border.addEventListener('change', generateDesigns);



// Download functionality
downloadButton.addEventListener('click', () => {
    if (selectedDesign) {
        const link = document.createElement('a');
        link.download = 'thumbnail.png';
        link.href = finalCanvas.toDataURL('image/png');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

const copyButton = document.createElement('button'); // Create the button
copyButton.textContent = 'Copy to Clipboard';
copyButton.id = 'copyButton';
copyButton.classList.add('upload-button'); // Use the same style as upload button
document.querySelector('.final-selection').appendChild(copyButton); // Add to final-selection


copyButton.addEventListener('click', async () => {
    if (selectedDesign) {
        try {
            const blob = await new Promise(resolve => finalCanvas.toBlob(resolve, 'image/png')); // Get blob from canvas
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]);
            alert('Image copied to clipboard!'); // Or a less intrusive notification
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy image. Check console.'); // User-friendly error message
        }
    }
});