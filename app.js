console.log('ok')
import { dynamicMaterials, materialGroup } from './data.js';

const modelViewer = document.querySelector("model-viewer");
customElements.get("model-viewer").minimumRenderScale = 1;
const checkbox = modelViewer.querySelector('#show-dimensions');

function setVisibility(element) {
    if (checkbox.checked) {
        element.classList.remove('hide');
    } else {
        element.classList.add('hide');
    }
}


checkbox.addEventListener('change', () => {
    setVisibility(modelViewer.querySelector('#lines'));
    modelViewer.querySelectorAll('button').forEach((hotspot) => {
        setVisibility(hotspot);
    });
});

modelViewer.addEventListener("load", (event) => {
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
                modelViewer.model.materials[el].pbrMetallicRoughness
                    .baseColorFactor;
            material[3] = type ? 1 : 0;
            modelViewer.model.materials[
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



    // ! Annotations

    modelViewer.addEventListener('click', function (event) {
        const hotspotCounter = Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);

        const rect = modelViewer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const dataPosition = modelViewer.positionAndNormalFromPoint(x, y);

        if (dataPosition == null) {
            return;
        }

        const { position, normal } = dataPosition;

        const mod = document.querySelector('#hotspotDiv')

        const hotspot = document.createElement('button');
        hotspot.slot = `hotspot-${hotspotCounter}`;
        hotspot.classList.add('hotspot');
        hotspot.dataset.position = position.toString();
        if (normal != null) {
            hotspot.dataset.normal = normal.toString();
        }

        mod.after(hotspot)
    });

});


// ! Variants
const select = document.querySelector('#variant');

modelViewer.addEventListener('load', () => {
    const names = modelViewer.availableVariants;
    for (const name of names) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    }
});

select.addEventListener('input', (event) => {
    modelViewer.variantName = event.target.value;
});
