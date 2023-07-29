export const NumberHelpers = {
    toDefautFormat
}

function toDefautFormat(number) {
    return new Intl.NumberFormat().format(number);
}