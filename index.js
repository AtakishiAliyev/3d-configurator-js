const modelViewerTexture = document.querySelector("model-viewer");

customElements.get("model-viewer").minimumRenderScale = 1;

modelViewerTexture.addEventListener("load", (ev) => {
    const dynamicMaterials = [6, 9, 13, 16, 18, 20, 22];
    const materialGroup = [
        {
            name: "foil",
            index: [20, 13],
        },
        {
            name: "shingles",
            index: [6, 18, 22],
        },
        {
            name: "straws",
            index: [6, 9, 13, 16, 18],
        },
        {
            name: "roofDefault",
            index: [6, 18],
        },
    ];


    modelViewerTexture.model.materials.forEach(material => {
        const selectOption = document.querySelector('#materialName');
        selectOption.innerHTML += `<option value="${material.name}">${material.name}</option>`



    })



    let foil = [modelViewerTexture.model.materials[20], modelViewerTexture.model.materials[13]];

    let shingles = [modelViewerTexture.model.materials[6], modelViewerTexture.model.materials[18], modelViewerTexture.model.materials[22]];

    let straws = [modelViewerTexture.model.materials[6], modelViewerTexture.model.materials[9], modelViewerTexture.model.materials[13], modelViewerTexture.model.materials[16], modelViewerTexture.model.materials[18]];

    let roofDefault = [modelViewerTexture.model.materials[6], modelViewerTexture.model.materials[18]];

    let variantsArr = [foil, shingles, straws];

    function defaultVariant(variants) {
        variants.forEach((variant) => {
            variant.forEach((material) => {
                let factor = material.pbrMetallicRoughness.baseColorFactor;
                factor[3] = 0;
                material.pbrMetallicRoughness.setBaseColorFactor(factor);
            });
        });
    }

    defaultVariant(variantsArr);

    document.querySelectorAll(".colorPicker").forEach((e) => {
        e.addEventListener("click", (event) => {
            var color = JSON.parse("[" + event.target.name + "]");
            material.pbrMetallicRoughness.setBaseColorFactor(color);
        });
    });

    document.getElementById("materialName").onchange = function () {
        roofChanger();
    };

    const changeMaterial = (name, index) => {
        const material = modelViewerTexture.model.materials[index].pbrMetallicRoughness.baseColorFactor;
        material[3] = 1;
        modelViewerTexture.model.materials[index].pbrMetallicRoughness.setBaseColorFactor(material);
    };

    const roofChanger = () => {
        const option = document.querySelector("#materialName").value;

        console.log(option);

        modelViewerTexture.model.materials.forEach((material) => {
            const mat = modelViewerTexture.model.materials[material.index].pbrMetallicRoughness.baseColorFactor;
            mat[3] = 0;
            modelViewerTexture.model.materials[material.index].pbrMetallicRoughness.setBaseColorFactor(mat);

            modelViewerTexture.model.materials.forEach((item) => {
                if (option === item.name) {
                    changeMaterial(item.name, item.index);
                }
            });
        });
    };
});
