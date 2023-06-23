import handleChange from "../../src/components/handleChange";

describe("handleChange", () => {
    let setFormData;
    let setSightingData;
    let step;
    let totalSteps;

    beforeEach(() => {
        setFormData = jest.fn();
        setSightingData = jest.fn();
    });

    test('should correctly update formData', () => {
        step = 1;
        totalSteps = 4;

        const mockEvent = { target: { name: "date", value: "2023-06-23" } };
        handleChange(setFormData, setSightingData, step, totalSteps)(mockEvent);

        expect(setFormData).toBeCalled();
        expect(setFormData.mock.calls[0][0]({})).toEqual({ date: '2023-06-23' });
    });

    test('should correctly update sightingData', () => {
        step = 2;
        totalSteps = 4;

        const mockEvent = { target: { name: "Turtles", value: "5" } };
        handleChange(setFormData, setSightingData, step, totalSteps)(mockEvent);

        const prevData = [
            { name: "Turtles", defaultValue: "0", step: 2 },
            { name: "Sharks", defaultValue: "0", step: 2 },
        ];

        expect(setSightingData).toBeCalled();
        expect(setSightingData.mock.calls[0][0]({})).toEqual([
            { name: "Turtles", defaultValue: "5", step: 2 },
            { name: "Sharks", defaultValue: "0", step: 2 },
            ]);
    });
});
