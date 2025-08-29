export interface Chakra {
    name: string;
    frequency: number;
    color: string;
    position: [number, number, number]; // [x, y, z] Position relativ zum Avatar
    ledFrequency: number;
    audioBaseFrequency: number;
}

export const CHAKRAS: Chakra[] = [
    {
        name: "Kronenchakra",
        frequency: 40, // Hz
        color: "#9B59B6",
        position: [0, 1.2, 0],
        ledFrequency: 40,
        audioBaseFrequency: 400
    },
    {
        name: "Stirnchakra",
        frequency: 32, // Hz
        color: "#3498DB",
        position: [0, 1.0, 0.1],
        ledFrequency: 32,
        audioBaseFrequency: 360
    },
    {
        name: "Halschakra",
        frequency: 24, // Hz
        color: "#2ECC71",
        position: [0, 0.8, 0],
        ledFrequency: 24,
        audioBaseFrequency: 320
    },
    {
        name: "Herzchakra",
        frequency: 16, // Hz
        color: "#F1C40F",
        position: [0, 0.5, 0],
        ledFrequency: 16,
        audioBaseFrequency: 280
    },
    {
        name: "Solarplexuschakra",
        frequency: 8, // Hz
        color: "#E67E22",
        position: [0, 0.2, 0],
        ledFrequency: 8,
        audioBaseFrequency: 240
    },
    {
        name: "Sakralchakra",
        frequency: 4, // Hz
        color: "#E74C3C",
        position: [0, -0.1, 0],
        ledFrequency: 4,
        audioBaseFrequency: 200
    },
    {
        name: "Wurzelchakra",
        frequency: 2, // Hz
        color: "#C0392B",
        position: [0, -0.4, 0],
        ledFrequency: 2,
        audioBaseFrequency: 160
    }
];
