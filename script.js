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
const bgOpacity = document.getElementById('bgOpacity');
const fontStyle = document.getElementById('fontStyle');
const textAlign = document.getElementById('textAlign');
const shadow = document.getElementById('shadow');
const border = document.getElementById('border');
const downloadButton = document.getElementById('downloadButton');
const imageContainer = document.getElementById('imageContainer'); // Get the container
const fontFamily = document.getElementById('fontFamily'); // Get the select element
const xPosition = document.getElementById('xPosition'); // Get the input element
const yPosition = document.getElementById('yPosition');

let firstLoad = true;

let useCommonFontSize = false;
let useCommonFontColor = false;
let useCommonBgColor = false;
let useCommonBgOpacity = false;
let useCommonFontFamily = false;
let useCommonFontStyle = false;
let useCommonXPosition = false;
let useCommonYPosition = false;

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

function resetView() {
    firstLoad = true;

    useCommonFontSize = false;
    useCommonFontColor = false;
    useCommonBgColor = false;
    useCommonBgOpacity = false;
    useCommonFontFamily = false;
    useCommonFontStyle = false;
    useCommonXPosition = false;
    useCommonYPosition = false;

    generateDesigns();
}
function generateDesignsUpdate(flagToUpdate) {
    if (flagToUpdate =="fontSize"){
        useCommonFontSize = true
    }else if (flagToUpdate =="fontColor"){
        useCommonFontColor = true
    }else if (flagToUpdate =="bgColor"){
        useCommonBgColor = true
    }else if (flagToUpdate =="bgOpacity"){
        useCommonBgOpacity = true
    }else if (flagToUpdate =="fontFamily"){
        useCommonFontFamily = true
    }else if (flagToUpdate =="fontStyle"){
        useCommonFontStyle = true
    }else if (flagToUpdate =="xPosition"){
        useCommonXPosition = true
    }else if (flagToUpdate =="yPosition"){
        useCommonYPosition = true
    }
    
    firstLoad = false;
    generateDesigns();
}

// Design Generation and Preview
function generateDesigns() {
    if (!image) return;

    designs = []; // Clear previous designs
    const layout = layoutType.value;
    const text = (layout === 'headingBullets') ? heading.value : (layout === 'bullets') ? bullets.value : (layout === 'info')? infoText.value : heading.value;


    let variations;
    if (layout === 'center') {
        variations = [
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(0, 255, 0)', colorDefault: 'black' , bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif'}, // Example green background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(0, 255, 0)', colorDefault: 'white', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' }, // Example green background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(0, 255, 0)', colorDefault: 'yellow', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' }, // Example green background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(250, 247, 247)', colorDefault: 'black', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' }, // Example green background

            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(0,0,0)', colorDefault: 'white' , bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif'},
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(0, 0, 255)', colorDefault: 'white', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' },  // Example blue background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(255, 242, 0)', colorDefault: 'black', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' },  // Example blue background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(255, 242, 0)', colorDefault: 'white', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' },  // Example blue background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(255, 162, 0)', colorDefault: 'white', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' },  // Example blue background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(250, 247, 247)', colorDefault: 'orange', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' },  // Example blue background

        ];
    } else if (layout === 'bullets') {
        variations = [
            { xDefault: 0.2, yDefault: 0.2, alignDefault: 'center', bgColorDefault: 'rgb(0,0,0)', colorDefault: 'white', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' },
            { xDefault: 0.5, yDefault: 0.2, alignDefault: 'center', bgColorDefault: 'rgb(255,255,255)', colorDefault: 'black' , bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif'},
            { xDefault: 0.9, yDefault: 0.2, alignDefault: 'center', bgColorDefault: 'rgb(0,0,0)', colorDefault: 'yellow', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' },
            { xDefault: 0.2, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(244, 224, 9)', colorDefault: 'black', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' }, // Example red background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(0, 255, 0)', colorDefault: 'black', bgOpacityDefault: '0.8', fontFamilyDefault:'sans-serif' }, // Example green background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(0, 255, 0)', colorDefault: 'rgb(248, 216, 8)' , bgOpacityDefault: '0.8' , fontFamilyDefault:'sans-serif'}, // Example green background
            { xDefault: 0.5, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(0,0,0)', colorDefault: 'white' , bgOpacityDefault: '0.8' , fontFamilyDefault:'sans-serif'},
            { xDefault: 0.9, yDefault: 0.5, alignDefault: 'center', bgColorDefault: 'rgb(0, 0, 255)', colorDefault: 'white' , bgOpacityDefault: '0.8' , fontFamilyDefault:'sans-serif'}  // Example blue background
        ];
    }
    variations.forEach(variation => {
        const design = {
            ...variation,
            text,
            layout,
            fontSize: parseInt(fontSize.value),
            fontColor: fontColor.value,
            bgColor: bgColor.value,
            bgOpacity: bgOpacity.value,
            fontStyle: fontStyle.value,
            fontFamily: fontFamily.value, // Add fontFamily to the design object
            align: textAlign.value,
            shadow: shadow.checked,
            border: border.checked,
            color: fontColor.value,
            x: xPosition.value / 100, // Convert to 0-1 range
            y: yPosition.value / 100 // Convert to 0-1 range

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
    bgOpacity.value = selectedDesign.bgOpacity || 0.8; // Set default if not defined
    fontStyle.value = selectedDesign.fontStyle;
    fontFamily.value = selectedDesign.fontFamily;
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

bgOpacity.addEventListener('input', () => {
    if (selectedDesign) {
        selectedDesign.bgOpacity = parseFloat(bgOpacity.value);
        drawText(finalCanvas, selectedDesign);
    }
});
fontStyle.addEventListener('change', () => {
    if (selectedDesign) {
        selectedDesign.fontStyle = fontStyle.value;
        drawText(finalCanvas, selectedDesign);
    }
});

fontFamily.addEventListener('change', () => {
    if (selectedDesign) {
        selectedDesign.fontFamily = fontFamily.value;  // Update the font family in selectedDesign
        drawText(finalCanvas, selectedDesign); // Redraw the canvas
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
    // Set desired dimensions for final canvas
    if (canvas.id === 'finalCanvas') {
        canvas.width = 1200; // Example width (adjust as needed)
        canvas.height = canvas.width * aspectRatio; // Maintain aspect ratio
    } else {
        canvas.height = canvas.width * aspectRatio; // Maintain aspect ratio for preview
    }


    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function drawText(canvas, design) {
    const ctx = canvas.getContext('2d');

    if (firstLoad){
        design.x = design.xDefault;
        design.y = design.yDefault;
        design.align = design.alignDefault;
        design.bgColor = design.bgColorDefault;
        design.fontColor = design.colorDefault;
        design.bgOpacity = design.bgOpacityDefault;
        design.fontFamily = design.fontFamilyDefault;
    }else{
        if (!useCommonFontColor){
            design.fontColor = design.colorDefault;
        }
        if (!useCommonBgColor){
            design.bgColor = design.bgColorDefault;
        }
        if (!useCommonBgOpacity){
            design.bgOpacity = design.bgOpacityDefault;
        }
        if (!useCommonFontFamily){
            design.fontFamily = design.fontFamilyDefault;
        }
        if (!useCommonXPosition){
            design.x = design.xDefault;
        }
        if (!useCommonYPosition){
            design.y = design.yDefault;
        }
    }

    ctx.font = `${design.fontStyle} ${design.fontSize}px ${design.fontFamily}`; // Use design.fontFamily
    ctx.fillStyle = design.fontColor;
    ctx.textAlign = design.align;

    const lines = design.text.split('\n'); // Split into lines for bullets

    let y = design.y * canvas.height;
    const lineHeight = design.fontSize * 1.2; // Adjust line height as needed

    lines.forEach(line => {
        let x; // Declare x outside the if/else block

        if (design.align === 'left') {
            x = design.x * canvas.width;
        } else if (design.align === 'center') {
            x = canvas.width / 2;  // Center the text
        } else if (design.align === 'right') {
            x = canvas.width - (design.x * canvas.width); // Align to the right edge
        } else {
            x = design.x * canvas.width; // Default to left if alignment is invalid
        }


        if (design.bgColor) {
            ctx.fillStyle = design.bgColor;
            ctx.globalAlpha = design.bgOpacity;
            const metrics = ctx.measureText(line);
            let rectX;

            if (design.align === 'left') {
                rectX = x;
            } else if (design.align === 'center') {
                rectX = x - metrics.width / 2;
            } else if (design.align === 'right') {
                rectX = x - metrics.width;
            } else {
                rectX = x;
            }
            ctx.fillRect(rectX - 5, y - lineHeight + 5, metrics.width + 10, lineHeight);
            ctx.globalAlpha = 1; // Reset alpha for the text!
            ctx.fillStyle = design.fontColor;

        }
        
        ctx.textAlign = design.align; // Set text alignment here, after calculating x!
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

            let rectX;

            if (design.align === 'left') {
                rectX = x;
            } else if (design.align === 'center') {
                rectX = x - metrics.width / 2;
            } else if (design.align === 'right') {
                rectX = x - metrics.width;
            } else {
                rectX = x;
            }
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

fontSize.addEventListener('input', () => generateDesignsUpdate("fontSize"));
fontColor.addEventListener('input', () => generateDesignsUpdate("fontColor"));
bgColor.addEventListener('input', () => generateDesignsUpdate("bgColor"));
bgOpacity.addEventListener('change', () => generateDesignsUpdate("bgOpacity"));
fontStyle.addEventListener('change', () => generateDesignsUpdate("fontStyle"));
fontFamily.addEventListener('change', () => generateDesignsUpdate("fontFamily"));


textAlign.addEventListener('change', generateDesignsUpdate);
shadow.addEventListener('change', generateDesignsUpdate);
border.addEventListener('change', generateDesignsUpdate);

xPosition.addEventListener('input', () =>generateDesignsUpdate("xPosition"));
yPosition.addEventListener('input', () =>generateDesignsUpdate("yPosition"));

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