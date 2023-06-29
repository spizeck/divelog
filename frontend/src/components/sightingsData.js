const validateCount = (value) => {
    if (value < 0) {
        return "Count must be greater than or equal to 0";
    }
    return null;
};

const sightingsData = [
    { name: 'Green Turtle', defaultValue: 0, step: 2, validate: validateCount }, // step = the rendering step
    { name: 'Hawksbill Turtle', defaultValue: 0, step: 2, validate: validateCount },
    { name: 'Caribbean Reef Shark', defaultValue: 0, step: 2, validate: validateCount },
    { name: 'Blacktip Reef Shark', defaultValue: 0, step: 2, validate: validateCount },
    { name: 'Nurse Shark', defaultValue: 0, step: 2, validate: validateCount },
    { name: 'Roughtail Stingray', defaultValue: 0, step: 3, validate: validateCount },
    { name: 'Southern Stingray', defaultValue: 0, step: 3, validate: validateCount },
    { name: 'Spotted Eagle Ray', defaultValue: 0, step: 3, validate: validateCount },
    { name: 'Nassau Grouper', defaultValue: 0, step: 3, validate: validateCount },
    { name: 'Yellowfin Grouper', defaultValue: 0, step: 3, validate: validateCount },
    { name: 'Tiger Grouper', defaultValue: 0, step: 3, validate: validateCount },
    { name: 'Longspine Sea Urchin', defaultValue: 0, step: 4, validate: validateCount },
    { name: 'Sea Egg', defaultValue: 0, step: 4, validate: validateCount },
    { name: 'Pencil Urchin', defaultValue: 0, step: 4, validate: validateCount },
    { name: 'Magnificent Urchin', defaultValue: 0, step: 4, validate: validateCount },
    { name: 'Reef Urchin', defaultValue: 0, step: 4, validate: validateCount },
    { name: 'Variegated Urchin', defaultValue: 0, step: 4, validate: validateCount },
    { name: 'Red-tipped Sea Goddess', defaultValue: 0, step: 5, validate: validateCount },
    { name: 'Lettus Sea Slug', defaultValue: 0, step: 5, validate: validateCount },
    { name: 'Leech Head Shield Slug', defaultValue: 0, step: 5, validate: validateCount },
    { name: 'Flamingo Tongue', defaultValue: 0, step: 5, validate: validateCount },
    { name: 'Fingerprint Cyphoma', defaultValue: 0, step: 5, validate: validateCount },
    { name: 'White-nosed Pipefish', defaultValue: 0, step: 6, validate: validateCount },
    { name: 'Long Snout Seahorse', defaultValue: 0, step: 6, validate: validateCount },
    { name: 'Longlure Frogfish', defaultValue: 0, step: 6, validate: validateCount },
    { name: 'Red-lipped Batfish', defaultValue: 0, step: 6, validate: validateCount },
    { name: 'Lionfish Alive', defaultValue: 0, step: 6, validate: validateCount },
    { name: 'Lionfish Dead', defaultValue: 0, step: 6, validate: validateCount },
];

export default sightingsData;
