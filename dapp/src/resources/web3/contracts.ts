const contractAddresses = {
    WATT_ENERGY_TOKEN: "0xe63ab7eD5caFaf72AA4214c6fB89A1D26a2761aE",
    WATT_TRADER: "0x420b7ffD558257976ee0AfA447F22272CAc67248"
} as const;

export const getContractAddress = (name: keyof typeof contractAddresses) => {
    return contractAddresses[name];
}

