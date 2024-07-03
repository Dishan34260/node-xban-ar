document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('model', document.getElementById('model').files[0]);
    formData.append('marker', document.getElementById('marker').files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            alert('Upload successful!');
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function startAR() {
    fetch('/getModels')
        .then(response => response.json())
        .then(data => {
            const arScene = document.getElementById('ar-scene');
            arScene.style.display = 'block';

            data.forEach((item, index) => {
                const markerId = `marker${index + 1}`;
                const modelId = `model${index + 1}`;

                const marker = document.createElement('a-marker');
                marker.setAttribute('id', markerId);
                marker.setAttribute('type', 'pattern');
                marker.setAttribute('url', item.markerPath);

                const model = document.createElement('a-entity');
                model.setAttribute('id', modelId);
                model.setAttribute('gltf-model', `url(${item.modelPath})`);
                model.setAttribute('scale', '0.5 0.5 0.5');

                marker.appendChild(model);
                arScene.querySelector('a-scene').appendChild(marker);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}