const unitConverter = {
    convertDepthToForm: (depth, units) => {
        if (units === 'imperial') {
            return Math.round(depth * 3.28084);
        }
        return depth;
    },
    convertDepthToDatabase: (depth, units) => {
        if (units === 'imperial') {
            return Math.round(depth / 3.28084);
        }
        return depth;
    },
    convertTempToForm: (temp, units) => {
        if (units === 'imperial') {
            return Math.round((temp * 9) / 5 + 32);
        }
        return temp;
    },
    convertTempToDatabase: (temp, units) => {
        if (units === 'imperial') {
            return Math.round(((temp - 32) * 5) / 9);
        }
        return temp;
    }
};

export default unitConverter;
