export function connect(list, value) {
    if (!exist(list, value)) list.push(value);
    return function disconnect() {
        list.splice(list.indexOf(value) >>> 0, 1);
    };
}

export function exist(list, value) {
    return list.indexOf(value) > -1;
}

/**
 * create a random string
 * @param {string} prefix - string to add the random group
 * @param {number} size - longitud del grupo aleatorio
 * @return {string}
 */
export function createId(prefix, size = 3) {
    let range =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        id = prefix;
    while (size) {
        --size;
        id += range.charAt(Math.floor(Math.random() * range.length));
    }
    return id;
}
/**
 * create a unique classname
 * @param {string} prefix - string to add the random group
 * @param {number} size - longitud del grupo aleatorio
 * @return {string}.
 */
export function createCn(prefix = "", size = 3) {
    let className = createId(prefix, size);
    if (document.getElementsByClassName(className).length) {
        return createCn(prefix, size + 1);
    } else {
        return className;
    }
}
