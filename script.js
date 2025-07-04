const CDN = 'https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights';

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(CDN),
    faceapi.nets.faceLandmark68Net.loadFromUri(CDN),
    faceapi.nets.ageGenderNet.loadFromUri(CDN)
]).then(() => console.log('Модели загружены'));

const imgUpload = document.getElementById('imageUpload');
const preview = document.getElementById('imagePreview');
const output = document.getElementById('output');
const loader = document.getElementById('loader');

imgUpload.addEventListener('change', async () => {
    const file = imgUpload.files[0];
    if (!file) return;

    const img = await faceapi.bufferToImage(file);
    preview.src = img.src;
    output.textContent = '';
    loader.style.display = 'block';

    const det = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withAgeAndGender();

    loader.style.display = 'none';

    if (!det) {
        output.textContent = 'Лицо не найдено 😞';
        return;
    }

    const { gender, landmarks } = det;
    const jaw = landmarks.getJawOutline();
    const faceH = Math.abs(jaw[16].y - jaw[0].y);
    const headH = Math.max(...jaw.map(p => p.y)) - Math.min(...jaw.map(p => p.y));
    const ratio = headH / faceH;

    let percent;
    if (gender === 'female') {
        percent = 100;
        output.textContent = `обмудачился на ${percent}%, прям 1 в 1 виталик`;

    } else {
        percent = (ratio < 14)
            ? Math.floor(Math.random() * 11)          // 0–10%
            : Math.floor(50 + Math.random() * 21);    // 50–70%
        output.textContent = `обмудачился на ${percent}%, все еще можешь исправиться`;
    }


    // output.textContent = `обмудачился на ${percent}%`;
    output.classList.add('fade-in');
});