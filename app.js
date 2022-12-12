import { dynamicMaterials, materialGroup } from './data.js';

const modelViewerTexture = document.querySelector("model-viewer");
customElements.get("model-viewer").minimumRenderScale = 1;

modelViewerTexture.addEventListener("load", (event) => {
    const createOption = (name) => {
        const options = materialGroup.map(element => {
            if (element.category === name) {
                return `<option ${element.default && 'selected'}>${element.name}</option>`
            }
        }).join('')

        return options
    }

    dynamicMaterials.forEach(item => {
        const modelFilter = document.querySelector('.model-filter-wrapper')
        modelFilter.innerHTML += `<div class="item">
          <label for="${item.name}">${item.label}</label>
          <select class="materialType" name="${item.name}">
            ${createOption(item.name)}
          </select>
        </div>`
    })

    const materialType = document.querySelectorAll(".materialType");

    const openMaterial = (arr, type) => {
        arr.forEach((el) => {
            const material =
                modelViewerTexture.model.materials[el].pbrMetallicRoughness
                    .baseColorFactor;
            material[3] = type ? 1 : 0;
            modelViewerTexture.model.materials[
                el
            ].pbrMetallicRoughness.setBaseColorFactor(material);
        });
    };

    const changeMaterial = (dynamic, option) => {
        openMaterial(dynamic, false)

        materialGroup.forEach((item) => {
            if (option === item.name) {
                openMaterial(item.index, true);
            }
        });
    };

    const roofChanger = (name) => {
        const option = document.querySelector(`select[name=${name}]`).value;

        dynamicMaterials.forEach(dynamicMaterial => {
            if (name === dynamicMaterial.name) {
                changeMaterial(dynamicMaterial.index, option);
            }
        })
    };

    materialType.forEach(select => {
        roofChanger(select.name);

        select.onchange = function () {
            roofChanger(select.name);
        };
    })
});