function promTimeout(header, ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Resolve from func: ${header}`);
            resolve(`hello ${header}`);
        }, ms);
    })
}

let count = 1;
const prom_arr = [];
while (count <= 3) {
    const a = 2;
    prom_arr.push(promTimeout(count, count * 1000));
    count++;
}
(async () => {
    const values = await Promise.all(prom_arr);
    console.log('Final: ', values);
})();
