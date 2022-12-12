const dynamicMaterials = [
    {
        name: 'roofSelect',
        label: 'Roof',
        index: [6, 9, 13, 16, 18, 20, 22]
    },
    {
        name: 'backSelect',
        label: 'Back',
        index: [1, 11, 12, 17, 19]
    }
]

const materialGroup = [
    {
        name: "foil",
        category: 'roofSelect',
        index: [20, 13],
    },
    {
        name: "shingles",
        category: 'roofSelect',
        index: [6, 18, 22],
    },
    {
        name: "straws",
        category: 'roofSelect',
        index: [6, 9, 13, 16, 18],
    },
    {
        name: "roofDefault",
        category: 'roofSelect',
        index: [6, 18],
    },
    {
        name: "glassBack",
        category: 'backSelect',
        index: [1, 11, 12, 19],
    },
    {
        name: "woodBack",
        category: 'backSelect',
        index: [17],
    },
];

export { dynamicMaterials, materialGroup }