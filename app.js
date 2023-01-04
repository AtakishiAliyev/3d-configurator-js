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

// ! Dimensions

const modelViewer = document.querySelector("model-viewer");

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

modelViewer.addEventListener('load', () => {
    const center = modelViewer.getBoundingBoxCenter();
    const size = modelViewer.getDimensions();
    const x2 = size.x / 2;
    const y2 = size.y / 2;
    const z2 = size.z / 2;

    modelViewer.updateHotspot({
        name: 'hotspot-dot+X-Y+Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim+X-Y',
        position: `${center.x + x2} ${center.y - y2} ${center.z}`
    });

    modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent =
        `${(size.z * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot+X-Y-Z',
        position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim+X-Z',
        position: `${center.x + x2} ${center.y} ${center.z - z2}`
    });

    modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent =
        `${(size.y * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot+X+Y-Z',
        position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim+Y-Z',
        position: `${center.x} ${center.y + y2} ${center.z - z2}`
    });

    modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent =
        `${(size.x * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot-X+Y-Z',
        position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim-X-Z',
        position: `${center.x - x2} ${center.y} ${center.z - z2}`
    });

    modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent =
        `${(size.y * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot-X-Y-Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
    });

    modelViewer.updateHotspot({
        name: 'hotspot-dim-X-Y',
        position: `${center.x - x2} ${center.y - y2} ${center.z}`
    });

    modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent =
        `${(size.z * 100).toFixed(0)} cm`;

    modelViewer.updateHotspot({
        name: 'hotspot-dot-X-Y+Z',
        position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
    });

    // update svg
    function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
        if (dotHotspot1 && dotHotspot1) {
            svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
            svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
            svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
            svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

            // use provided optional hotspot to tie visibility of this svg line to
            if (dimensionHotspot && !dimensionHotspot.facingCamera) {
                svgLine.classList.add('hide');
            }
            else {
                svgLine.classList.remove('hide');
            }
        }
    }

    const lines = modelViewer.querySelectorAll('line');

    // use requestAnimationFrame to update with renderer
    const startSVGRenderLoop = () => {
        drawLine(lines[0], modelViewer.queryHotspot('hotspot-dot+X-Y+Z'), modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Y'));
        drawLine(lines[1], modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Z'));
        drawLine(lines[2], modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X+Y-Z')); // always visible
        drawLine(lines[3], modelViewer.queryHotspot('hotspot-dot-X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dim-X-Z'));
        drawLine(lines[4], modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y+Z'), modelViewer.queryHotspot('hotspot-dim-X-Y'));
        requestAnimationFrame(startSVGRenderLoop);
    };

    startSVGRenderLoop();
});

// ! Annotations

// modelViewerTexture.addEventListener('click', function (event) {
//     const hotspotCounter = Math.floor((1 + Math.random()) * 0x10000)
//         .toString(16)
//         .substring(1);
//     const x = event.clientX;
//     const y = event.clientY;

//     const dataPosition = modelViewerTexture.positionAndNormalFromPoint(x, y);

//     if (dataPosition == null) {
//         return;
//     }

//     const { position, normal } = dataPosition;

//     modelViewerTexture.innerHTML += `<button
//                                         class="hotspot"
//                                         slot="hotspot-${hotspotCounter}"
//                                         data-position="${position?.x + ' ' + position?.y + ' ' + position?.z}"
//                                         data-normal="${normal?.x + ' ' + normal?.y + ' ' + normal?.z}"
//                                     ></button>`
// });