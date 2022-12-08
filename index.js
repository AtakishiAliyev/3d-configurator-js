const modelViewerTexture = document.querySelector("model-viewer");
customElements.get("model-viewer").minimumRenderScale = 1;

modelViewerTexture.addEventListener("load", (ev) => {
    modelViewerTexture.model.materials.forEach(material => {
        const selectOption = document.querySelector('#materialName');
        selectOption.innerHTML += `<option value="${material.name}">${material.name}</option>`
    })

    document.getElementById("materialName").onchange = function () {
        const option = document.querySelector("#materialName").value;

        modelViewerTexture.model.materials.forEach((material) => {
            const mat = modelViewerTexture.model.materials[material.index].pbrMetallicRoughness.baseColorFactor;
            mat[3] = 0;
            modelViewerTexture.model.materials[material.index].pbrMetallicRoughness.setBaseColorFactor(mat);

            if (option === material.name) {
                changeMaterial(material.index);
            }
        });
    };

    const changeMaterial = (index) => {
        const material = modelViewerTexture.model.materials[index].pbrMetallicRoughness.baseColorFactor;
        material[3] = 1;
        modelViewerTexture.model.materials[index].pbrMetallicRoughness.setBaseColorFactor(material);
    };
});
