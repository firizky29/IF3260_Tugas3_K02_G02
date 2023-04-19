const Converter = {
    radToDeg(rad) {
        return (rad * 180) / Math.PI;
    },

    degToRad(deg) {
        return (deg / 180) * Math.PI;
    },
};